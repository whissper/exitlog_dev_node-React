import React from 'react';
import './TabNewRecord.css';
import Menu from './Menu';
import NewRecordForm from './NewRecordForm';
import InsertNewRecordModal from './InsertNewRecordModal';


function TabNewRecord(props) {

    const {
        panelData,
        pointsData,
        newRecordData,
        insertNewRecordModalData
    } = props;

    return (
        <React.Fragment>
            <Menu data={panelData} />
            <hr />
            <NewRecordForm pointsData={pointsData} 
                data={newRecordData} />
            <br />
            <br />
            <InsertNewRecordModal data={insertNewRecordModalData}
                newRecordData={newRecordData}
                panelData={panelData}
                pointsData={pointsData} />
        </React.Fragment>
    );
}

export default TabNewRecord;
