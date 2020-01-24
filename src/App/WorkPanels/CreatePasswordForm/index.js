import React, { useContext, useState } from 'react';
import './CreatePasswordForm.css';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import fetchData from 'App/Utils/fetchData';
import processException from 'App/Utils/processException';
import { AppDispatch } from 'App/Utils/useAppReducer';


function CreatePasswordForm(props) {

    const appDispatch = useContext(AppDispatch);

    const { panelData } = props;

    const loadingTriggers = [
        () => { appDispatch({ type: 'setIsLoad', isLoad: true }); },
        () => { appDispatch({ type: 'setIsLoad', isLoad: false }) }
    ];

    const [credentials, setCredentials] = useState({
        pwd: '',
        pwdRepeat: '',
        buttonActive: false
    });

    const { pwdRepeat, buttonActive} = credentials;

    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        setCredentials((prevCredentials) => {
            let active = false;

            if (name === 'pwd') {
                active = (value.length !== 0 && value === prevCredentials.pwdRepeat);
            } else if (name === 'pwdRepeat') {
                active = (value.length !== 0 && value === prevCredentials.pwd);
            }

            return { 
                ...prevCredentials, 
                [name]: value, 
                buttonActive: active 
            };
        });
    };

    const handleKeyPress = async (e) => {
        const charCode = e.charCode;
        //'Enter' key is pressed
        if (charCode === 13 && buttonActive) {
            await updateUser();
            keepWorkspace();
        }
    };

    const handleClick = async () => {
        await updateUser();
        keepWorkspace();
    };

    async function updateUser() {
        const updatedUser = {
            id: panelData.userID,
            fio: panelData.userFIO,
            pass: pwdRepeat,
            firstlogin: 0
        };

        const textResponse = await fetchData(
            'update_user',
            updatedUser,
            ...loadingTriggers
        );

        const response = {
            message: textResponse,
            methodName: 'CreatePasswordForm.updateUser()'
        };

        if (!processException(response)) {
            return textResponse;
        } else {
            return null;
        }

    }

    async function keepWorkspace() {
        const textResponse = await fetchData(
            'keep_workspace',
            { id: '0' },
            ...loadingTriggers
        );

        const response = {
            message: textResponse,
            methodName: 'CreatePasswordForm.keepWorkspace()'
        };

        if (!processException(response)) {
            const panelDataJSON = JSON.parse(textResponse);
            
            appDispatch({
                type: 'setPanelData', 
                panelData: panelDataJSON
            });
        }
    }


    return (
        <Row>
            <Col lg={12}>
                <Alert variant="success">
                    <FontAwesomeIcon icon={faUserCircle} size="lg" />
                    &nbsp;Первичный вход в систему. Пожалуйста, измените пароль на новый (уникальный) для своей учетной записи.
                </Alert>
            </Col>
            <Col lg={12}>
                <Form.Group>
                    <Form.Label>Пользователь:</Form.Label>
                    <Form.Control type="text" name="usr" readOnly value={panelData.userFIO} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Новый пароль:</Form.Label>
                    <Form.Control type="password" name="pwd" onChange={handleChange} onKeyPress={handleKeyPress} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Новый пароль (повторно):</Form.Label>
                    <Form.Control type="password" name="pwdRepeat" onChange={handleChange} onKeyPress={handleKeyPress} />
                </Form.Group>
                <Button disabled={!buttonActive} variant="primary" size="lg" block onClick={handleClick} >Изменить</Button>
            </Col>
        </Row>
    );
}

export default CreatePasswordForm;
