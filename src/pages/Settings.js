import React from 'react';

import { useRecoilState } from 'recoil';
import { applicationState, leftDataState, rightDataState } from '../store/atoms';
import { Select, Collapse, Checkbox } from 'antd';

const { Option } = Select;
const { Panel } = Collapse;

export default function Settings() {
  const [appState, setAppState] = useRecoilState(applicationState);
  const [leftData, setLeftData] = useRecoilState(leftDataState);
  const [rightData, setRightData] = useRecoilState(rightDataState);

  function changeColumn(value, columnType, data, setDataStateFunction) {
    let column = data.columns[value];
    setDataStateFunction(oldLeftDataState => {
      return {
        ...oldLeftDataState,
        [columnType]: column
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

  function changeLeftNameColumn(value) {
    let column = leftData.columns[value];
    setLeftData(oldLeftDataState => {
      return {
        ...oldLeftDataState,
        nameColumn: column
      }
    })
  }

  function changeRightNameColumn(value) {
    let column = rightData.columns[value];
    setRightData(oldRightDataState => {
      return {
        ...oldRightDataState,
        nameColumn: column
      }
    })
  }

  function setColumnFixed(column, setDataStateFunction, direction) {
    let newColumn = {
      ...column,
      fixed: direction
    };
    setDataStateFunction(
      oldDataState => {
        return {
          ...oldDataState,
          columns: Object.assign([], oldDataState.columns, { [column.index]: newColumn }),
        }
      }
    )
  }

  return (
    <div>
      <div className="Main">
        <div className="SettingsPanel">

          <div style={{ width: "30%", paddingTop: 20 }}>
            <div>
              Match column: &nbsp;
                <Select value={leftData.matchColumn ? leftData.matchColumn.title : null} style={{ width: 250 }}
                onChange={(value) => changeColumn(value, 'matchColumn', leftData, setLeftData)}>
                {leftData.columns.map((column, i) => {
                  return (
                    <Option key={i}>{column.title}</Option>
                  )
                })}
              </Select>
          </div>

          <br />

          <div>
            Name column: &nbsp;
                <Select value={leftData.nameColumn ? leftData.nameColumn.title : null} style={{ width: 250 }} onChange={changeLeftNameColumn}>
              {leftData.columns.map((column, i) => {
                return (
                  <Option key={i}>{column.title}</Option>
                )
              })}
            </Select>
          </div>

          <br />

          <Collapse accordion>
            <Panel header="All left columns" key="1">
              <h6>Left Columns:</h6>
              {leftData.columns.map((column, i) => {
                return (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <p style={{ width: 300 }} key={i}>{column.fullTitle}</p> &nbsp;
                    <Checkbox checked={column.fixed === "left"} onChange={() => setColumnFixed(column, setLeftData, "left")}>FL</Checkbox>
                    <Checkbox checked={column.fixed === "right"} onChange={() => setColumnFixed(column, setLeftData, "right")}>FR</Checkbox>
                  </div>
                )
              })}
            </Panel>
          </Collapse>
        </div>

        <div style={{ width: "30%", paddingTop: 20 }}>
          <div>
            Match column: &nbsp;
                <Select value={rightData.matchColumn ? rightData.matchColumn.title : null} style={{ width: 250 }} onChange={changeRightMatchColumn}>
              {rightData.columns.map((column, i) => {
                return (
                  <Option key={i}>{column.title}</Option>
                )
              })}
            </Select>
          </div>

          <br />

          <div>
            Name column: &nbsp;
                <Select value={rightData.nameColumn ? rightData.nameColumn.title : null} style={{ width: 250 }} onChange={changeRightNameColumn}>
              {rightData.columns.map((column, i) => {
                return (
                  <Option key={i}>{column.title}</Option>
                )
              })}
            </Select>
          </div>

          <br />

          <Collapse accordion>
            <Panel header="All right columns" key="1">
              <h6>Right Columns:</h6>
              {rightData.columns.map((column, i) => {
                return (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <p style={{ width: 300 }} key={i}>{column.fullTitle}</p> &nbsp;
                    <Checkbox checked={column.fixed === "left"} onChange={() => setColumnFixed(column, setRightData, "left")}>FL</Checkbox>
                    <Checkbox checked={column.fixed === "right"} onChange={() => setColumnFixed(column, setRightData, "right")}>FR</Checkbox>
                  </div>
                )
              })}
            </Panel>
          </Collapse>
        </div>
      </div>
    </div>
    </div >
  );
}
