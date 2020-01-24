import React, { useRef, useEffect, useState, useContext } from 'react';
import './Menu.css';
import { Row, Col, Form, InputGroup, Button, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faCalendarAlt, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import formatDate from 'App/Utils/formatDate';
import { AppDispatch } from 'App/Utils/useAppReducer';
import { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer';
import fetchData from 'App/Utils/fetchData';
import processException from 'App/Utils/processException';


function Menu(props) {
    const appDispath = useContext(AppDispatch);
    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);

    const loadingTriggers = [
        () => { appDispath({ type: 'setIsLoad', isLoad: true }); },
        () => { appDispath({ type: 'setIsLoad', isLoad: false }); }
    ];

    const { data } = props;

    let sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [period, setPeriod] = useState({
        from: formatDate(sevenDaysAgo),
        till: formatDate(new Date())
    });

    const periodFromInput = useRef(null);
    const periodTillInput = useRef(null);

    useEffect(() => {
        const inputElements = [
            periodFromInput.current,
            periodTillInput.current
        ];

        inputElements.forEach((inputElement) => {
            window.jQuery(inputElement).on('change', handleChange);
        });

        return () => {
            inputElements.forEach((inputElement) => {
                window.jQuery(inputElement).off('change', handleChange);
            });
        };//eslint-disable-next-line
    }, []);

    useEffect(() => {
        const inputElements = [
            periodFromInput.current,
            periodTillInput.current
        ];

        inputElements.forEach((inputElement) => {
            window.jQuery(inputElement).datepicker({
                format: "dd-mm-yyyy",
                viewMode: "months",
                minViewMode: "days",
                language: 'ru'
            });
        });

        return () => {
            inputElements.forEach((inputElement) => {
                window.jQuery(inputElement).datepicker('destroy');
            });
        };//eslint-disable-next-line
    }, []);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        const periodFrom = (window.jQuery(periodFromInput.current).datepicker('getDate') || sevenDaysAgo);
        const periodTill = (window.jQuery(periodTillInput.current).datepicker('getDate') || new Date());

        if (periodFrom > periodTill) {
            setPeriod((prevPeriod) => (
                { from: value, till: value }
            ));
        } else {
            setPeriod((prevPeriod) => (
                { ...prevPeriod, [name]: value }
            ));
        }
    };

    const handleClick = async () => {
        const periodData = {
            startDate: period.from,
            endDate: period.till
        };

        const textResponse = await fetchData(
            'exitsReportSOAP',
            periodData,
            ...loadingTriggers
        );

        const response = {
            message: textResponse,
            methodName: 'TabLog.Menu.handleClick()',
            representError: (errorInfo) => {
                mainInspectorPanelDispatch({
                    type: 'setInfoBox',
                    infoBoxData: { variant: 'danger', text: errorInfo, show: true }
                });
            }
        };

        if (!processException(response)) {
            window.location = window.location.href + textResponse;

            mainInspectorPanelDispatch({
                type: 'setInfoBox',
                infoBoxData: { variant: 'info', text: 'Данные успешно выгрузились', show: true }
            });
        }
    };

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
                    <Col lg={12}>
                        <hr />
                    </Col>
                    <Col lg={12}>
                        <p>Отчет по выходам :</p>
                    </Col>
                    <Col lg={6}>
                        <InputGroup className="sav2-mb-1">
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faCalendarAlt} size="1x" />
                                    &nbsp;&nbsp;Период
                                </InputGroup.Text>
                                <InputGroup.Text>от&nbsp;:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control as="input" name="from" type="text"
                                ref={periodFromInput} value={period.from} onChange={handleChange} />
                            <div className="input-group-prepend input-group-append">
                                <InputGroup.Text>до&nbsp;:</InputGroup.Text>
                            </div>
                            <Form.Control as="input" name="till" type="text"
                                ref={periodTillInput} value={period.till} onChange={handleChange} />
                        </InputGroup>
                    </Col>
                    <Col lg={6}>
                        <Button variant="success" onClick={handleClick}>
                            Выгрузить в Excel&nbsp;&nbsp;
                            <FontAwesomeIcon icon={faFileExcel} size="1x" />
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default Menu;
