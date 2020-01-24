import React, { useContext } from 'react';
import './TabLog.css';
import Menu from './Menu';
import Paginator from 'App/WorkPanels/MainInspectorPanel/Components/TabLog/Paginator';
import Search from './Search';
import TableInfo from 'App/WorkPanels/MainInspectorPanel/Components/TabLog/TableInfo';
import TableField from 'App/WorkPanels/MainInspectorPanel/Components/TabLog/TableField';
import DeleteRecordModal from 'App/WorkPanels/MainInspectorPanel/Components/TabLog/DeleteRecordModal';
import UpdateRecordModal from 'App/WorkPanels/MainInspectorPanel/Components/TabLog/UpdateRecordModal';
import { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer';


function TabLog(props) {

    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);

    const {
        panelData,
        pointsData,
        paginatorData,
        logData,
        logSearchFieldsData,
        deleteRecordModalData,
        updateRecordModalData
    } = props;

    const handleItemClick = (pageNumber) => {
        mainInspectorPanelDispatch({
            type: 'setPaginators',
            paginators: { tabLogPage: pageNumber }
        });
    };

    return (
        <React.Fragment>
            <Menu data={panelData} />
            <hr />
            <Search data={logSearchFieldsData} />
            <hr />
            <TableInfo countRows={logData.countrows} />
            <hr />
            <Paginator curPage={paginatorData}
                perPage={logData.perpage}
                countRows={logData.countrows}
                onItemClick={handleItemClick}
                onPrevClick={handleItemClick}
                onNextClick={handleItemClick}
                onFirstClick={handleItemClick}
                onLastClick={handleItemClick} />
            <TableField rowItems={logData.rowitems} />
            <hr />
            <Paginator curPage={paginatorData}
                perPage={logData.perpage}
                countRows={logData.countrows}
                onItemClick={handleItemClick}
                onPrevClick={handleItemClick}
                onNextClick={handleItemClick}
                onFirstClick={handleItemClick}
                onLastClick={handleItemClick} />
            <br />
            <br />
            <DeleteRecordModal data={deleteRecordModalData} />
            <UpdateRecordModal data={updateRecordModalData} 
                pointsData={pointsData}/>
        </React.Fragment>
    );
}

export default TabLog;
