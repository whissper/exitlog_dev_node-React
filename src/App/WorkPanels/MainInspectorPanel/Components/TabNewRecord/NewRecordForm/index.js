import React, { useContext, useEffect, useRef } from 'react';
import './NewRecordForm.css';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMapMarkedAlt, faClock, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import ExitObject from './ExitObject';
import { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer';
import Inputmask from 'inputmask';


function NewRecordForm(props) {

    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);

    const { pointsData, data } = props;

    const timeExitInput = useRef(null);
    const timeReturnInput = useRef(null);

    //Input-Mask -- start --
    useEffect(() => {
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
    }, []);

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

        await mainInspectorPanelDispatch({
            type: 'setNewRecordData',
            newRecordData: { [name]: value }
        });

        if (name === 'pointid' && value !== '5') {
            mainInspectorPanelDispatch({
                type: 'setNewRecordData',
                newRecordData: { point_description: '' }
            });
        }
    };

    const handleAddObject = () => {
        let newIndex = 1;

        if (data.objects.length !== 0) {
            const indexes = data.objects.map((object) => (object.objectIndex));
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

        mainInspectorPanelDispatch({
            type: 'addExitObject',
            addedObject: newObject
        });
    };

    const handleAddRecord = () => {
        mainInspectorPanelDispatch({
            type: 'setInsertNewRecordModal',
            insertNewRecordModalData: { show: true }
        });
    };

    const handleObjectUpdate = (object) => {
        mainInspectorPanelDispatch({
            type: 'updateExitObject',
            object: object
        });
    };

    const handleObjectDelete = (objectIndex) => {
        mainInspectorPanelDispatch({
            type: 'deleteExitObject',
            objectIndex: objectIndex
        });
    };

    return (
        <React.Fragment>
            <Row>
                <Col lg={6}>
                    <Form.Group>
                        <Form.Label>
                            <FontAwesomeIcon icon={faPencilAlt} size="1x" />
                            &nbsp;Цель выхода :
                        </Form.Label>
                        <Form.Control as="select" name="pointid"
                            value={data.pointid} onChange={handleChange}>
                            {getOptions()}
                        </Form.Control>
                        <br />
                        {
                            data.pointid === '5' &&
                            <Form.Control as="input" type="text" name="point_description"
                                value={data.point_description} onChange={handleChange} />
                        }
                    </Form.Group>
                </Col>
                <Col lg={6}>
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
                                value={data.time_exit} onChange={handleChange} ref={timeExitInput}
                                placeholder="00:00" />
                            <div className="input-group-prepend input-group-append">
                                <InputGroup.Text>до&nbsp;:</InputGroup.Text>
                            </div>
                            <Form.Control as="input" type="text" name="time_return"
                                value={data.time_return} onChange={handleChange} ref={timeReturnInput}
                                placeholder="00:00" />
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col lg={12}>
                    <hr />
                </Col>
                <Col lg={6}>
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
                </Col>
                <Col lg={12}>
                    <br />
                </Col>

                {
                    data.objects.map((object) => ( 
                        <ExitObject key={object.objectIndex.toString()} 
                            objectIndex={object.objectIndex} 
                            data={data.objects}
                            onObjectUpdate={handleObjectUpdate}
                            onObjectDelete={handleObjectDelete} /> 
                    ))
                }

                <Col lg={12}>
                    <hr />
                </Col>
                <Col lg={12}>
                    <Button variant="primary" size="lg" onClick={handleAddRecord}>Записаться</Button>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default NewRecordForm;
