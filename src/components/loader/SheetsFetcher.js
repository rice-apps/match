import React, { useState, useEffect } from 'react';
import { loadGoogleSheet } from './uploader';
import { Input, Button} from 'antd';
import './Loader.css';

import { getSpreadsheetData } from '../../util/gapi';
import SheetsLoader from './SheetsLoader';

import { useRecoilValue } from 'recoil';
import { applicationState } from '../../store/atoms';


const DEFAULT_HCW_SPREADSHEET_ID = "1dQZYVvQ8siwCkfAyWKvMXDunXBp4EU1IBTurCPpo5i4"
const DEFAULT_STUDENT_SPREADSHEET_ID = "1C_eSI2aEe9Z2Lb2nMgyYMrdgEAnux67ywKuaP0wCHxM"
const DATABASE_ID = "1R_w_Fp733tjfU6VFnJxSK29qa58pVVwGZJ-83QLgfyM"

export default function SheetsFetcher(props) {
    // If allow manual sort, it must be left data panel. Default is hard-coded spreadsheet id for healthcare workers.
    const { user } = useRecoilValue(applicationState);

    function load(){
        loadDefaultSheetID();
        console.log("AFBKSAJBFA");
    }

    function loadDefaultSheetID() {
        console.log("Loading default sheet")
        props.onUpload(oldDataState => {
            return {
                ...oldDataState,
                refreshing: true // show data is loading
            }
        });
        setTimeout(getSpreadsheetData(DATABASE_ID, onSpreadsheetLoaded,onSpreadsheetError),10000);
    }

    function onSpreadsheetError(response) {
        alert('Error: '+response.result.error.message)
        props.onUpload(oldDataState => {
            return {
                ...oldDataState,
                refreshing: false
            }
        });
    }

    function onSpreadsheetLoaded(response) {
        var range = response.result;
        if (range.values.length > 0) {
            console.log(range.values);
            props.onUpload(oldDataState => {
                return {
                    ...oldDataState,
                    refreshing: false
                }
            });
        } else {
            alert('No stored data found.');
        }
    }
    if (false) {

    } else {
        return <SheetsLoader 
        onUpload={props.onUpload}
        allowManualSort={props.allowManualSort}
        />
    }
}
