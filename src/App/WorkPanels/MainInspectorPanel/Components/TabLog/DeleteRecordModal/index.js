import React, { useContext } from 'react';
import './DeleteRecordModal.css';
import { Modal, Button } from 'react-bootstrap';
import { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer';
import { AppDispatch } from 'App/Utils/useAppReducer';
import fetchData from 'App/Utils/fetchData';
import processException from 'App/Utils/processException';


function DeleteRecordModal(props) {

    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);
    const appDispatch = useContext(AppDispatch);

    const loadingTriggers = [
        () => { appDispatch({ type: 'setIsLoad', isLoad: true }); },
        () => { appDispatch({ type: 'setIsLoad', isLoad: false }); }
    ];

    const { data } = props;

    const handleClose = () => {
        mainInspectorPanelDispatch({
            type: 'setDeleteRecordModal',
            deleteRecordModalData: {
                show: false
            }
        });
    };

    const handleDelete = async () => {
        const textResponse = await fetchData(
            'delete_exit',
            { id: data.exitID },
            ...loadingTriggers
        );

        mainInspectorPanelDispatch({
            type: 'setDeleteRecordModal',
            deleteRecordModalData: {
                show: false
            }
        });

        const response = {
            message: textResponse,
            methodName: 'DeleteRecordModal.handleDelete()',
            representError: (errorInfo) => {
                mainInspectorPanelDispatch({
                    type: 'setInfoBox',
                    infoBoxData: { variant: 'danger', text: errorInfo, show: true }
                });
            }
        }

        if (!processException(response)) {
            mainInspectorPanelDispatch({
                type: 'setInfoBox',
                infoBoxData: { variant: 'success', text: textResponse, show: true }
            });
        }
    };

    return (
        <Modal show={data.show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Удаление записи</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Удалить данную запись (и все связанные с ней объекты) под id: {data.exitID}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleDelete}>Удалить</Button>
                <Button variant="secondary" onClick={handleClose}>Отмена</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteRecordModal;