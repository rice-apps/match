import React from 'react';

import { useRecoilState } from 'recoil';
import { applicationState, leftDataState, rightDataState } from '../store/atoms';

import ColumnSettingsPanel from '../components/settings/ColumnSettingsPanel';

export default function Settings() {
  const [appState, setAppState] = useRecoilState(applicationState);
  const [leftData, setLeftData] = useRecoilState(leftDataState);
  const [rightData, setRightData] = useRecoilState(rightDataState);

  return (
    <div>
      <div className="Main">
        <div className="SettingsPanel">
          <ColumnSettingsPanel data={leftData} setData={setLeftData} title={"All left column settings"}/>
          <ColumnSettingsPanel data={rightData} setData={setRightData} title={"All right column settings"}/>
      </div>
    </div>
    </div >
  );
}
