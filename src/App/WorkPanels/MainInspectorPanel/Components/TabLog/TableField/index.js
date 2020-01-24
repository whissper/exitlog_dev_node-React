import React from 'react';
import './TableField.css';
import { Table } from 'react-bootstrap';
import TableRow from './TableRow';


function TableField(props) {

    const { rowItems } = props;

    const tableRows = rowItems.map((item) => (
        <TableRow key={(item[0]).toString()}
            id={(item[0]).toString()}
            day={item[1]}
            date={item[2]}
            userFio={item[3]}
            objects={item[4]}
            point={item[5]}
            pointDescription={item[6]}
            timeExit={item[7]}
            timeReturn={item[8]}
            timeDuration={item[9]} />
    ));

    return (
        <Table striped>
            <thead>
                <tr>
                    <th>День</th>
                    <th>Дата</th>
                    <th>Сотрудник</th>
                    <th>Объекты</th>
                    <th>Цель выхода</th>
                    <th>С</th>
                    <th>До</th>
                    <th>Часы</th>
                    <th>Действие</th>
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
        </Table>
    );
}

export default TableField;