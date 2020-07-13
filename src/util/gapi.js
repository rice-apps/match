// Client ID and API key from the Developer Console
var CLIENT_ID = process.env.REACT_APP_GAPI_CLIENT_ID;
var API_KEY = process.env.REACT_APP_GAPI_API_KEY;

if (!CLIENT_ID || !API_KEY) {
    alert("Google API client id or API key not stored. There must be an issue with the build. If running locally, check for the .env file. If in production, check GCP.")
}

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets';


/**************************************** AUTHENTICATION ****************************************/

/**
 *  On load, called to load the auth2 library and API client library.
 */
export function handleClientLoad(callbackFunction) {
    window.gapi.load('client:auth2', () => initClient(callbackFunction));
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient(callbackFunction) {
    window.gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        console.log("Initialized gapi client correctly.")
        // Listen for sign-in state changes.
        window.gapi.auth2.getAuthInstance().isSignedIn.listen((status) => updateSigninStatus(status, callbackFunction));

        // Handle the initial sign-in state.
        updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get(), callbackFunction);
    }, function (error) {
        alert("Error loading in CSV:" + JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn, callbackFunction) {
    if (isSignedIn) {
        let user = window.gapi.auth2.getAuthInstance().currentUser.get();
        callbackFunction(user);
    } else {
        callbackFunction(null);
    }
}

/**
 *  Sign in the user upon button click.
 */
export function handleAuthClick() {
    window.gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
export function handleSignoutClick() {
    window.gapi.auth2.getAuthInstance().signOut();
}


/**************************************** SPREAD SHEET ****************************************/

 /**
  * Reads Google spreadsheet
  * @param {spring} spreadsheetId The spreadsheet
  * @param {function} callbackFunction 
  */
export function getSpreadsheetData(spreadsheetId, callbackFunction) {
    window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        // Select entire sheet range
        range: 'A1:ZZ',
    }).then(callbackFunction, (response) => {
        alert('Error: ' + response.result.error.message);
    });
}

/**
 * Writes Google spreadsheet
 * @param {string} spreadsheetId The spreadsheet
 * @param {string} range The range of the spreadsheet
 * @param {list[list[string]]} values The values to write
 * @param {function} callbackFunction 
 */
export function modifySpreadsheetData(spreadsheetId, range, values, callbackFunction) {
    console.log(spreadsheetId, callbackFunction);
    window.gapi.client.sheets.spreadsheets.values.update({
        "spreadsheetId": spreadsheetId,
        "range": range,
        "valueInputOption": "USER_ENTERED",
        "resource": {
            "values": values
        }
    }).then(callbackFunction, (response) => {
        alert('Error: ' + response.result.error.message);
    });
}