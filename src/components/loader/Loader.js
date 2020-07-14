import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { formatData } from '../../util/dataFormatter';
import { Input } from 'antd';
import './Loader.css';

import { getSpreadsheetData } from '../../util/gapi';

import { useRecoilValue } from 'recoil';
import { applicationState } from '../../store/atoms';


const DEFAULT_HCW_SPREADSHEET_ID = "1dQZYVvQ8siwCkfAyWKvMXDunXBp4EU1IBTurCPpo5i4"
const DEFAULT_STUDENT_SPREADSHEET_ID = "1C_eSI2aEe9Z2Lb2nMgyYMrdgEAnux67ywKuaP0wCHxM"

export default function CSVFileUploader(props) {
    // If allow manual sort, it must be left data panel. Default is hard-coded spreadsheet id for healthcare workers.
    const defaultSpreadsheetId = props.allowManualSort ? DEFAULT_HCW_SPREADSHEET_ID : DEFAULT_STUDENT_SPREADSHEET_ID
    const [spreadsheetId, setSpreadsheetId] = useState(defaultSpreadsheetId)

    const { user } = useRecoilValue(applicationState);

    function onFileLoaded(data) {
        console.log(data);
        var newDataState = formatData(data, props.allowManualSort);
        props.onUpload(newDataState);
    }

    function onError(error) {
        alert("Error loading in CSV:" + JSON.stringify(error, null, 2));
    }

    function onGoogleSheetClick() {
        getSpreadsheetData(spreadsheetId, onSpreadsheetLoaded);
    }

    function onSpreadsheetLoaded(response) {
        var range = response.result;
        if (range.values.length > 0) {
            var newDataState = formatData(range.values, props.allowManualSort);
            newDataState.spreadsheetId = spreadsheetId;
            newDataState.matchColumn = newDataState.columns[newDataState.columns.length - 1];
            props.onUpload(newDataState);
        } else {
            alert('No data found.');
        }
    }

    function onSpreadsheetIdChange(e) {
        setSpreadsheetId(e.target.value);
    }

    return (
        <div className="Loader">
            {/* If user is signed in, use Google sheets API. If not, upload csv for data loading. */}
            {user ?
                <div>
                    <Input
                        placeholder="Copy & paste the ID of the Google sheet"
                        onChange={onSpreadsheetIdChange}
                        defaultValue={defaultSpreadsheetId}
                        style={{ width: "400px" }} /> &nbsp;
                    <button onClick={onGoogleSheetClick}>Upload data</button>
                </div>
                : <CSVReader
                    cssClass="csv-reader-input"
                    label="Upload CSV file here "
                    onFileLoaded={onFileLoaded}
                    onError={onError}
                    inputId="ObiWan"
                    inputStyle={{ color: 'red' }}
                />
            }
        </div>);
}
