import { atom } from 'recoil';

// This file stores all the global state needed for this app.
// We should be very careful/diligent about what we think should be 
// global vs local state.


// Generic app global state
export const applicationState = atom({
    key: 'application',
    default: {
        user: null,
        sidebarOpen: false,
    },
})


// Tells us about the left data set (data, columns, and selectedRows)
export const leftDataState = atom({
    key: 'leftData', // unique ID (with respect to other atoms/selectors)
    default: {
        data: [],
        columns: [],
        selectedRows: []
    }, // default value (aka initial value)
});


// Tells us about the right data set (data, columns, and selectedRows)
export const rightDataState = atom({
    key: 'rightData',
    default: {
        data: [],
        columns: [],
        selectedRows: []
    }, 
});


// Tells us about the rules currently in use
export const rulesState = atom({
    key: 'rules',
    default: [],
})
