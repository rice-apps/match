import React, { useState, useEffect } from 'react';
import { formatData } from '../../util/dataFormatter';
import { Input, Button} from 'antd';
import './Loader.css';

import { useRecoilValue } from 'recoil';
import { applicationState } from '../../store/atoms';

import { useLocation } from 'react-router-dom';


const MATCH_COLUMN_NAME = "MATCH";

export default function SalesforceLoader(props) {
    // If allow manual sort, it must be left data panel. Default is hard-coded spreadsheet id for healthcare workers.    
    const { user } = useRecoilValue(applicationState);

    const route = useLocation().pathname.split("/")[1];
   

    function formatFullName(firstName, lastName) {
        let firstNameFormat = firstName.trim().toLowerCase();
        let lastNameFormat = lastName.trim().toLowerCase();
        if (firstNameFormat.length > 0) {
            firstNameFormat = firstNameFormat[0].toUpperCase() + firstNameFormat.substring(1, firstNameFormat.length);
        }
        if (lastNameFormat.length > 0) {
            lastNameFormat = lastNameFormat[0].toUpperCase() + lastNameFormat.substring(1, lastNameFormat.length);
        }     
        return firstNameFormat + " " + lastNameFormat;
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