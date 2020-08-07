import React from 'react';
import { FormattedCard } from '../components/formatted-card/FormattedCard';
import { Card } from 'antd';


import { useRecoilState, useRecoilValue } from 'recoil';
import { applicationState, leftDataState, rightDataState } from '../store/atoms';

import ColumnSettingsPanel from '../components/settings/ColumnSettingsPanel';
import Loader from '../components/loader/Loader';

export default function Settings() {
  const { user } = useRecoilValue(applicationState);
  const [leftData, setLeftData] = useRecoilState(leftDataState);
  const [rightData, setRightData] = useRecoilState(rightDataState);

  return (
    <div>
      <div className="Main">
        <div className="SettingsPanel">
          <div style={{ width: 400, paddingTop: 20 }}>
            {user && <FormattedCard title="User information" row={user} />}
          </div>
          <ColumnSettingsPanel data={leftData} setData={setLeftData} title={"All left column settings"} />
          <ColumnSettingsPanel data={rightData} setData={setRightData} title={"All right column settings"} />
        </div>
        <div style={{ width: 600, paddingTop: 20 }}>
          <Card title="Google Sheets">
            {user ?
            <div>
              Left Spreadsheet ID
              <Loader style={{"text-align": "left", "padding-top": "10px", "padding-bottom": "20px"}} onUpload={setLeftData} allowManualSort={true}/>
              Right Spreadsheet ID
              <Loader style={{"text-align": "left"}} onUpload={setRightData} allowManualSort={true}/>
            </div> :
            <div>Sign in to Google to use sheets.</div>
            }
          </Card>
        </div>
      </div>
    </div >
  );
}
