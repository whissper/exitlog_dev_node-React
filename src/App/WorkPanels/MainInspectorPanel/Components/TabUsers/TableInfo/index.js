import React from 'react';
import './TableInfo.css';
import { InputGroup, FormControl } from 'react-bootstrap';

function TableInfo(props) {

    const { countRows } = props;

    return (
        <React.Fragment>
            <p>Список записей:</p>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>Всего найдено записей:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl disabled value={countRows} style={{maxWidth: '200px'}} />
            </InputGroup>
        </React.Fragment>
    );
}

export default TableInfo;
