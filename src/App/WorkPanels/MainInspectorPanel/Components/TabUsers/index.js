import React, { useContext } from 'react';
import './TabUsers.css';
import Menu from './Menu';
import Search from './Search';
import TableInfo from './TableInfo';
import Paginator from 'App/WorkPanels/MainInspectorPanel/Components/TabLog/Paginator';
import TableField from './TableField';
import LockUserModal from './LockUserModal';
import UpdateUserModal from './UpdateUserModal';
import { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer';


function TabUsers(props) {

    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);

    const {
        panelData,
        usersData,
        paginatorData,
        usersSearchFieldsData,
        lockUserModalData,
        updateUserModalData
    } = props;

    const handleItemClick = (pageNumber) => {
        mainInspectorPanelDispatch({
            type: 'setPaginators',
            paginators: { tabUsersPage: pageNumber }
        });
    };


    return (
        <React.Fragment>
            <Menu data={panelData} />
            <hr />
            <Search data={usersSearchFieldsData} />
            <hr />
            <TableInfo countRows={usersData.countrows} />
            <hr />
            <Paginator curPage={paginatorData}
                perPage={usersData.perpage}
                countRows={usersData.countrows}
                onItemClick={handleItemClick}
                onPrevClick={handleItemClick}
                onNextClick={handleItemClick}
                onFirstClick={handleItemClick}
                onLastClick={handleItemClick} />
            <TableField rowItems={usersData.rowitems} />
            <hr />
            <Paginator curPage={paginatorData}
                perPage={usersData.perpage}
                countRows={usersData.countrows}
                onItemClick={handleItemClick}
                onPrevClick={handleItemClick}
                onNextClick={handleItemClick}
                onFirstClick={handleItemClick}
                onLastClick={handleItemClick} />
            <br />
            <br />
            <LockUserModal data={lockUserModalData} />
            <UpdateUserModal data={updateUserModalData} />
        </React.Fragment>
    );
}

export default TabUsers;
