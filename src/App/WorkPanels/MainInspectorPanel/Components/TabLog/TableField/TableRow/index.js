import React, { useContext } from 'react';
import './TableRow.css';
import {  
    Button, 
    Badge, 
    OverlayTrigger, 
    Tooltip 
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer';


function TableRow(props) {

    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);

    const {
       id,
       day,
       date,
       userFio,
       objects,
       point,
       pointDescription,
       timeExit,
       timeReturn,
       timeDuration 
    } = props;

    const handleUpdate = () => {
        mainInspectorPanelDispatch({
            type: 'setUpdateRecordModal',
            updateRecordModalData: {
                show: true,
                exitID: id
            }
        });
    };

    const handleDelete = () => {
        mainInspectorPanelDispatch({
            type: 'setDeleteRecordModal',
            deleteRecordModalData: {
                show: true,
                exitID: id
            }
        });
    };

    return (
        <tr>
            <td>{day}</td>
            <td>{date}</td>
            <td style={{whiteSpace: 'nowrap'}}>{userFio}</td>
            <td>
                {
                    objects.map((object, index) => (
                        <div className="mb-2" key={index.toString()}>
                            {object[0]}&nbsp;
                            {
                                object[1] !== '' &&   
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                        <Tooltip id={index.toString()}>
                                            {object[1]}
                                        </Tooltip>    
                                    }>
                                    <Badge variant="info" className="note-label">
                                        <FontAwesomeIcon icon={faComment} />
                                        &nbsp;{object[1]}
                                    </Badge>
                                </OverlayTrigger>
                            }
                        </div>
                    ))
                }
            </td>
            <td>
                {point + (pointDescription === '' ? '' : ' '+ pointDescription)}
            </td>
            <td>{timeExit}</td>
            <td>{timeReturn}</td>
            <td>{timeDuration}</td>
            <td style={{minWidth: '120px'}}>
                <Button variant="success" className="sav2-opt-button" onClick={handleUpdate} title="Изменить">
                    <FontAwesomeIcon icon={faPen} size="1x" />
                </Button>
                <Button variant="danger" className="sav2-opt-button" onClick={handleDelete} title="Удалить">
                    <FontAwesomeIcon icon={faTrashAlt} size="1x" />
                </Button>
            </td>
        </tr>
    );
}

export default TableRow;