import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { formatData } from '../../util/dataFormatter';
import { Input } from 'antd';
import './Loader.css';

import { getSpreadsheetData } from '../../util/gapi';

import { useRecoilValue } from 'recoil';
import { applicationState } from '../../store/atoms';


export default function CSVFileUploader(props) {
    const [spreadsheetId, setSpreadsheetId] = useState("")

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
            props.onUpload(newDataState);
        } else {
            console.log('No data found.');
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
                        style={{ width: "300px" }} /> &nbsp;
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