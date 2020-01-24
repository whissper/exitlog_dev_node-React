import React, { useContext } from 'react';
import './MainMenu.css';
import {AppDispatch} from 'App/Utils/useAppReducer';
import {MainInspectorPanelDispatch} from 'App/Utils/useMainInspectorPanelReducer';
import fetchData from 'App/Utils/fetchData';
import processException from 'App/Utils/processException';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';


function MainMenu(props) {

    const appDispatch = useContext(AppDispatch);
    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);

    const loadingTriggers = [
        () => { appDispatch({ type: 'setIsLoad', isLoad: true }); },
        () => { appDispatch({ type: 'setIsLoad', isLoad: false }); }
    ];

    const { data, panelData } = props;

    const logoutIsClicked = async () => {
        const textResponse = await fetchData(
            'logout',
            { id: '0' },
            ...loadingTriggers
        );

        const response = {
            message: textResponse,
            methodName: 'InspectorPanel.MainMenu.logoutIsClicked()'
        };

        if (!processException(response)) {
            appDispatch({
                type: 'setPanelData',
                panelData: {
                    panelID: '0',
                    userID: '',
                    userFIO: '',
                    depID: '',
                    depName: ''
                }
            });
        }
    };

    const menuButtonIsClicked = (e) => {
        const menuButtonID = e.target.id;

        let freshPanelTabs = {};

        for (let item in data) {
            if (item === menuButtonID) {
                freshPanelTabs[item] = true;
            } else {
                freshPanelTabs[item] = false;
            }
        }
        
        mainInspectorPanelDispatch({
            type: 'setPanelTabs',
            panelTabs: freshPanelTabs
        });
    };

    const goToDocXIsClicked = () => {
        window.location = 'http://kom-es01-app25:8888/docx/';
    };

    const goToActsIsClicked = () => {
        window.location = "http://kom-es01-app25:8888/acts/";
    };

    return (
        <Row>
            <Col lg={12}>
                <ButtonGroup className="flex-wrap">
                    <Button variant="outline-secondary" active={data.showNewRecordTab} onClick={menuButtonIsClicked} id="showNewRecordTab">Новая запись</Button>
                    <Button variant="outline-secondary" active={data.showLogTab} onClick={menuButtonIsClicked} id="showLogTab">Журнал</Button>
                    <Button variant="outline-info" onClick={goToDocXIsClicked} >Акт обследования</Button>
                    {(panelData.depID === 2 || panelData.depID === 3) &&
                        <Button variant="outline-info" onClick={goToActsIsClicked} >Бланки Ухта</Button>
                    }
                    <Button variant="primary" onClick={logoutIsClicked} >Выйти</Button>
                </ButtonGroup>
            </Col>
        </Row>
    );
}

export default MainMenu;
