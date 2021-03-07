import { formatData } from './dataFormatter';


/** SetState lambdas **/

/**
 * Sets the data state to "loading true"
 * @param {*} oldDataState 
 */
const loadingLambda = oldDataState => {
    return {
        ...oldDataState,
        refreshing: true // show data is loading
    }
}

/**
 * Returns a lambda that can be passed to a setstate function
 * to update the call. Also set's refreshing flag to false.
 * 
 * @param {*} newDataState 
 */
function generateDataLambda(newDataState){
    return oldDataState => {
        return {
            ...oldDataState,
            ...newDataState,
            refreshing: false
        }
    }
}

/**
 * Populates newbee and mentor data (left and right) 
 * using setNewbees and setMentors
 * 
 * @param {Function} setNewbees setState function for newbees
 * @param {Function} setMentors setState function for mentors
 */
export function loadSalesforceData(setNewbees, setMentors){
    console.log("loadSalesforceData called!")
    setLeft(loadingLambda)
    setRight(loadingLambda)
    getSalesforceData(setNewbees, setMentors)
}

/**
 * Make API request to /contacts and hand data off to onLoaded callback function.
 * 
 * @param {Function} setNewbees setState function for newbees
 * @param {Function} setMentors setState function for mentors
 */
function getSalesforceData(setNewbees, setMentors){
    //TODO: Actually make the API request
    //Mock data return.
    onSalesforceLoaded({
        "newBees":[['Email Address','Last Name','First Name','Zip Code'],
        [new Date(), 'leebron@rice.edu','baby Leebron','David','77005']],

        "mentors":[['Timestamp','Email Address','Last Name','First Name','Zip Code'],
        [new Date(), 'leebron@rice.edu','MENTOR LEEEBRONNN','David','77005']]
    },setNewbees, setMentors)
}

/**
 * Take in the API response and call the setNewbees and setMentors f
 * function to populate the data
 * @param {Object} response the object recieved from the API request
 * @param {Function} setNewbees setState function for newbees
 * @param {Function} setMentors setState function for mentors
 */
function onSalesforceLoaded(response, setNewbees, setMentors) {
    //TODO: This is very non-functional at the moment. Needs to be formatted correctly.
    console.log("onSalesforceLoaded called!")
    const values = response.result;
    //TODO: Do a process like this but with "newbees" and "mentors"
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
        
        //USE setNewbess, setMentors, and generateDataLambda
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