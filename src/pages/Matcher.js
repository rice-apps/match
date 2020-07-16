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
              makeMatch={makeMatch} />

          </SplitPane>
        </div>
      </div>
    </div>
  );
}
