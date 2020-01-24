import React, { useContext } from 'react';
import './TableRow.css';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer';


function TableRow(props) {

    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);

    const {
        userID,
        userLocked,
        userFio
    } = props; 

    const handleUpdate = async () => {
        mainInspectorPanelDispatch({
            type: 'setUpdateUserModal',
            updateUserModalData: {
                show: true,
                userID: userID
            }
        });
    };

    const handleLockUnlock = () => {
        mainInspectorPanelDispatch({
            type: 'setLockUserModal',
            lockUserModalData: { 
                show: true,
                userID: userID,
                userFio: userFio,
                userLocked: userLocked
            }
        });
    };

    const overlayText = (userLocked === 0 ? 
        'Разблокирован. Нажмите чтобы заблокировать' : 
        'Заблокирован. Нажмите чтобы разблокировать'
    );

    return (
        <tr>
            <td>{userFio}</td>
            <td style={{textAlign: "right"}}>
                <Button variant="success" 
                    className="sav2-opt-button" 
                    title="Изменить данные учетной записи" 
                    onClick={handleUpdate}>
                        <FontAwesomeIcon icon={faIdCard} size="1x" />
                </Button>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={userID}>{overlayText}</Tooltip>}>
                        <Button variant={(userLocked === 0 ? "info" : "warning")} 
                            className="sav2-opt-button"  
                            onClick={handleLockUnlock}>
                                <FontAwesomeIcon icon={(userLocked === 0 ? faLockOpen : faLock)} size="1x" />
                        </Button>
                </OverlayTrigger>
            </td>
        </tr>
    );
}

export default TableRow;
