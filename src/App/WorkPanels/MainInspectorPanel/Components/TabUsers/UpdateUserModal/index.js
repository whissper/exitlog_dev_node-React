import React, { useState, useContext, useEffect } from 'react';
import './UpdateUserModal.css';
import { 
    Modal, 
    Button,
    Form, 
    InputGroup, 
    FormControl 
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBuilding, 
    faUser
} from '@fortawesome/free-solid-svg-icons';
import fetchData from 'App/Utils/fetchData';
import processException from 'App/Utils/processException';
import { AppDispatch } from 'App/Utils/useAppReducer';
import { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer';


function UpdateUserModal(props) {

    const appDispatch = useContext(AppDispatch);
    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);

    const loadingTriggers = [
        () => { appDispatch({ type: 'setIsLoad', isLoad: true }); },
        () => { appDispatch({ type: 'setIsLoad', isLoad: false }); }
    ];

    const { data } = props;

    const [userCredentials, setUserCredentials] = useState({
        depName: '',
        userFio: '',
        userPassword: '' 
    });

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setUserCredentials((prevVal) => (
            {...prevVal, [name]: value}
        ));
    };

    const selectUserByID = async () => {
        const textResponse = await fetchData(
            'select_user_by_id',
            { id: data.userID },
            ...loadingTriggers
        );

        const response = {
            message: textResponse,
            methodName: 'TabUsers.UpdateUserModal.selectUserByID()',
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

            setUserCredentials((prevVal) => ({
                ...prevVal,
                depName: fields.departmentnameUserUpd,
                userFio: fields.fioUserUpd
            }));
        }
    };

    useEffect(() => {
        if (data.show) {
            selectUserByID();
            return () => {
                setUserCredentials((prevVal) => ({
                    depName: '',
                    userFio: '',
                    userPassword: ''
                }));
            };
        }//eslint-disable-next-line
    }, [data.show]);

    const handleClose = () => {
        mainInspectorPanelDispatch({
            type: 'setUpdateUserModal',
            updateUserModalData: {
                show: false
            }
        });
    };

    const handleSave = async () => {        
        const userCredentialsParams = {
            id: data.userID,
            fio: userCredentials.userFio.trim(),
            pass: userCredentials.userPassword,
            firstlogin: '1'
        };
        
        const textResponse = await fetchData(
            'update_user',
            userCredentialsParams,
            ...loadingTriggers
        );
        
        mainInspectorPanelDispatch({
            type: 'setUpdateUserModal',
            updateUserModalData: {
                show: false
            }
        });

        const response = {
            message: textResponse,
            methodName: 'TabUsers.UpdateUserModal.handleSave()',
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
                <Modal.Title>Изменение данных пользователя</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <InputGroup className="sav2-mb-1">
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faBuilding} size="1x" />
                                    &nbsp;&nbsp;Подразделение&nbsp;:
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl disabled value={userCredentials.depName} />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group>
                        <InputGroup className="sav2-mb-1">
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faUser} size="1x" />
                                    &nbsp;&nbsp;Сотрудник&nbsp;:
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl name="userFio"
                                onChange={handleChange} 
                                value={userCredentials.userFio} />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group>
                        <InputGroup className="sav2-mb-1">
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    Пароль&nbsp;:
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl name="userPassword" type="password"
                                onChange={handleChange} 
                                value={userCredentials.userPassword} />
                        </InputGroup>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSave}>Сохранить</Button>
                <Button variant="secondary" onClick={handleClose}>Отмена</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdateUserModal;
