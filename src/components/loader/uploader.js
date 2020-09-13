import { getSpreadsheetData } from '../../util/gapi';
import { formatData } from '../../util/dataFormatter';

export function loadGoogleSheet(spreadsheetId,allowManualSort,onUpload) {
    console.log("Loading google sheet")
    onUpload(oldDataState => {
        return {
            ...oldDataState,
            refreshing: true // show data is loading
        }
    });
    getSpreadsheetData(spreadsheetId, r=>onSpreadsheetLoaded(r,allowManualSort,spreadsheetId,onUpload), r=>onSpreadsheetError(r,onUpload));
}

function onSpreadsheetError(response,onUpload) {
    alert('Error: '+response.result.error.message)
    onUpload(oldDataState => {
        return {
            ...oldDataState,
            refreshing: false
        }
    });
}

function onSpreadsheetLoaded(response,allowManualSort,spreadsheetId,onUpload) {
    var range = response.result;
    if (range.values.length > 0) {
        var newDataState = formatData(range.values, allowManualSort);
        newDataState.selectedRows = [];
        newDataState.spreadsheetId = spreadsheetId;
        // For now, assuming name Column is last
        // MIGHT HAVE TO CHANGE THIS LATER!
        newDataState.matchColumn = newDataState.columns[newDataState.columns.length - 1];
        // For now, assuming name Column is 4th
        // MIGHT HAVE TO CHANGE THIS LATER!
        newDataState.nameColumn = newDataState.columns[3];
        // Assuming email column is 3rd
        newDataState.emailColumn = newDataState.columns[2];
        onUpload(oldDataState => {
            return {
                ...oldDataState,
                ...newDataState,
                refreshing: false
            }
        });
    } else {
        alert('No data found.');
    }
}