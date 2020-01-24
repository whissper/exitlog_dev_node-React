import React, { useContext } from 'react';
import './Search.css';
import { Row } from 'react-bootstrap';
import SearchItem from 'App/WorkPanels/MainInspectorPanel/Components/TabLog/Search/SearchItem';
import { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer';


function Search(props) {

    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);

    const { data } = props;

    const doSearch = (searchParams) => {
        mainInspectorPanelDispatch({
            type: 'setUsersSearchFields',
            usersSearchFields: searchParams
        });
    };


    return (
        <React.Fragment>
            <p>Поиск пользователей: </p>
            <Row>
                <SearchItem name="userFio"
                    size={6}
                    label="ФИО пользователя:"
                    handleSearch={doSearch}
                    currentVal={data.userFio} />
            </Row>
        </React.Fragment>
    );
}

export default Search;
