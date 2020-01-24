import React, { useReducer } from 'react';

const AppDispatch = React.createContext(null);

function reducer(state, action) {
    switch (action.type) {
        case 'setIsLoad':
            return {...state, isLoad: action.isLoad};
        case 'setPanelData':
            return {...state, panelData: action.panelData}
        case 'alertInvalidCredentials':
            window.alert('Wrong Login data');
            return state;
        default:
            return state;
    }
}

function useAppReducer(initialState) {
    return useReducer(reducer, initialState);
}

export default useAppReducer;
export { AppDispatch };
