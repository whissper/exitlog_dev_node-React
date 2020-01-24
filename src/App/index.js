import React, { useEffect } from 'react';
import './App.css';
import useAppReducer, { AppDispatch } from 'App/Utils/useAppReducer';
import fetchData from 'App/Utils/fetchData';
import processException from 'App/Utils/processException';
import TopHeader from 'App/TopHeader';
import LightCover from 'App/LightCover';
import Workspace from 'App/Workspace';

function App(props) {

    //Reducer -- start:
    const initialState = {
        isLoad: true,
        panelData: {
            panelID: null,
            userID: '',
            userFIO: '',
            depID: '',
            depName: ''
        }
    };

    const [state, dispatch] = useAppReducer(initialState);
    //Reducer -- end;

    const { isLoad, panelData } = state;

    const loadingTriggers = [
        () => { dispatch({ type: 'setIsLoad', isLoad: true }); },
        () => { dispatch({ type: 'setIsLoad', isLoad: false }); }
    ];

    useEffect(() => {
        keepWorkspace();
        //eslint-disable-next-line
    }, []);

    async function keepWorkspace() {
        const textResponse = await fetchData(
            'keep_workspace',
            { id: '0' },
            ...loadingTriggers
        );

        const response = {
            message: textResponse,
            methodName: 'App.keepWorkspace()'
        }; 

        if (!processException(response)) {
            const panelDataJSON = JSON.parse(textResponse);

            dispatch({
                type: 'setPanelData',
                panelData: panelDataJSON
            });
        }
    }

    return (
        <div>
            <AppDispatch.Provider value={dispatch}>
                <TopHeader />
                <Workspace wsID={panelData.panelID} panelData={panelData} />
                <LightCover isLoading={isLoad} />
            </AppDispatch.Provider>
        </div>
    );
}

export default App;
