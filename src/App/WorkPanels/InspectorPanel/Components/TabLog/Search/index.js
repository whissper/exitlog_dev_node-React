import React, { useContext } from 'react';
import './Search.css';
import { Row } from 'react-bootstrap';
import SearchItem from 'App/WorkPanels/MainInspectorPanel/Components/TabLog/Search/SearchItem';
import { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer';


function Search(props) {

    const {data} = props;

    const mainInspectorPanelDispatch = useContext(MainInspectorPanelDispatch);

    const doSearch = (searchParams) => {
        mainInspectorPanelDispatch({
            type: 'setLogSearchFields',
            logSearchFields: searchParams
        });
    };

    const datepickerData = {
        type: "datepicker",
        params: {
            format: "dd-mm-yyyy",
            viewMode: "months",
            minViewMode: "days",
            language: 'ru'
        }
    };

    return (
        <React.Fragment>
            <p>Поиск записей: </p>
            <Row>
                <SearchItem name="date"
                    size={4}
                    label="Дата выхода:"
                    handleSearch={doSearch}
                    mask={datepickerData}
                    currentVal={data.date} />
                <SearchItem name="objectName"
                    size={6}
                    label="Объект выхода:"
                    handleSearch={doSearch}
                    currentVal={data.objectName} />
            </Row>
        </React.Fragment>
    );
}

export default Search;