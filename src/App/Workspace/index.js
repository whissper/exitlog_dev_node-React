import React from 'react';
import './Workspace.css';
import { Container } from 'react-bootstrap';
import LoginForm from 'App/WorkPanels/LoginForm';
import MainInspectorPanel from 'App/WorkPanels/MainInspectorPanel';
import CreatePasswordForm from 'App/WorkPanels/CreatePasswordForm';
import LoginFormLockedUser from 'App/WorkPanels/LoginFormLockedUser';
import InspectorPanel from 'App/WorkPanels/InspectorPanel';


function Workspace(props) {

    const { wsID, panelData } = props;

    const getWorkPanel = (ID) => {
        switch (ID) {
            case '-2': 
                return <CreatePasswordForm panelData={panelData} />;
            case '-1':
                return <LoginFormLockedUser />;
            case '0':
                return <LoginForm />;
            case '1':
                return <MainInspectorPanel panelData={panelData} />;
            case '3':
                return <InspectorPanel panelData={panelData} />;
            default:
                return null;
        }
    };

    return (
        <Container className="sav2-main-cont">
            {getWorkPanel(wsID)}
        </Container>
    );
}

export default Workspace;
