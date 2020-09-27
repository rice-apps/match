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

    if (!window.gapi || !window.gapi.auth2) {
        alert("Sorry! Google API Client does not initialize sometimes, will address this later, but for now refresh the page!");
        return
    }

    window.gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
export function handleSignoutClick() {
    window.gapi.auth2.getAuthInstance().signOut();
}


/**************************************** SPREAD SHEET ****************************************/

// e.g. 'A' => 1, 'Z' => 26, 'AA' => 27 
function columnToLetter(column) {
    var temp, letter = '';
    while (column > 0) {
        temp = (column - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp - 1) / 26;
    }
    return letter;
}

// // e.g. 1 => 'A', 26 => 'Z', 27 => 'AA'
// function letterToColumn(letter) {
//     var column = 0, length = letter.length;
//     for (var i = 0; i < length; i++) {
//         column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
//     }
//     return column;
// }


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
 * Writes to a single (column, row) value.
 * NOTE: INDEXES BY 1, NOT 0!!!!
 * @param {string} spreadsheetId 
 * @param {integer} column 
 * @param {integer} row 
 * @param {string} value 
 * @param {function} callbackFunction 
 */
export function modifySpreadsheetDataSingleCell(spreadsheetId, column, row, value, callbackFunction) {
    let columnLetter = columnToLetter(column);
    let range = columnLetter + row.toString();
    modifySpreadsheetData(spreadsheetId, range + ":" + range, [[value]], callbackFunction);
}

/**
 * Writes Google spreadsheet
 * @param {string} spreadsheetId The spreadsheet
 * @param {string} range The range of the spreadsheet
 * @param {list[list[string]]} values The values to write
 * @param {function} callbackFunction 
 */
export function modifySpreadsheetData(spreadsheetId, range, values, callbackFunction) {
    window.gapi.client.sheets.spreadsheets.values.update({
        "spreadsheetId": spreadsheetId,
        "range": range,
        "valueInputOption": "USER_ENTERED",
        "resource": {
            "values": values
        }
    }).then(callbackFunction ? callbackFunction : () => console.log("Success writing to Google Sheet!"), (response) => {
        alert('Error: ' + response.result.error.message);
    });
}

// /**
//  * Writes Google spreadsheet
//  * @param {string} spreadsheetId The spreadsheet
//  * @param {string} range The range of the spreadsheet
//  * @param {list[list[string]]} values The values to write
//  * @param {function} callbackFunction 
//  */
// export function appendSpredsheetData(spreadsheetId, range, values, callbackFunction) {
//     window.gapi.client.sheets.spreadsheets.values.append({
//         "spreadsheetId": spreadsheetId,
//         "range": range,
//         "valueInputOption": "USER_ENTERED",
//         "resource": {
//             "values": values
//         }
//     }).then(callbackFunction ? callbackFunction : () => console.log("Success writing to Google Sheet!"), (response) => {
//         alert('Error: ' + response.result.error.message);
//     });
// }

/**
 * Writes Google spreadsheet
 * @param {string} spreadsheetId The spreadsheet
 * @param {string} range The range of the spreadsheet
 * @param {list[list[string]]} values The values to write
 * @param {function} callbackFunction 
 */
export function appendSpreadsheetDataBatch(spreadsheetId, callbackFunction) {
    console.log(spreadsheetId)
    console.log(window.gapi.client.sheets)
    console.log(window.gapi.client.sheets.spreadsheets)
    window.gapi.client.sheets.spreadsheets.batchUpdate({
        "spreadsheetId": spreadsheetId,
        "resource": {
            "requests": [
            {
                "appendDimension": {
                  "sheetId" : (spreadsheetId === "1dQZYVvQ8siwCkfAyWKvMXDunXBp4EU1IBTurCPpo5i4") ? 442302205 : 1290302008,
                  "dimension": "COLUMNS",
                  "length": 1
                }
            }
        ]}
    }).then(callbackFunction ? callbackFunction : () => console.log("Success adding a column!"), (response) => {
        alert('Error: ' + response.result.error.message);
    });
}
