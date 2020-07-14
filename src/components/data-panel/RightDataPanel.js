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
  const [
    { data, columns, selectedRows,
      matchColumn: rightMatchColumn,
      spreadsheetId: rightSpreadsheetId,
      nameColumn: rightNameColumn }, setRightData] = useRecoilState(rightDataState);
  const [
    { selectedRows: selectedLeftRows,
      matchColumn: leftMatchColumn,
      spreadsheetId: leftSpreadsheetId,
      nameColumn: leftNameColumn }, setLeftData] = useRecoilState(leftDataState);

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

  // This basically refreshes the data in memory, see where this is used.
  function onSpreadsheetLoaded(response) {
    var range = response.result;
    if (range.values.length > 0) {
      var newDataState = formatData(range.values, true);
      setLeftData(oldLeftData => {
        let newState = {
          ...oldLeftData,
          ...newDataState,
        }
        return newState;
      })
    } else {
      alert('No data found.');
    }
  }

  // This is the big boy function that actually makes matches
  function makeMatch(row) {

    // Read current match
    let leftValue = [];
    if (selectedLeftRows[0][leftMatchColumn.key]) {
      leftValue = JSON.parse(selectedLeftRows[0][leftMatchColumn.key]);
    }

    // These indeces must index by 1, not 0 as specified by the Google Sheets API
    let leftRowIndex = parseInt(selectedLeftRows[0].key) + 2;
    let leftColumnIndex = leftMatchColumn.index + 1;
    let leftName = selectedLeftRows[0][leftNameColumn.key];

    let rightRowIndex = parseInt(row.key) + 2;
    let rightName = row[rightNameColumn.key];

    // If the right index does not already exist in the left cell, add it
    if (!leftValue.map(list => list[0]).includes(rightRowIndex)) {
      leftValue.push([rightRowIndex, rightName]);
    } else {
      // Otherwise, we can just return, they were already matched
      return;
    }

    // Stringify it before writing to Google Sheets
    let leftValueString = JSON.stringify(leftValue);

    // If the left data is from Google Sheets, write to it
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