import React from 'react';
import { FormattedCard } from '../components/formatted-card/FormattedCard';
import { Button } from 'antd';

import { useRecoilState, useRecoilValue } from 'recoil';
import { applicationState, leftDataState, rightDataState } from '../store/atoms';

import ColumnSettingsPanel from '../components/settings/ColumnSettingsPanel';
import { useLocation } from 'react-router-dom'

export default function Settings() {
  const route = useLocation().pathname.split("/")[1];
  const { user } = useRecoilValue(applicationState);
  const [leftData, setLeftData] = useRecoilState(leftDataState);
  const [rightData, setRightData] = useRecoilState(rightDataState);

  return (
    <div>
      <div style = {{width:"100%", padding:5, backgroundColor:'#f7f7f7'}}>
        <span>
        <b> </b>
        <Button type={'primary'} href={'/' + route}> Back to Matching </Button>
        <b> </b>
        <Button href={'/' + route+'/pods'}>See Pods</Button>
        </span>
      </div>
      <div className="Main">
        <div className="SettingsPanel">
          <div style={{ width: 400, paddingTop: 20 }}>
            {user && <FormattedCard title="User information" row={user} />}
          </div>
          <ColumnSettingsPanel data={leftData} setData={setLeftData} title={"All left column settings"} />
          <ColumnSettingsPanel data={rightData} setData={setRightData} title={"All right column settings"} />
        </div>
      </div>
    </div >
  );
}
