import React, { useContext } from 'react';
import './InsertNewRecordModal.css';
import { 
    Modal, 
    Button, 
    Table, 
    Badge, 
    OverlayTrigger, 
    Tooltip 
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer'
import { AppDispatch } from 'App/Utils/useAppReducer';
import fetchData from 'App/Utils/fetchData';
import processException from 'App/Utils/processException';
import processToArray from 'App/Utils/processToArray';

function InsertNewRecordModal(props) {

    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);
    const appDispatch = useContext(AppDispatch);

    const loadingTriggers = [
        () => { appDispatch({ type: 'setIsLoad', isLoad: true }); },
        () => { appDispatch({ type: 'setIsLoad', isLoad: false }); }
    ];

    const {
        data,
        newRecordData,
        panelData,
        pointsData
    } = props;

    const handleClose = () => {
        mainInspectorPanelDispatch({
            type: 'setInsertNewRecordModal',
            insertNewRecordModalData: { show: false }
        });
    };

    const handleAdd = async () => {
        const newRecord = {
            userid              : newRecordData.userid.toString(),
            pointid             : newRecordData.pointid,
            point_description   : newRecordData.point_description,
            time_exit           : newRecordData.time_exit,
            time_return         : newRecordData.time_return,
            objects             : newRecordData.objects.map(
                                    (object) => (processToArray(object.fields))
                                  )
        };

        const textResponse = await fetchData(
            'insert_newrecord',
            { newRecordJSON: JSON.stringify(newRecord) },
            ...loadingTriggers
        );

        await mainInspectorPanelDispatch({
            type: 'setNewRecordData',
            newRecordData: {
                pointid: '1',
                point_description: '',
                time_exit: '',
                time_return: '',
                objects: []
            }
        });

        mainInspectorPanelDispatch({
            type: 'setInsertNewRecordModal',
            insertNewRecordModalData: { show: false }
        });

        const response = {
            message: textResponse,
            methodName: 'InsertNewRecordModal.handleAdd()',
            representError: (errorInfo) => {
                mainInspectorPanelDispatch({
                    type: 'setInfoBox',
                    infoBoxData: { variant: 'danger', text: errorInfo, show: true }
                });
            }
        };

        if (!processException(response)) {
            mainInspectorPanelDispatch({
                type: 'setInfoBox',
                infoBoxData: { variant: 'success', text: textResponse, show: true }
            });
        }
    };

    const point = pointsData.find(
        (point) => (point.id === parseInt(newRecordData.pointid))
    );

    return (
        <Modal show={data.show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Добавление новой записи в журнал</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Данные новой записи:</p>
                <Table bordered hover>
                    <tbody>
                        <tr>
                            <td>Сотрудник:</td>
                            <td>{panelData.userFIO}</td>
                        </tr>
                        <tr>
                            <td>Цель выхода:</td>
                            <td>
                                {point ? point.name.trim() : 'Другое: '} 
                                {newRecordData.point_description}
                            </td>
                        </tr>
                        <tr>
                            <td>Время выхода:</td>
                            <td>{newRecordData.time_exit}</td>
                        </tr>
                        <tr>
                            <td>Время возврата:</td>
                            <td>{newRecordData.time_return}</td>
                        </tr>
                        <tr>
                            <td>Объекты:</td>
                            <td>
                                <ul>
                                    {
                                        newRecordData.objects.map(
                                            (object) => (
                                                <li key={object.objectIndex.toString()}>
                                                    {object.fields.name.trim()}&nbsp;
                                                    {
                                                        object.fields.note.trim() !== '' &&   
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                                <Tooltip id={object.objectIndex.toString()}>
                                                                    {object.fields.note.trim()}
                                                                </Tooltip>    
                                                            }>
                                                            <Badge variant="info" className="note-label">
                                                                <FontAwesomeIcon icon={faComment} />
                                                                &nbsp;{object.fields.note.trim()}
                                                            </Badge>
                                                        </OverlayTrigger>
                                                    }
                                                </li>      
                                            )
                                        )
                                    }
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleAdd}>Добавить</Button>
                <Button variant="secondary" onClick={handleClose}>Отмена</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default InsertNewRecordModal;
