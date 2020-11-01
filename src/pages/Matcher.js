import React from 'react';
import RightDataPanel from '../components/data-panel/RightDataPanel';
import LeftDataPanel from '../components/data-panel/LeftDataPanel';
import SplitPane from 'react-split-pane';

import { Button, Checkbox } from 'antd';

import { modifySpreadsheetDataSingleCell, getSpreadsheetData, appendSpreadsheetDataBatch } from '../util/gapi';
import { formatData } from '../util/dataFormatter';

import { useRecoilState } from 'recoil';
import { rightDataState, leftDataState, applicationState } from '../store/atoms';

import LoadingOverlay from 'react-loading-overlay';
import { useLocation } from 'react-router-dom'

export default function Matcher() {
  const route = useLocation().pathname;

  const [appState, setAppState] = useRecoilState(applicationState);
  const [
    { matchColumn: rightMatchColumn,
      spreadsheetId: rightSpreadsheetId,
      emailColumn: rightEmailColumn,
      refreshing: rightRefreshing,
    }, setRightData] = useRecoilState(rightDataState);
  const [
    { selectedRows: selectedLeftRows,
      matchColumn: leftMatchColumn,
      spreadsheetId: leftSpreadsheetId,
      emailColumn: leftEmailColumn,
      refreshing: leftRefreshing,
    }, setLeftData] = useRecoilState(leftDataState);

  var windowWidth = window.innerWidth;
  var defaultPaneSize = Math.round(windowWidth / 2);

  //Disable matching variables & function
  var matchingEnabled = leftSpreadsheetId && rightSpreadsheetId && rightEmailColumn && leftEmailColumn && rightMatchColumn && leftMatchColumn;

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


  // These functions actually match and unmatch
  function writeToGoogleSheets(left,right){
     // Stringify both left and right before writing to Google Sheets
     let leftValueString = JSON.stringify(left.value);
     let rightValueString = JSON.stringify(right.value);
 
     // Save an empty list [] as a blank cell
     if (leftValueString === "[]") leftValueString = "";
     if (rightValueString === "[]") rightValueString = "";
 
     // If the left data is from Google Sheets, write to it
     if (leftSpreadsheetId) {
 
       // Set refreshing to be true
       setLeftData(leftDataState => {
         return {
           ...leftDataState,
           refreshing: true,
         }
       })
 
       modifySpreadsheetDataSingleCell(leftSpreadsheetId, left.columnIndex, left.rowIndex, leftValueString, () => {
         console.log("Done writing to left!");
         // This refreshes the data in this app once the spreadsheet is written to
         getSpreadsheetData(leftSpreadsheetId, onLeftSpreadsheetLoaded);
       });
     }
 
     // If the right data is from Google Sheets, write to it
     if (rightSpreadsheetId) {
       // Set refreshing to be true
       setRightData(rightDataState => {
         return {
           ...rightDataState,
           refreshing: true,
         }
       });
       modifySpreadsheetDataSingleCell(rightSpreadsheetId, right.columnIndex, right.rowIndex, rightValueString, () => {
         console.log("Done writing to right!");
         // This refreshes the data in this app once the spreadsheet is written to
         getSpreadsheetData(rightSpreadsheetId, onRightSpreadsheetLoaded);
       });
     }
  }

  function getLeftRightInfo(row){
    return {
      left: {
        value: selectedLeftRows[0][leftMatchColumn.key]? JSON.parse(selectedLeftRows[0][leftMatchColumn.key]) : [],
        rowIndex: parseInt(selectedLeftRows[0].key) + 2,
        columnIndex: leftMatchColumn.index + 1,
        entryId: selectedLeftRows[0][leftEmailColumn.key]
      },
      right:{
        value: row[rightMatchColumn.key] ? JSON.parse(row[rightMatchColumn.key]) : [],
        rowIndex: parseInt(row.key) + 2,
        columnIndex: rightMatchColumn.index + 1,
        entryId: row[rightEmailColumn.key]
      }
    }
  }

  function match(row) {
    //Get info
    let info = getLeftRightInfo(row);
    let left = info.left;
    let right = info.right;
    //Match logic
    left.value.push(right.entryId);
    right.value.push(left.entryId);
    //Write to google sheets
    writeToGoogleSheets(left,right)
  }

  function unmatch(row) {
    //Get info
    let info = getLeftRightInfo(row);
    let left = info.left;
    let right = info.right;
    //Get Cross indecies
    let leftInRightIndex = right.value.map(list => list[0]).indexOf(left.rowIndex);
    let rightInLeftIndex = left.value.map(list => list[0]).indexOf(right.rowIndex);
    //Unmatch logic
    left.value.splice(rightInLeftIndex, 1)
    right.value.splice(leftInRightIndex, 1)
    //Write to google sheets
    writeToGoogleSheets(left,right)
  }

  return (
    <div>
      <div style = {{marginLeft:10, marginBottom:10}}>
          <p style = {{color:'red'}}> {!matchingEnabled && leftSpreadsheetId && rightSpreadsheetId? "Matching Disabled. Ensure that each Google sheet has a column named \"MATCH\" and a name column as defined in settings.": ""} </p>
        </div>
      <div>
        <div style = {{width:"100%", padding:5, backgroundColor:'#f7f7f7'}}>
          <span>
            <b>     </b>
            <Button type={'primary'} onClick={() => setSidebarOpen(true)}> Sorts & Filters </Button>
            <b> </b>
            <Button href={route + '/pods'}> See Pods </Button>
            <b> </b>
            <Button href={route + '/settings'}> Settings</Button>
            <b> </b>
            {route.includes("hivesforheroes") ? 
              <Checkbox >Sort Left</Checkbox> : null
            }
          </span>
        </div>
        <div className="Body">
          {/* This is the loading screen */}
          <LoadingOverlay
            active={rightRefreshing || leftRefreshing}
            spinner
            text='Syncing...'
          >
            <div style={{ height: "90vh", width: "100vw" }}>
              {/* Split plane to allow panel resizing */}
              <SplitPane split="vertical" minSize={400} defaultSize={defaultPaneSize} style={{ overflow: 'auto' }}>
                <LeftDataPanel
                  matchingEnabled = {matchingEnabled}
                />
                <RightDataPanel
                  matchingEnabled = {matchingEnabled}
                  match = {match}
                  unmatch = {unmatch}/>
              </SplitPane>
            </div>
          </LoadingOverlay>
        </div>

      </div>
    </div>
  );
}