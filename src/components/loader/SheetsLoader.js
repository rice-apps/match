import React, { useState, useEffect } from 'react';
import { formatData } from '../../util/dataFormatter';
import { Input, Button} from 'antd';
import './Loader.css';

import { getSpreadsheetData } from '../../util/gapi';

import { useRecoilValue } from 'recoil';
import { applicationState } from '../../store/atoms';


const DEFAULT_HCW_SPREADSHEET_ID = "1dQZYVvQ8siwCkfAyWKvMXDunXBp4EU1IBTurCPpo5i4"
const DEFAULT_STUDENT_SPREADSHEET_ID = "1C_eSI2aEe9Z2Lb2nMgyYMrdgEAnux67ywKuaP0wCHxM"

export default function SheetsLoader(props) {
    // If allow manual sort, it must be left data panel. Default is hard-coded spreadsheet id for healthcare workers.
    const defaultSpreadsheetId = props.allowManualSort ? DEFAULT_HCW_SPREADSHEET_ID : DEFAULT_STUDENT_SPREADSHEET_ID
    const [spreadsheetId, setSpreadsheetId] = useState(defaultSpreadsheetId)

    const { user } = useRecoilValue(applicationState);

    function loadGoogleSheet() {
        console.log("Loading google sheet")
        props.onUpload(oldDataState => {
            return {
                ...oldDataState,
                refreshing: true // show data is loading
            }
        });
        getSpreadsheetData(spreadsheetId, onSpreadsheetLoaded);
    }

    function onSpreadsheetLoaded(response) {
        var range = response.result;
        if (range.values.length > 0) {
            var newDataState = formatData(range.values, props.allowManualSort);
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
            props.onUpload(oldDataState => {
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

    function onSpreadsheetIdChange(e) {
        setSpreadsheetId(e.target.value);
    }

    return (
        <div className="Loader" style={props.style}>
            {/* If user is signed in, use Google sheets API. If not, upload csv for data loading. */}
            {user ?
                <div>
                    <Input
                        placeholder="Copy & paste the ID of the Google sheet"
                        onChange={onSpreadsheetIdChange}
                        defaultValue={defaultSpreadsheetId}
                        style={{ width: "400px" }} /> &nbsp;
                    <Button type = 'primary' onClick={loadGoogleSheet}>Upload data</Button>
                </div>
                :
                <p>Please log-in to upload a Google Sheet.</p>
            }
        </div>);
}
