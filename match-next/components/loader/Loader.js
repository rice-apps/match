import React from 'react';
import CSVReader from 'react-csv-reader';
import { formatData } from '../../util/dataFormatter';


export default function CSVFileUploader(props) {

    function onFileLoaded(data) {
        var newDataState = formatData(data, props.allowManualSort);
        props.onUpload(newDataState);
    }

    function onError(err) {
        console.log("Error loading in CSV:");
        console.log(err);
    }

    return(
    <div className="Loader">
        <CSVReader
        cssClass="csv-reader-input"
        label="Upload CSV file here "
        onFileLoaded={onFileLoaded}
        onError={onError}
        inputId="ObiWan"
        inputStyle={{color: 'red'}}
      />
    </div>);
}