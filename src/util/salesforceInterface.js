import { formatData } from './dataFormatter';


const setLoadingTrue = oldDataState => {
    return {
        ...oldDataState,
        refreshing: true // show data is loading
    }
}

/**
 * 
 * @param {Function} setLeft glorified setstate for newbees
 * @param {Function} setRight glorified setstate for mentors
 */
export function loadSalesforceData(setLeft, setRight){
    console.log("loadSalesforceData called!")
    setLeft(setLoadingTrue)
    setRight(setLoadingTrue)
    getSalesforceData(setLeft, setRight)
}

/* Get both */
function getSalesforceData(setLeft, setRight){

    onSalesforceLoaded({
        "newBees":[['Email Address','Last Name','First Name','Zip Code'],
        [new Date(), 'leebron@rice.edu','baby Leebron','David','77005']],

        "mentors":[['Timestamp','Email Address','Last Name','First Name','Zip Code'],
        [new Date(), 'leebron@rice.edu','MENTOR LEEEBRONNN','David','77005']]
    },setLeft, setRight)
}

// /* Get data from backend */
// function getNewbees(onUpload){
//     console.log("getNewbees called!")
//     onSalesforceLoaded({result:[
//         ['Timestamp','Email Address','Last Name','First Name','Zip Code'],
//         [new Date(), 'leebron@rice.edu','Leebron','David','77005']
//     ]},onUpload)
// }

// /* Get data from backend */
// function getMentors(onUpload){
//     console.log("getMentors called!")
//     onSalesforceLoaded({result:[
//         ['Timestamp','Email Address','Last Name','First Name','Zip Code'],
//         [new Date(), 'mentor@rice.edu','JAMES','David','77005']
//     ]},onUpload)
// }

function onSalesforceLoaded(response, setLeft, setRight) {
    console.log("onSalesforceLoaded called!")
    const values = response.result;
    if (values.length > 0) {
        const allowManualSort = true
        var newDataState = formatData(values, allowManualSort);
        newDataState.selectedRows = [];

        // First look for columns with the appropriate name
        // //let matchColumnIndex = findIndexOfColumnWithName(MATCH_COLUMN_NAME, newDataState.columns)
        // let nameColumnIndex = findIndexOfColumnWithName("Full Name", newDataState.columns);
        // let emailColumnIndex = findIndexOfColumnWithName("Email", newDataState.columns);
        
        // // Now check if we found the columns and handle the possibility of not finding them
        // newDataState.matchColumn = matchColumnIndex > -1 ? newDataState.columns[matchColumnIndex] : null;
        // // Assume name column is 3rd if we don't find it
        // newDataState.nameColumn = nameColumnIndex > -1 ? newDataState.columns[nameColumnIndex] : newDataState.columns[2];
        // // Assuming email column is 2nd if we don't find it
        // newDataState.emailColumn = emailColumnIndex > -1 ? newDataState.columns[emailColumnIndex] : newDataState.columns[1];
        
        // // Unhide the match column
        // if (newDataState.matchColumn) newDataState.matchColumn.hidden = false;
        
        onUpload(oldDataState => {
            return {
                ...oldDataState,
                ...newDataState,
                refreshing: false
            }
        });
    } else {
        console.log("No data found. :(!")
        alert('No data found.');
    }
    console.log("onSalesforceLoaded end")
}

const findIndexOfColumnWithName = (name, columns) => {
    const res = columns.findIndex((obj) => {
        return obj.fullTitle === name
    })
    console.log("res of find index of column", res)
    return res === undefined ? -1 : res
}