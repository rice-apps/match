import {formatData} from './dataFormatter';


/**
 * Populates newbee and mentor data (left and right) 
 * using setNewbees and setMentors
 * 
 * @param {Function} setNewbees setState function for newbees
 * @param {Function} setMentors setState function for mentors
 */
export function loadSalesforceData(setNewbees, setMentors){
    setNewbees(setRefreshing(true));
    setMentors(setRefreshing(true));
    getSalesforceData(setNewbees, setMentors);
}

/**
 * Make API request to /contacts and hand data off to onLoaded callback function.
 * 
 * @param {Function} setNewbees setState function for newbees
 * @param {Function} setMentors setState function for mentors
 */
function getSalesforceData(setNewbees,setMentors) {
    fetch('/leftRightData/', { method: 'GET' })
    .then(response => response.json())
    .then(responseJson => onSalesforceLoaded(responseJson, setNewbees, setMentors))
    .catch(error => console.log('FETCH ERROR:', error)); //to catch the errors if any
}

/**
 * Format the API response for each key and return data.
 * 
 * @param {Object} response the object recieved from the API request
 * @param {Function} setNewbees setState function for newbees
 * @param {Function} setMentors setState function for mentors
 */
function onSalesforceLoaded(response, setNewbees, setMentors) {
    if (!postData(response.newBees,setNewbees,true)) 
        alert("No newBee data!");
    if (!postData(response.mentors,setMentors,false))
        alert("No mentor data!");
}

/**
 * Takes in data, formats it, and sets it using the passed setState function.
 * 
 * @param {*} data The arary of arrays storing the data (first row is column names)
 * @param {*} setFunction The set state function to use
 * @param {*} allowManualSort Whether or not to allowManualSort (true if left side)
 */
function postData(data, setFunction, allowManualSort){
    if (data.length > 1) {
        //Initialize data structure.
        var newDataState = formatData(data, allowManualSort);
        newDataState.selectedRows = [];
        //Sepcify email column
        newDataState.emailColumn = null;

        //Specify match column
        newDataState.matchColumn = null;
        
        //Set the data state.
        setFunction(setData(newDataState));
        //Indicate success.
        return true;
    } 
    //Indicate failure.
    return false;
}

/** 
 * SetState Lambda Generators 
 **/

/**
 * Returns a lmabs that will set the refresh value to whatever
 * specified.
 * 
 * @param {boolean} refreshValue 
 */
function setRefreshing(refreshValue){
    return oldDataState => {
        return {
            ...oldDataState,
            refreshing: refreshValue
        }
    }
}

/**
 * Returns a lambda that can be passed to a setstate function
 * to update the call. Also set's refreshing flag to false.
 * 
 * @param {*} newDataState 
 */
function setData(newDataState){
    return oldDataState => {
        return {
            ...oldDataState,
            ...newDataState,
            refreshing: false
        }
    }
}


export function unmatchAPI(newbeeID, mentorID){
    return;
}

export function matchAPI(newbeeID, mentorID){
    return;
}