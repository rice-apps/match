import React from 'react';

import { useRecoilState } from 'recoil';
import { applicationState, leftDataState, rightDataState } from '../store/atoms';
import { Select, Collapse } from 'antd';

const { Option } = Select;
const { Panel } = Collapse;

export default function Settings() {
  const [appState, setAppState] = useRecoilState(applicationState);
  const [leftData, setLeftData] = useRecoilState(leftDataState);
  const [rightData, setRightData] = useRecoilState(rightDataState);

  function changeLeftMatchColumn(value) {
    let column = leftData.columns[value];
    setLeftData(oldLeftDataState => {
      return {
        ...oldLeftDataState,
        matchColumn: column
      }
    })
  }

  function changeRightMatchColumn(value) {
    let column = rightData.columns[value];
    setRightData(oldRightDataState => {
      return {
        ...oldRightDataState,
        matchColumn: column
      }
    })
  }

  return (
    <div>
      <div className="Main">
        <div className="SettingsPanel">

          <div style={{ width: "30%", paddingTop: 20 }}>
            Left "match" column: &nbsp;
            <Select value={leftData.matchColumn ? leftData.matchColumn.title : null} style={{ width: 250 }} onChange={changeLeftMatchColumn}>
              {leftData.columns.map((column, i) => {
                return (
                  <Option key={i}>{column.title}</Option>
                )
              })}
            </Select>

            <br />
            <br />

            <Collapse accordion>
              <Panel header="All left columns" key="1">
                <h6>Left Columns:</h6>
                {leftData.columns.map((column, i) => {
                  return (
                    <p key={i}>{column.fullTitle}</p>
                  )
                })}
              </Panel>
            </Collapse>
          </div>

          <div style={{ width: "30%", paddingTop: 20 }}>
            Right "match" column: &nbsp;
            <Select value={rightData.matchColumn ? rightData.matchColumn.title : null} style={{ width: 250 }} onChange={changeRightMatchColumn}>
              {rightData.columns.map((column, i) => {
                return (
                  <Option key={i}>{column.title}</Option>
                )
              })}
            </Select>

            <br />
            <br />

            <Collapse accordion>
              <Panel header="All right columns" key="1">
                <h6>Right Columns:</h6>
                {rightData.columns.map((column, i) => {
                  return (
                    <p key={i}>{column.fullTitle}</p>
                  )
                })}
              </Panel>
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  );
}