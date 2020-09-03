import React, { useState, useEffect } from 'react';
import CSVReader from 'react-csv-reader';
import { formatData } from '../../util/dataFormatter';
import './Loader.css';


export default function CSVFileUploader(props) {
    function onFileLoaded(data) {
        console.log(data);
        var newDataState = formatData(data, props.allowManualSort);
        newDataState.selectedRows = [];
        console.log(newDataState);
        props.onUpload(newDataState);
    }

    function onError(error) {
        alert("Error loading in CSV:" + JSON.stringify(error, null, 2));
    }

    return (
        <div className="Loader" style={props.style}>
            <CSVReader
                cssClass="csv-reader-input"
                label="Upload CSV file here "
                onFileLoaded={onFileLoaded}
                onError={onError}
                inputId="ObiWan"
                inputStyle={{ color: 'red' }}/>
        </div>
    );
}
