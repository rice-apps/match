import React from 'react';
import { Card } from "antd";

import { useRecoilValue } from 'recoil';
import { applicationState } from '../../store/atoms';

import Loader from '../../components/loader/Loader';

export default function SheetsSettingsPanel(props) {
  const { user } = useRecoilValue(applicationState);

  return (
    <div style={{ width: 600, paddingTop: 20 }}>
      <Card title="Google Sheets">
        {user ?
        <div>
          Left Spreadsheet ID
          <Loader style={{"text-align": "left", "padding-top": "10px", "padding-bottom": "20px"}} onUpload={props.setLeftData} allowManualSort={true}/>
          Right Spreadsheet ID
          <Loader style={{"text-align": "left"}} onUpload={props.setRightData} allowManualSort={true}/>
        </div> :
        <div>Sign in to Google to use sheets.</div>
        }
      </Card>
    </div>
  )
}
