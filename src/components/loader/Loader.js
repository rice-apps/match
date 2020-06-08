import React from 'react';
import CSVReader from 'react-csv-reader';

export default function CSVFileUploader(props) {

    function onFileLoaded(file) {
        props.onUpload(file);
    }

    function onError(err) {
        console.log("Error loading in CSV");
        console.log(err);
    }

    return(
    <div>
        <CSVReader
        cssClass="csv-reader-input"
        label="Upload CSV file here "
        onFileLoaded={onFileLoaded}
        onError={onError}
        inputId="ObiWan"
        inputStyle={{color: 'red'}}
      />
      </div>)
}