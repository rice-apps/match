import { atom } from 'recoil';


// This file stores all the global state needed for this app.
// We should be very careful/diligent about what we think should be 
// global vs local state.

export function getAtomByKey(key) {
    switch (key) {
        case "application":
            return applicationState;
        case "leftData":
            return leftDataState;
        case "rightData":
            return rightDataState;
        case "rules":
            return rulesState;
        default:
            return
    }

}


// Generic app global state
export const applicationState = atom({
    key: 'application',
    default: {
        user: null,
        sidebarOpen: false,
    },
    persistence_UNSTABLE: {
        type: "persist"
    }
})


// Tells us about the left data set (data, columns, and selectedRows)
export const leftDataState = atom({
    key: 'leftData', // unique ID (with respect to other atoms/selectors)
    default: {
        data: [],
        columns: [],
        selectedRows: [],
        matchColumn: null,
        nameColumn: null,
        emailColumn: null,
        spreadsheetId: null,
        refreshing: false,
        shouldSortLeft: false,
    }, // default value (aka initial value)
    persistence_UNSTABLE: {
        type: "persist"
    }
});


// Tells us about the right data set (data, columns, and selectedRows)
export const rightDataState = atom({
    key: 'rightData',
    default: {
        data: [],
        columns: [],
        selectedRows: [],
        nameColumn: null,
        emailColumn: null,
        spreadsheetId: null,
        refreshing: false,
        isMatched: false,
    },
    persistence_UNSTABLE: {
        type: "persist"
    }
});

// Tells us about the right data set (data, columns, and selectedRows)
export const ccdState = atom({
    key: 'ccdState',
    default: {
        data: [],
        columns: [],
        spreadsheetId: null,
        refreshing: false,
    },
    persistence_UNSTABLE: {
        type: "persist"
    }
});


// Tells us about the rules currently in use
export const rulesState = atom({
    key: 'rules',
    default: [],
    persistence_UNSTABLE: {
        type: "persist"
    }
});

