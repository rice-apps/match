import React from 'react';

import { useRecoilState } from 'recoil';
import { applicationState, leftDataState, rightDataState } from '../store/atoms';

import { Card } from 'antd';


export default function Settings() {
  const [appState, setAppState] = useRecoilState(applicationState);
  const [leftData, setLeftData] = useRecoilState(leftDataState);
  const [rightData, setRightData] = useRecoilState(rightDataState);

  return (
    <div>
      <div className="Main">
        <div className="SettingsPanel">

          <div>
            <Card>
              <h6>Left Columns:</h6>
              {leftData.columns.map((column, i) => {
                return (
                  <p key={i}>{column.title}</p>
                )
              })}
            </Card>
          </div>
          <Card>
            <h6>Right Columns:</h6>
            {rightData.columns.map((column, i) => {
              return (
                <p key={i}>{column.title}</p>
              )
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}
