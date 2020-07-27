import React, { useEffect } from 'react';
import RightDataPanel from '../components/data-panel/RightDataPanel';
import LeftDataPanel from '../components/data-panel/LeftDataPanel';
import SplitPane from 'react-split-pane';

import { modifySpreadsheetDataSingleCell, getSpreadsheetData } from '../util/gapi';
import { formatData } from '../util/dataFormatter';

import { useRecoilState } from 'recoil';
import { rightDataState, leftDataState, applicationState } from '../store/atoms';

import LoadingOverlay from 'react-loading-overlay';


export default function Matcher() {
  const [appState, setAppState] = useRecoilState(applicationState);
  const [
    { matchColumn: rightMatchColumn,
      spreadsheetId: rightSpreadsheetId,
      nameColumn: rightNameColumn,
      refreshing: rightRefreshing,
    }, setRightData] = useRecoilState(rightDataState);
  const [
    { selectedRows: selectedLeftRows,
      matchColumn: leftMatchColumn,
      spreadsheetId: leftSpreadsheetId,
      nameColumn: leftNameColumn,
      refreshing: leftRefreshing,
    }, setLeftData] = useRecoilState(leftDataState);

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
      console.log(newDataState)
      setLeftData(oldLeftData => {
        let newState = {
          ...oldLeftData,
          // Only updating the state and refreshing
          // NOTE: If you override the old columns, then you get rid of previous settings
          data: newDataState.data,
          // Update selected selected rows with new data
          selectedRows: oldLeftData.selectedRows.map(row =>
            // Get the updated row from the new state
            newDataState.data[row.key]
          ),
          refreshing: false,
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
      console.log(newDataState);
      setRightData(oldRightData => {
        let newState = {
          ...oldRightData,
          // Only updating the state and refreshing
          // NOTE: If you override the old columns, then you get rid of previous settings
          data: newDataState.data,
          // Update selected selected rows with new data
          selectedRows: oldRightData.selectedRows.map(row =>
            // Get the updated row from the new state
            newDataState.data[row.key]
          ),
          refreshing: false,
        }
        console.log(newState);
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
      // THIS IS UNMATCH!! because right side cannot be matched twice!!
      rightValue = JSON.parse(row[rightMatchColumn.key]);
    }

    // Get the indices for both left and right
    // These indices must index by 1, not 0 as specified by the Google Sheets API
    let leftRowIndex = parseInt(selectedLeftRows[0].key) + 2;
    let leftColumnIndex = leftMatchColumn.index + 1;
    let rightRowIndex = parseInt(row.key) + 2;
    let rightColumnIndex = rightMatchColumn.index + 1;

    // Get the names for both left and right
    let leftName = selectedLeftRows[0][leftNameColumn.key];
    let rightName = row[rightNameColumn.key];

    // Check for the the index of the right value in the left cell
    let indexOfRightInLeft = leftValue.map(list => list[0]).indexOf(rightRowIndex)
    // If the right index does not already exist in the left cell, add it
    if (indexOfRightInLeft == -1) {
      leftValue.push([rightRowIndex, rightName]);
    } else {
      // Otherwise, we should remove it, THIS IS UNMATCH!!
      leftValue.splice(indexOfRightInLeft, 1)
    }
    
    // Check for the the index of the right value in the left cell
    let indexOfLeftInRight = rightValue.map(list => list[0]).indexOf(leftRowIndex)
    // If the left index does not already exist in the right cell, add it
    if (indexOfLeftInRight == -1) {
      rightValue.push([leftRowIndex, leftName]);
    } else {
      // Otherwise, we should remove it, THIS IS UNMATCH!!
      rightValue.splice(indexOfLeftInRight, 1)
    }
    // Stringify both left and right before writing to Google Sheets
    let leftValueString = JSON.stringify(leftValue);
    let rightValueString = JSON.stringify(rightValue);

    // Save an empty list [] as a blank cell
    if (leftValueString == "[]") leftValueString = "";
    if (rightValueString == "[]") rightValueString = "";

    // If the left data is from Google Sheets, write to it
    if (leftSpreadsheetId) {
      modifySpreadsheetDataSingleCell(leftSpreadsheetId, leftColumnIndex, leftRowIndex, leftValueString, () => {
        console.log("Done writing to left!")
        // Set refreshing to be true
        setLeftData(leftDataState => {
          return {
            ...leftDataState,
            refreshing: true,
          }
        })
        // This refreshes the data in this app once the spreadsheet is written to
        getSpreadsheetData(leftSpreadsheetId, onLeftSpreadsheetLoaded);
      });
    }

    // If the right data is from Google Sheets, write to it
    if (rightSpreadsheetId) {
      modifySpreadsheetDataSingleCell(rightSpreadsheetId, rightColumnIndex, rightRowIndex, rightValueString, () => {
        console.log("Done writing to right!")
        // Set refreshing to be true
        setRightData(rightDataState => {
          return {
            ...rightDataState,
            refreshing: true,
          }
        })
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
          {/* This is the loading screen */}
          <LoadingOverlay
            active={rightRefreshing || leftRefreshing}
            spinner
            text='Syncing...'
          >
            <div style={{ height: "100vh", width: "100vw" }}>
              {/* Split plane to allow panel resizing */}
              <SplitPane split="vertical" minSize={400} defaultSize={defaultPaneSize} style={{ overflow: 'auto' }}>
                <LeftDataPanel />
                <RightDataPanel
                  makeMatchOrUnmatch={makeMatchOrUnmatch} />
              </SplitPane>
            </div>
          </LoadingOverlay>
        </div>
      </div>
    </div>
  );
}
