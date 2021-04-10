import {formatData} from './dataFormatter';

/** POST DATA **/
/**
 * Match request wrapper.
 * Calls a method that handles the real logic.
 * 
 * @param {string} newbeeID the newbee to match
 * @param {string} mentorID the mentor to match
 * @param {function} setNewbees the newbee set state function
 * @param {function} setMentors the mentor set state function
 */
export function postMatch(newbeeID, mentorID, setNewbees, setMentors) {
    handleMatchUnmatch(true, newbeeID, mentorID, setNewbees, setMentors)
}

/**
 * Unmatch request wrapper. 
 * Calls a method that handles the real logic.
 *
 * @param {string} newbeeID the newbee to unmatch
 * @param {string} mentorID the mentor to unmatch
 * @param {function} setNewbees the newbee set state function
 * @param {function} setMentors the mentor set state function
 */
export function postUnmatch(newbeeID, mentorID, setNewbees, setMentors){
    handleMatchUnmatch(false, newbeeID, mentorID, setNewbees, setMentors)
}

/**
 * Handles the logic of matchign and unmatching.
 * Makes API request to backend
 *  - If successeful, update local state accordingly to keep them synced
 *  - If backend rejects request (for dsyncronizaiton for instance) we refresh data
 *      and alerts user.
 * 
 * @param {boolean} isMatching true if we are matching, false if we are unmatching.
 * @param {string} newbeeID the newbee to unmatch/match
 * @param {string} mentorID the mentor to unmatch/match
 * @param {function} setNewbees the newbee set state function
 * @param {function} setMentors the mentor set state function
 */
function handleMatchUnmatch(isMatching, newbeeID, mentorID, setNewbees, setMentors) {
    //Logic that matching is happening.
    const cmd = isMatching ? 'match' : 'unmatch'
    console.log(`${cmd}ing: ${newbeeID} with ${mentorID}`);
    //Set refreshing true.
    setNewbees(setRefreshing(true));
    setMentors(setRefreshing(true));
    //Make API request.
    const URL = `/${cmd}?newbee=${newbeeID}&mentor=${mentorID}`;
    fetch(URL, { method: 'POST'})
        .then(response => {
            const status = response.status;
            if (status == 200 || status == 201) {
                //Unmatch/match successfully made :)
                //Update local data.
                const newMentorId = isMatching ? mentorID : null;
                setMentorOfNewbee(newbeeID, newMentorId, setNewbees);
                //Set refreshing to false.
                setNewbees(setRefreshing(false));
                setMentors(setRefreshing(false));
            } else {
                //Something went wrong :(
                //Indicate somehow that data was out of sync.
                const errmsg = `Error code ${status}: ${response.statusText} \nRefershing local data.`;
                console.log(errmsg);
                alert(errmsg);
                //Refresh local data (and set refreshing to false).
                loadSalesforceData(setNewbees, setMentors);
            } 
        })
        .catch(error => console.log('FETCH ERROR:', error)); //to catch the errors if any.

    return;
}

/** GET DATA **/
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
 * @param {*} data The array of arrays storing the data (first row is column names)
 * @param {*} setFunction The set state function to use
 * @param {*} allowManualSort Whether or not to allowManualSort (true if left side)
 */
function postData(data, setFunction, allowManualSort){
    if (data.length > 1) {
        //Initialize data structure.
        let newDataState = formatData(data, allowManualSort);
        let columns = newDataState.columns
        newDataState.selectedRows = [];
        //Specify email column
        newDataState.emailColumn = getColumn(columns, 'email');
        //Specify match column
        newDataState.matchColumn = getColumn(columns, 'mentor_id');
        //Specify id column
        newDataState.idColumn = getColumn(columns, 'salesforce_id');
        //console.log("captured columns", newDataState.emailColumn, newDataState.matchColumn);
        //Set the data state.
        setFunction(setData(newDataState));
        //Indicate success.
        return true;
    } 
    //Indicate failure.
    return false;
}

/**
 * Sets the local newbee column's id to the speicifed newMentorID
 * @param {*} newbeeID 
 * @param {*} newMentorID 
 */
function setMentorOfNewbee(newbeeID,newMentorID,setNewbees) {
    setNewbees(oldDataState => {
        //Extract column names.
        const idCol = oldDataState.idColumn.key;
        const mentorCol = oldDataState.matchColumn.key;
        //Deep copy of data state.
        let newDataState = JSON.parse(JSON.stringify(oldDataState));
        console.log("State started as",newDataState);
        //Find column to mutate.
        newDataState.data.forEach(row => {
            if (row[idCol] === newbeeID) 
                //Mutate said column to newMentorID
                row[mentorCol] = newMentorID;
        });
        console.log("State finished as",newDataState);
        return newDataState;
    });
}

/**
 * Returns the entry with a specified key value.
 * 
 * @param {Array} columns
 * @param {string} keyValue 
 * @return {Object} column with specified key
 */
function getColumn(columns, keyValue) {
    const col = columns.findIndex((obj) => {
        return obj.key === keyValue
    });

    if(col < 0)
        return null;
    return columns[col];

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