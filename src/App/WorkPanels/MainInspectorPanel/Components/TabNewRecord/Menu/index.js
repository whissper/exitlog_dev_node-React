import React from 'react';
import './Menu.css';
import { Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';


function Menu(props) {

    const { data } = props;

    return (
        <Row>
            <Col lg={12}>
                <Row>
                    <Col lg={4}>
                        <InputGroup className="sav2-mb-1">
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faUser} size="1x" />
                                    &nbsp;&nbsp;Сотрудник&nbsp;:
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl disabled value={data.userFIO} />
                        </InputGroup>
                    </Col>
                    <Col lg={8}>
                        <InputGroup className="sav2-mb-1">
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faBuilding} size="1x" />
                                    &nbsp;&nbsp;Подразделение&nbsp;:
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl disabled value={data.depName} />
                        </InputGroup>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default Menu;
