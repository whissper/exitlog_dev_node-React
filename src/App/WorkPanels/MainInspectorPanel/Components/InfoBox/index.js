import React, { useContext } from 'react';
import './InfoBox.css';
import { Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { faInfoCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer';


function InfoBox(props) {

    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);

    const { variant, text, show } = props.data;

    const closeInfoBox = () => {
        mainInspectorPanelDispatch({ type: 'setInfoBox', infoBoxData: {...props.data, show: false} });
    };

    let iconType = faTimesCircle;

    switch (variant) {
        case 'danger':
            iconType = faTimesCircle;
            break;
        case 'info':
            iconType = faInfoCircle;
            break;
        case 'success':
            iconType = faCheckCircle;
            break;
        default:
            iconType = faInfoCircle;
            break;
    }

    return (
        <Row>
            <Col lg={12}>
                <Alert variant={variant} dismissible onClose={closeInfoBox} show={show} >
                    <FontAwesomeIcon icon={iconType} size="lg" />
                    &nbsp;{text}
                </Alert>
            </Col>
        </Row>
    );
}

export default InfoBox;
