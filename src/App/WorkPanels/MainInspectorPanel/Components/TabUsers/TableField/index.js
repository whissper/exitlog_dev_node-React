import React from 'react';
import './TableField.css';
import { Table } from 'react-bootstrap';
import TableRow from './TableRow';


function TableField(props) {

    const { rowItems } = props;

    const tableRows = rowItems.map((item) => (
        <TableRow key={(item[0]).toString()}
            userID={(item[0]).toString()}
            userLocked={item[1]}
            userFio={item[2]} />
    ));

    return (
        <Table striped>
            <thead>
                <tr>
                    <th>ФИО сотрудника</th>
                    <th style={{textAlign: "right"}}>Действие</th>
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
        </Table>
    );
}

export default TableField;
