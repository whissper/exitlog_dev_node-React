import React, { useReducer } from 'react';

const MainInspectorPanelDispatch = React.createContext(null);

function reducer(state, action) {
    switch (action.type) {
        case 'setInfoBox':
            return { ...state, infoBox: action.infoBoxData };
        case 'setPanelTabs':
            return { ...state, panelTabs: action.panelTabs };
        case 'setPaginators':
            return {
                ...state,
                paginators: {
                    ...state.paginators,
                    ...action.paginators
                }
            };
        //NewRecord
        case 'setPointsData':
            return { ...state, pointsData: action.pointsData };
        case 'setNewRecordData':
            return {
                ...state,
                newRecordData: {
                    ...state.newRecordData,
                    ...action.newRecordData
                }
            };
        case 'addExitObject':
            return {
                ...state,
                newRecordData: {
                    ...state.newRecordData,
                    objects: [...state.newRecordData.objects, action.addedObject]
                } 
            }
        case 'deleteExitObject':
            const objectsAfterDel = state.newRecordData.objects.filter((object) => (
                object.objectIndex !== action.objectIndex
            ));

            return {
                ...state,
                newRecordData: {
                    ...state.newRecordData,
                    objects: objectsAfterDel
                }
            };
        case 'updateExitObject':
            let objectsAfterUpd = [];

            state.newRecordData.objects.forEach((object) => {
                if (object.objectIndex !== action.object.objectIndex) {
                    objectsAfterUpd.push(object);
                } else {
                    objectsAfterUpd.push({
                        objectIndex: action.object.objectIndex,
                        fields: { ...object.fields, ...action.object.fields }
                    });
                }
            });
            
            return {
                ...state,
                newRecordData: {
                    ...state.newRecordData,
                    objects: objectsAfterUpd
                }
            };
        case 'setInsertNewRecordModal':
            return {
                ...state,
                insertNewRecordModal: {
                    ...state.insertNewRecordModal,
                    ...action.insertNewRecordModalData
                }
            };
        //Log
        case 'setLogData':
            return { ...state, logData: action.logData};
        case 'setLogSearchFields':
            return {
                ...state,
                logSearchFields: {
                    ...state.logSearchFields,
                    ...action.logSearchFields
                }
            };
        case 'setDeleteRecordModal':
            return { ...state, 
                deleteRecordModal: {
                    ...state.deleteRecordModal,
                    ...action.deleteRecordModalData
                }
            };
        case 'setUpdateRecordModal':
            return { ...state,
                updateRecordModal: {
                    ...state.updateRecordModal,
                    ...action.updateRecordModalData
                }
            };
        //Users
        case 'setUsersData':
            return { ...state, usersData: action.usersData };
        case 'setUsersSearchFields':
            return {
                ...state,
                usersSearchFields: {
                    ...state.usersSearchFields,
                    ...action.usersSearchFields
                }
            };
        case 'setLockUserModal':
            return {
                ...state,
                lockUserModal: {
                    ...state.lockUserModal,
                    ...action.lockUserModalData
                }
            };
        case 'setUpdateUserModal':
            return { ...state,
                updateUserModal: {
                    ...state.updateUserModal,
                    ...action.updateUserModalData
                }
            };
        default:
            return state;
    }
}

function useMainInspectorPanelReducer(initialState) {
    return useReducer(reducer, initialState);
}

export default useMainInspectorPanelReducer;
export { MainInspectorPanelDispatch };