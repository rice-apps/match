import React from 'react';
import RightDataPanel from '../components/data-panel/RightDataPanel';
import LeftDataPanel from '../components/data-panel/LeftDataPanel';
import SplitPane from 'react-split-pane';

import { modifySpreadsheetDataSingleCell, getSpreadsheetData } from '../util/gapi';
import { formatData } from '../util/dataFormatter';

import { useRecoilState } from 'recoil';
import { rightDataState, leftDataState, applicationState } from '../store/atoms';


export default function Matcher() {
  const [appState, setAppState] = useRecoilState(applicationState);
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

  var windowWidth = window.innerWidth;
  var defaultPaneSize = Math.round(windowWidth / 2);

  function setSidebarOpen(open) {
    setAppState({
      ...appState,
      sidebarOpen: open
    });
  }

  // This basically refreshes the data in memory, see where this is used.
  function onLeftSpreadsheetLoaded(response) {
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

  // This basically refreshes the data in memory, see where this is used.
  function onRightSpreadsheetLoaded(response) {
    var range = response.result;
    if (range.values.length > 0) {
      var newDataState = formatData(range.values, true);
      setRightData(oldRightData => {
        let newState = {
          ...oldRightData,
          ...newDataState,
        }
        return newState;
      })
    } else {
      alert('No data found.');
    }
  }


  // This is the big boy function that actually makes matches
  function makeMatchOrUnmatch(row) {

    // Read and parse current match for both left and right
    let leftValue = [];
    if (selectedLeftRows[0][leftMatchColumn.key]) {
      leftValue = JSON.parse(selectedLeftRows[0][leftMatchColumn.key]);
    }
    let rightValue = []
    if (row[rightMatchColumn.key]) {
      rightValue = JSON.parse(row[rightMatchColumn.key]);
    }

    // Get the indeces for both left and right
    // These indeces must index by 1, not 0 as specified by the Google Sheets API
    let leftRowIndex = parseInt(selectedLeftRows[0].key) + 2;
    let leftColumnIndex = leftMatchColumn.index + 1;
    let rightRowIndex = parseInt(row.key) + 2;
    let rightColumnIndex = rightMatchColumn.index + 1;
    
    // Get the names for both left and right
    let leftName = selectedLeftRows[0][leftNameColumn.key];
    let rightName = row[rightNameColumn.key];

    // If the right index does not already exist in the left cell, add it
    if (!leftValue.map(list => list[0]).includes(rightRowIndex)) {
      leftValue.push([rightRowIndex, rightName]);
    } else {
      // Otherwise, we should remove it, THIS IS UNMATCH
      return;
    }

    // If the left index does not already exist in the right cell, add it
    if (!rightValue.map(list => list[0]).includes(leftRowIndex)) {
      rightValue.push([leftRowIndex, leftName]);
    } else {
      // Otherwise, we should remove it, THIS IS UNMATCH
      return;
    }

    // Stringify both left and right before writing to Google Sheets
    let leftValueString = JSON.stringify(leftValue);
    let rightValueString = JSON.stringify(rightValue);

    // If the left data is from Google Sheets, write to it
    if (leftSpreadsheetId) {
      modifySpreadsheetDataSingleCell(leftSpreadsheetId, leftColumnIndex, leftRowIndex, leftValueString, () => {
        // This refreshes the data in this app once the spreadsheet is written to
        getSpreadsheetData(leftSpreadsheetId, onLeftSpreadsheetLoaded);
      });
    }

    // If the right data is from Google Sheets, write to it
    if (rightSpreadsheetId) {
      modifySpreadsheetDataSingleCell(rightSpreadsheetId, rightColumnIndex, rightRowIndex, rightValueString, () => {
        // This refreshes the data in this app once the spreadsheet is written to
        getSpreadsheetData(rightSpreadsheetId, onRightSpreadsheetLoaded);
      });
    }
  }


  return (
    <div>
      <div className="Main">
        <button style={{ position: "absolute", zIndex: 1, marginTop: 10 }} onClick={() => setSidebarOpen(true)}>
          Sort/Filter
            </button>

        <div className="Body">

          {/* Split plane to allow panel resizing */}
          <SplitPane split="vertical" minSize={400} defaultSize={defaultPaneSize} style={{ overflow: 'auto' }}>

            <LeftDataPanel />
            <RightDataPanel
              makeMatchOrUnmatch={makeMatchOrUnmatch} />

          </SplitPane>
        </div>
      </div>
    </div>
  );
}
