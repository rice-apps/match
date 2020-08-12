import React from 'react';
import { FormattedCard } from '../components/formatted-card/FormattedCard';

import { useRecoilState, useRecoilValue } from 'recoil';
import { applicationState, leftDataState, rightDataState } from '../store/atoms';

import ColumnSettingsPanel from '../components/settings/ColumnSettingsPanel';
import SheetsSettingsPanel from '../components/settings/SheetsSettingsPanel';

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
        <SheetsSettingsPanel setLeftData={setLeftData} setRightData = {setRightData}/>
      </div>
    </div >
  );
}
