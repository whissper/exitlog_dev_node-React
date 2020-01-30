import React from 'react';
import './TopHeader.css';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNode, faReact } from '@fortawesome/free-brands-svg-icons'

function TopHeader(props) {

    return (
        <Container fluid className="sav2-top-header">
            <Row>
                <Col className="justify-content-center align-self-center">EXIT-LOG</Col>
                <Col xs="auto" className="justify-content-center align-self-center"> v 0.8.1</Col>
                <Col xs="auto" className="justify-content-center align-self-center">
                    <FontAwesomeIcon icon={faReact} size="3x" />
                </Col>
                <Col xs="auto" className="justify-content-center align-self-center">
                    <FontAwesomeIcon icon={faNode} size="4x" />
                </Col>
            </Row>
        </Container>
    );

}

export default TopHeader;