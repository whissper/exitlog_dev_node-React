import React, { useContext, useState, useEffect, useRef } from 'react';
import './UpdateRecordModal.css';
import { 
    Modal, 
    Button,
    Form, 
    InputGroup, 
    FormControl 
} from 'react-bootstrap';
import { AppDispatch } from 'App/Utils/useAppReducer';
import { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer';
import fetchData from 'App/Utils/fetchData';
import processException from 'App/Utils/processException';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, 
    faClock, 
    faCalendarCheck, 
    faPencilAlt,
    faMapMarkedAlt,
    faPlus 
} from '@fortawesome/free-solid-svg-icons';
import Inputmask from 'inputmask';
import ExitObject from 'App/WorkPanels/MainInspectorPanel/Components/TabNewRecord/NewRecordForm/ExitObject';
import processToArray from 'App/Utils/processToArray';


function UpdateRecordModal(props) {

    const appDispatch = useContext(AppDispatch);
    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);

    const loadingTriggers = [
        () => { appDispatch({ type: 'setIsLoad', isLoad: true }); },
        () => { appDispatch({ type: 'setIsLoad', isLoad: false }) }
    ];

    const { 
        panelData,
        data,
        pointsData 
    } = props;

    const timeExitInput = useRef(null);
    const timeReturnInput = useRef(null);

    const [exitFIO, setExitFIO] = useState('');
    const [exitDate, setExitDate] = useState('');
    const [timeExit, setTimeExit] = useState('');
    const [timeReturn, setTimeReturn] = useState('');
    const [pointID, setPointID] = useState('5');
    const [pointDescription, setPointDescription] = useState('');
    const [objects, setObjects] = useState([]);

    //Input-Mask -- start --
    useEffect(() => {
        if (data.show) {
            //autocomplete + dispatch event
            const dispatchChangeEvent = (element) => {
                let elementVal = element.value.replace(/_/g, '0');
                let hoursNminutes = elementVal.split(':');
                if (parseInt(hoursNminutes[0])>18) {
                    hoursNminutes[0]='18';
                }
                if (parseInt(hoursNminutes[0])<9) {
                    hoursNminutes[0]='09';
                }
                if (parseInt(hoursNminutes[1])>59) {
                    hoursNminutes[1]='59';
                }
                element.value = hoursNminutes[0]+':'+hoursNminutes[1];
                const ev = new Event('change', { bubbles: true });
                element.dispatchEvent(ev);
            };

            const timeExitElement = timeExitInput.current;
            const timeReturnElement = timeReturnInput.current;

            //time_exit
            Inputmask({
                mask: "99:99", 
                greedy: false,
                oncomplete: () => {
                    dispatchChangeEvent(timeExitElement);
                },
                onincomplete: () => {
                    dispatchChangeEvent(timeExitElement);
                }
            }).mask(timeExitElement);

            //time_return
            Inputmask({
                mask: "99:99", 
                greedy: false,
                oncomplete: () => {
                    dispatchChangeEvent(timeReturnElement);
                },
                onincomplete: () => {
                    dispatchChangeEvent(timeReturnElement);
                }
            }).mask(timeReturnElement);
        
            return () => {
                Inputmask.remove(timeExitElement);
                Inputmask.remove(timeReturnElement);
            };
        }
    }, [data.show]);

    const selectExitByID = async () => {
        const textResponse = await fetchData(
            'select_exit_by_id',
            { id: data.exitID },
            ...loadingTriggers
        );

        const response = {
            message: textResponse,
            methodName: 'TabLog.UpdateRecordModal.selectExitByID()',
            representError: (errorInfo) => {
                mainInspectorPanelDispatch({
                    type: 'setInfoBox',
                    infoBoxData: { variant: 'danger', text: errorInfo, show: true }
                });
            }
        };

        if (!processException(response)) {
            const jsonResponse = JSON.parse(textResponse);            
            const fields = jsonResponse.fields;

            setExitFIO((prevVal) => (fields.fioExitUpd));
            setExitDate((prevVal) => (fields.dateExitUpd));
            setTimeExit((prevVal) => (fields.timeexitExitUpd));
            setTimeReturn((prevVal) => (fields.timereturnExitUpd));
            setPointID((prevVal) => (fields.pointExitUpd.toString()));
            setPointDescription((prevVal) => (fields.pointDescriptionExitUpd));
            setObjects((prevVal) => (
                fields.objectsExitUpd.map((item, index) => (
                    {
                        objectIndex: index,
                        fields: {
                            name        : item[0],
                            note        : item[1],
                            postalindex : item[2],
                            region      : item[3],
                            town        : item[4],
                            street      : item[5],
                            building    : item[6],
                            apartment   : item[7],
                            geolat      : item[8],
                            geolon      : item[9],
                            oldformat   : item[10].toString()
                        }
                    }
                ))
            ));
        }
    };

    useEffect(() => {
        if (data.show) {
            selectExitByID();
            return () => {
                setExitFIO((prevVal) => (''));
                setExitDate((prevVal) => (''));
                setTimeExit((prevVal) => (''));
                setTimeReturn((prevVal) => (''));
                setPointID((prevVal) => ('5'));
                setPointDescription((prevVal) => (''));
                setObjects((prevVal) => ([]));
            };
        }//eslint-disable-next-line
    }, [data.show]);

    const getOptions = () => {
        let options = [];

        if (pointsData.length !== 0) {
            pointsData.forEach(item => {
                options.push(<option key={item.id.toString()} value={item.id.toString()}>{item.name}</option>);
            });
        }

        options.push(<option key="5" value="5">Другое:</option>);

        return options;
    };

    const handleChange = async (e) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name === 'time_exit') {
            setTimeExit((prevValue) => (value));
        } else if (name === 'time_return') {
            setTimeReturn((prevValue) => (value));
        }
    };

    const handleAddObject = () => {
        let newIndex = 1;

        if (objects.length !== 0) {
            const indexes = objects.map((object) => (object.objectIndex));
            newIndex = Math.max(...indexes) + 1;         
        }

        const newObject = { 
            objectIndex: newIndex,
            fields: {
                name        : '',
                note        : '',
                postalindex : '',
                region      : '',
                town        : '',
                street      : '',
                building    : '',
                apartment   : '',
                geolat      : '',
                geolon      : '',
                oldformat   : '1'
            }
        };

        setObjects((curObjects) => (
            [...curObjects, newObject]
        ));
    };

    const handleClose = () => {
        mainInspectorPanelDispatch({
            type: 'setUpdateRecordModal',
            updateRecordModalData: {
                show: false
            }
        });
    };

    const handleObjectUpdate = (objectVal) => {
        let objectsAfterUpd = [];

        objects.forEach((object) => {
            if (object.objectIndex !== objectVal.objectIndex) {
                objectsAfterUpd.push(object);
            } else {
                objectsAfterUpd.push({
                    objectIndex: objectVal.objectIndex,
                    fields: { ...object.fields, ...objectVal.fields }
                });
            }
        });
        
        setObjects((curObjects) => (objectsAfterUpd));
    };

    const handleObjectDelete = (objectIndex) => {
        const objectsAfterDel = objects.filter((object) => (
            object.objectIndex !== objectIndex
        ));

        setObjects((curObjects) => (objectsAfterDel));
    };

    const handleSave = async () => {
        const arrayOfObjects = objects.map((object) => (processToArray(object.fields)));
        const jsonStringObjects = JSON.stringify({ objects: arrayOfObjects });
         
        const objectParams = {
            id: data.exitID,
            objects: jsonStringObjects,
            timeexit: timeExit,
            timereturn: timeReturn
        };

        const textResponse = await fetchData(
            'update_exit',
            objectParams,
            ...loadingTriggers
        );
        
        mainInspectorPanelDispatch({
            type: 'setUpdateRecordModal',
            updateRecordModalData: {
                show: false
            }
        });

        const response = {
            message: textResponse,
            methodName: 'TabLog.UpdateRecordModal.handleSave()',
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
                infoBoxData: { variant: 'info', text: textResponse, show: true }
            });
        }
    };

    return(
        <Modal show={data.show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Изменение данных записи по выходу</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <InputGroup className="sav2-mb-1">
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faUser} size="1x" />
                                    &nbsp;&nbsp;Сотрудник&nbsp;:
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl disabled value={exitFIO} />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            <FontAwesomeIcon icon={faCalendarCheck} size="1x" />
                            &nbsp;Дата выхода :
                        </Form.Label>
                        <Form.Control disabled value={exitDate} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            <FontAwesomeIcon icon={faClock} size="1x" />
                            &nbsp;Время :
                        </Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>с&nbsp;:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control as="input" type="text" name="time_exit"
                                value={timeExit} onChange={handleChange} ref={timeExitInput}
                                placeholder="00:00" />
                            <div className="input-group-prepend input-group-append">
                                <InputGroup.Text>до&nbsp;:</InputGroup.Text>
                            </div>
                            <Form.Control as="input" type="text" name="time_return"
                                value={timeReturn} onChange={handleChange} ref={timeReturnInput}
                                placeholder="00:00" />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            <FontAwesomeIcon icon={faPencilAlt} size="1x" />
                            &nbsp;Цель выхода :
                        </Form.Label>
                        <Form.Control as="select" name="pointid"
                            value={pointID} disabled>
                            {getOptions()}
                        </Form.Control>
                        <br />
                        {
                            pointID === '5' &&
                            <Form.Control as="input" type="text" name="point_description"
                                value={pointDescription} disabled />
                        }
                    </Form.Group>

                    <Form.Group>
                        <InputGroup>
                            <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faMapMarkedAlt} size="1x" />
                                    </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control as="input" type="text" disabled value="Объекты :" />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={handleAddObject}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>

                    {
                        objects.map((object) => ( 
                            <ExitObject key={object.objectIndex.toString()}
                                panelData={panelData} 
                                objectIndex={object.objectIndex} 
                                data={objects}
                                onObjectUpdate={handleObjectUpdate}
                                onObjectDelete={handleObjectDelete} /> 
                        ))
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSave}>Сохранить</Button>
                <Button variant="secondary" onClick={handleClose}>Отмена</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdateRecordModal;
