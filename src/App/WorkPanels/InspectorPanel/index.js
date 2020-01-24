import React, { useContext, useEffect } from 'react';
import './InspectorPanel.css';
import useMainInspectorPanelReducer, { MainInspectorPanelDispatch } from 'App/Utils/useMainInspectorPanelReducer';
import { AppDispatch } from 'App/Utils/useAppReducer';
import MainMenu from './Components/MainMenu';
import InfoBox from 'App/WorkPanels/MainInspectorPanel/Components/InfoBox';
import TabNewRecord from 'App/WorkPanels/MainInspectorPanel/Components/TabNewRecord';
import TabLog from './Components/TabLog';
import fetchData from 'App/Utils/fetchData';
import processException from 'App/Utils/processException'; 


function InspectorPanel(props) {

    const appDispatch = useContext(AppDispatch);

    const loadingTriggers = [
        () => { appDispatch({ type: 'setIsLoad', isLoad: true }); },
        () => { appDispatch({ type: 'setIsLoad', isLoad: false }); }
    ];

    const { panelData } = props;

    //Reducer -- start:
    const initialState = {
        infoBox: {
            variant: 'info',
            text: '',
            show: false
        },
        panelTabs: {
            showNewRecordTab : true,
            showLogTab: false,
            showUsersTab: false
        },
        paginators: {
            tabLogPage: 1,
            tabUsersPage: 1
        },
        //TabNewCard
        pointsData: [],
        newRecordData: {
            userid: panelData.userID,
            pointid: '1',
            point_description: '',
            time_exit: '',
            time_return: '',
            objects: []
        },
        insertNewRecordModal: {
            show: false
        },
        //TabLog
        logSearchFields: {
            date: '',
            userFio: '',
            userID: panelData.userID.toString(),
            objectName: ''
        },
        logData: {
            countrows: 0,
            page: 0,
            perpage: 25,
            rowitems: []
        },
        deleteRecordModal: {
            show: false,
            exitID: '0'
        },
        updateRecordModal: {
            show: false,
            exitID: '0'
        }
    };

    const [state, dispatch] = useMainInspectorPanelReducer(initialState);
    //Reducer -- end;

    const {
        infoBox,
        panelTabs,
        paginators,

        pointsData,
        newRecordData,
        insertNewRecordModal,

        logSearchFields,
        logData,
        deleteRecordModal,
        updateRecordModal
    } = state;

    //Points
    useEffect(() => {
        if (panelTabs.showNewRecordTab) {
            selectPoints();
        }//eslint-disable-next-line
    }, [panelTabs.showNewRecordTab]);

    //Log
    useEffect(() => {
        if (panelTabs.showLogTab &&
            !deleteRecordModal.show &&
            !updateRecordModal.show) {
            selectExits();
        }//eslint-disable-next-line
    }, [
        panelTabs.showLogTab,
        paginators.tabLogPage,
        logSearchFields,
        deleteRecordModal,
        updateRecordModal
    ]);

    const getActiveTab = () => {
        let activeTab = 'default';

        for (let key in panelTabs) {
            if (panelTabs[key]) {
                activeTab = key;
            }
        }

        const activeTabs = {
            'showNewRecordTab': 
                <TabNewRecord panelData={panelData}
                    pointsData={pointsData}
                    newRecordData={newRecordData}
                    insertNewRecordModalData={insertNewRecordModal} />,
            'showLogTab':
                <TabLog panelData={panelData} 
                    pointsData={pointsData}
                    paginatorData={paginators.tabLogPage}
                    logData={logData}
                    logSearchFieldsData={logSearchFields}
                    deleteRecordModalData={deleteRecordModal}
                    updateRecordModalData={updateRecordModal} />,
            'default':
                <TabNewRecord panelData={panelData}
                    pointsData={pointsData}
                    newRecordData={newRecordData}
                    insertNewRecordModalData={insertNewRecordModal} />
        };

        return (activeTabs[activeTab] || activeTabs['default']);
    };

    const doSelect = async (selectData) => {
        const textResponse = await fetchData(
            selectData.apiMethod,
            selectData.searchParams,
            ...loadingTriggers
        );

        const response = {
            message: textResponse,
            methodName: selectData.methodName,
            representError: (errorInfo) => {
                dispatch({
                    type: 'setInfoBox',
                    infoBoxData: { variant: 'danger', text: errorInfo, show: true }
                });
            }
        };

        if (!processException(response)) {
            const jsonResponse = JSON.parse(textResponse);
            selectData.processResult(jsonResponse);
        }
    };

    const selectPoints = async () => {
        const searchParams = {
            id: '0'
        };

        const selectData = {
            apiMethod: 'select_points',
            searchParams: searchParams,
            methodName: 'InspectorPanel.selectPoints()',
            processResult: (jsonResponse) => {
                dispatch({
                    type: 'setPointsData',
                    pointsData: jsonResponse.points
                });
            }
        };

        await doSelect(selectData);
    };

    const selectExits = async () => {
        const searchParams = {
            page:       (paginators.tabLogPage - 1),
            date:       logSearchFields.date,
            userfio:    logSearchFields.userFio,
            userid:     logSearchFields.userID,
            objectname: logSearchFields.objectName
        };

        const selectData = {
            apiMethod: 'select_exits',
            searchParams: searchParams,
            methodName: 'InspectorPanel.selectExits()',
            processResult: (jsonResponse) => {
                dispatch({
                    type: 'setLogData',
                    logData: jsonResponse
                });
            }
        };

        await doSelect(selectData);
    };


    return (
        <div>
            <MainInspectorPanelDispatch.Provider value={dispatch}>
                <MainMenu data={panelTabs} panelData={panelData} />
                <br />
                <InfoBox data={infoBox} />
                <br />
                {getActiveTab()}
                <br />
            </MainInspectorPanelDispatch.Provider>
        </div>
    );
}

export default InspectorPanel;
