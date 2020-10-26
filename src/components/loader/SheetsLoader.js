import React, { useState, useEffect } from 'react';
import { formatData } from '../../util/dataFormatter';
import { Input, Button} from 'antd';
import './Loader.css';

import { modifySpreadsheetDataSingleCell, getSpreadsheetData } from '../../util/gapi';

import { useRecoilValue } from 'recoil';
import { applicationState } from '../../store/atoms';

import { useLocation } from 'react-router-dom';

let DEFAULT_HCW_SPREADSHEET_ID = "1dQZYVvQ8siwCkfAyWKvMXDunXBp4EU1IBTurCPpo5i4";
let DEFAULT_STUDENT_SPREADSHEET_ID = "1C_eSI2aEe9Z2Lb2nMgyYMrdgEAnux67ywKuaP0wCHxM";
const MATCH_COLUMN_NAME = "MATCH";

export default function SheetsLoader(props) {
    // If allow manual sort, it must be left data panel. Default is hard-coded spreadsheet id for healthcare workers.    
    let defaultSpreadsheetId = props.allowManualSort ? DEFAULT_HCW_SPREADSHEET_ID : DEFAULT_STUDENT_SPREADSHEET_ID
    const route = useLocation().pathname.split("/")[1];
    //sheetIDs when route is to hivesforheroes
    if (route === "hivesforheroes") {
        DEFAULT_HCW_SPREADSHEET_ID = "1Sm0jsq0_7fhpsSgUHAbHyIGfERaGLDAp8_mitdrXCvs";
        DEFAULT_STUDENT_SPREADSHEET_ID = "1hiapWZBcL2mLhMeCjJIan_G37gFcQe-d8nT57mwKfXE";
        defaultSpreadsheetId = props.allowManualSort ? DEFAULT_HCW_SPREADSHEET_ID : DEFAULT_STUDENT_SPREADSHEET_ID;
    }
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
        getSpreadsheetData(spreadsheetId, onSpreadsheetLoaded, props.tabname);
    }
    


    function onSpreadsheetLoaded(response) {
        console.log("OnSpreadsheetLoaded start")
        var range = response.result;
        if (range.values.length > 0) {
            var newDataState = formatData(range.values, props.allowManualSort);
            newDataState.selectedRows = [];
            newDataState.spreadsheetId = spreadsheetId;
            // For now, assuming name Column is last
            // MIGHT HAVE TO CHANGE THIS LATER!
            console.log(newDataState.columns);

            const indexMatch = findIndexOfColumnWithName(MATCH_COLUMN_NAME, newDataState.columns)
            if (indexMatch === -1) {
                //createColumn(MATCH_COLUMN_NAME, newDataState.columns.length)
                newDataState.matchColumn = null;
            } else {
                newDataState.matchColumn = newDataState.columns[indexMatch];
      
            }
            
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
        console.log("OnSpreadsheetLoaded end")
    }

    function onSpreadsheetIdChange(e) {
        e.persist() // probably not necessary
        const input = e.target.value;
        if (input.includes("/")) {
            const arr = input.split("/")
            const index = arr.indexOf("spreadsheets")
            if (0 < index && index <= arr.length - 3 && arr[index+1] === "d") {
                setSpreadsheetId(arr[index+2]);
            }
        } else {
            setSpreadsheetId(e.target.value);
        }
    }

    const findIndexOfColumnWithName = (name, columns) => {
        const res = columns.findIndex((obj) => {
            return obj.fullTitle === name
        })
        console.log("res of find index of column", res)
        return res === undefined ? -1 : res
    }

    return (
        <div className="Loader" style={props.style}>
            {/* If user is signed in, use Google sheets API. If not, upload csv for data loading. */}
            {user ?
                <div>
                    <Input
                        placeholder="Copy & paste the ID or URL of the Google sheet"
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
