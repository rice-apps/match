import React from 'react';
import Loader from '../../components/loader/Loader';
import Table from '../table/Table';
import { Card } from "antd";
import { applyRules } from '../../util/rules';
import { modifySpreadsheetDataSingleCell, getSpreadsheetData } from '../../util/gapi';
import { formatData } from '../../util/dataFormatter';

import { useRecoilState, useRecoilValue } from 'recoil';
import { rightDataState, leftDataState, rulesState } from '../../store/atoms';


export default function RightDataPanel() {
  const [{ data, columns, selectedRows, matchColumn: rightMatchColumn, spreadsheetId: rightSpreadsheetId }, setRightData] = useRecoilState(rightDataState);
  const [{ selectedRows: selectedLeftRows, matchColumn: leftMatchColumn, spreadsheetId: leftSpreadsheetId }, setLeftData] = useRecoilState(leftDataState);
  const rules = useRecoilValue(rulesState);

  function onSelectRow(rows) {
    setRightData(data => {
      return {
        ...data,
        selectedRows: rows
      }
    })
  }

  // Here's where the sorting/filtering happens!!
  // Note selectedLeftRows[0]. Should only ever have one in the list anyways 
  // as the left panel is "radio" select type.
  const sortedData = applyRules(rules, data, selectedLeftRows[0]);

  function onSpreadsheetLoaded(response) {
    var range = response.result;
    if (range.values.length > 0) {
      var newDataState = formatData(range.values, true);
      setLeftData(oldLeftData => {
        return {
          ...oldLeftData,
          ...newDataState,
        }
      })
    } else {
      alert('No data found.');
    }
  }

  function makeMatch(row) {

    // Read current match
    let leftValue = [];
    if (selectedLeftRows[0][leftMatchColumn.key]) {
      leftValue = JSON.parse(selectedLeftRows[0][leftMatchColumn.key]);
    }

    // These indeces must index by 1, not 0 as specified by the Google Sheets API
    let leftRowIndex = parseInt(selectedLeftRows[0].key) + 2;
    let leftColumnIndex = leftMatchColumn.index + 1;

    let rightRowIndex = parseInt(row.key) + 2;
    leftValue.push(rightRowIndex);

    let leftValueString = JSON.stringify(leftValue);
    // let rightV

    if (leftSpreadsheetId) {
      modifySpreadsheetDataSingleCell(leftSpreadsheetId, leftColumnIndex, leftRowIndex, leftValueString, () => {
        // This refreshes the data in this app once the spreadsheet is written to
        getSpreadsheetData(leftSpreadsheetId, onSpreadsheetLoaded);
      });
    }
  }

  return (
    <div className="DataPanel">

      {/* Loader to accept csv input */}
      {data.length === 0 && <Loader
        onUpload={setRightData}
        allowManualSort={false}
      />}
      <br />


      {/* The actual table for this panel. Note that it's "checkbox" selection type.
          This means you can select multiple rows from this table. */}
      <Table
        onSelectRow={onSelectRow}
        data={sortedData}
        columns={columns}
        selectType={"checkbox"}
        matchColumn={rightMatchColumn}
      />

      {/* This just renders in the selected rows */}
      <div className="SelectionDisplay">
        {selectedRows.map((row, i) =>
          <div key={i}>
            <button onClick={() => makeMatch(row)}>Match!</button>
            <Card style={{ width: 300 }}>
              {Object.entries(row).map((attribute, ii) => {
                let [key, value] = attribute;
                return (<p key={ii}>{key} : {value}</p>)
              })}
            </Card>
          </div>)}
      </div>

    </div>
  )
}