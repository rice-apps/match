import React, { useEffect } from 'react';
import RightDataPanel from '../components/data-panel/RightDataPanel';
import LeftDataPanel from '../components/data-panel/LeftDataPanel';
import SplitPane from 'react-split-pane';
import {loadSalesforceData} from '../util/salesforceInterface';

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
    { data: rightData,
      matchColumn: rightMatchColumn,
      spreadsheetId: rightSpreadsheetId,
      emailColumn: rightEmailColumn,
      refreshing: rightRefreshing,
    }, setRightData] = useRecoilState(rightDataState);
  const [
    { data: leftData,
      selectedRows: selectedLeftRows,
      matchColumn: leftMatchColumn,
      spreadsheetId: leftSpreadsheetId,
      emailColumn: leftEmailColumn,
      refreshing: leftRefreshing,
      shouldSortLeft: shouldSortLeft,
    }, setLeftData] = useRecoilState(leftDataState);

  var windowWidth = window.innerWidth;
  var defaultPaneSize = Math.round(windowWidth / 2);

  //Disable matching variables & function
  var matchingEnabled = rightEmailColumn && leftEmailColumn && leftMatchColumn;
  console.log("matchingEnabled:",rightEmailColumn, leftEmailColumn, leftMatchColumn)

  function setSidebarOpen(open) {
    setAppState({
      ...appState,
      sidebarOpen: open
    });
  }

  // This basically refreshes the data in memory, see where this is used.
  function onLeftSpreadsheetLoaded(response) {
    var values = response.result;
    if (values.length > 0) {
      var newDataState = formatData(values, true);
      // console.log(newDataState)
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

  /**
   * Write a match to the left google sheet
   * @param leftInfo the matching info of the person on left to match (value, rowIndex, columnIndex, entryId)
   */
  function writeToLeftGoogleSheet(leftInfo){
     // Stringify both left and right before writing to Google Sheets
     let leftValueString = JSON.stringify(leftInfo.value);
 
     // Save an empty list [] as a blank cell
     if (leftValueString === "[]") leftValueString = "";
 
     // If the left data is from Google Sheets, write to it
     if (leftSpreadsheetId) {
 
       // Set refreshing to be true
       setLeftData(leftDataState => {
         return {
           ...leftDataState,
           refreshing: true,
         }
       })
       modifySpreadsheetDataSingleCell(leftSpreadsheetId, leftInfo.columnIndex, leftInfo.rowIndex, leftValueString, () => {
         console.log("Done writing to left!");
         // This refreshes the data in this app once the spreadsheet is written to
         getSpreadsheetData(leftSpreadsheetId, onLeftSpreadsheetLoaded);
       });
     }
  }

  /**
   * Get the info about the selected left column that is needed to match/unmatch
   */
  function getSelectedLeftInfo(){
    return {
      value: selectedLeftRows[0][leftMatchColumn.key]? JSON.parse(selectedLeftRows[0][leftMatchColumn.key]) : [],
      rowIndex: parseInt(selectedLeftRows[0].key) + 2,
      columnIndex: leftMatchColumn.index + 1,
      entryId: selectedLeftRows[0][leftEmailColumn.key]
    }
  }

  /**
   * Match a right row to the selected row on the left
   * @param row a right row
   */
  function match(row) {
    //Get info
    let leftInfo = getSelectedLeftInfo(row);
    let rightEmail = row[rightEmailColumn.key];
    //Match logic
    leftInfo.value.push(rightEmail);
    //Write to google sheets
    writeToLeftGoogleSheet(leftInfo)
  }

  /**
   * Unmatch a right row with the selected row on the left
   * @param row the row on the right
   */
  function unmatch(row) {
    //Get info
    let leftInfo = getSelectedLeftInfo(row);
    let rightEmail = row[rightEmailColumn.key];
    //Get Cross indecies
    let rightInLeftIndex = leftInfo.value.indexOf(rightEmail);
    //Unmatch logic
    leftInfo.value.splice(rightInLeftIndex, 1)
    //Write to google sheets
    writeToLeftGoogleSheet(leftInfo)
  }

  /**
   * Finds the email of the person that a right person is matched to (or returns null if none found)
   * @param rightRow the row of the person on the right
   */
  function getRightMatch(rightRow){
    // let rightMatches = rightRow[rightMatchColumn.key];
    let rightMatches = getEachLeftMatchedByRight(rightRow);
    // If right matches is null, just return null.
    if (rightMatches) {
      return rightMatches[0];
    } else {
      return null;
    }
  }

   /**
   * Checks who the person on the right is matched to
   * @param leftRow 
   */
  function getFirstRightMatchedByLeft(leftRow){
    let leftMatches = leftRow[leftMatchColumn.key];
    // If right matches is null, just return null.
    if (leftMatches) {
      return JSON.parse(leftMatches)[0];
    } else {
      return null;
    }
  }

  /**
   * Gets everyone on the right that the left is matched to
   * @param leftRow
   */
  function getEachRightMatchedByLeft(leftRow){
    let leftMatches = leftRow[leftMatchColumn.key];
    // If right matches is null, just return null.
    if (leftMatches) {
      return JSON.parse(leftMatches);
    } else {
      return null;
    }
  }

  /**
   * Gets a list of each of the left emails that are matched to a given person on the right
   * @param rightRow the row on the right to check for matches to
   */
  function getEachLeftMatchedByRight(rightRow) {
    return leftData
    .filter(row => {
      let leftMatch = row[leftMatchColumn.key];
      return leftMatch && rightRow[rightEmailColumn.key] && leftMatch.includes(rightRow[rightEmailColumn.key])
    }).map(row => row[leftEmailColumn.key]);
  }

  /**
   * Checks if two rows are matched to each other
   * @param rightRow the right row
   * @param leftRow the left row
   */
  function rightMatchedToSpecificLeft(rightRow, leftRow) {
    // Read Right Match
    let rightMatches = getEachRightMatchedByLeft(leftRow);
    let rightEmail = rightRow[rightEmailColumn.key];
    return (rightMatches && leftRow) && (rightMatches.includes(rightEmail))
  }

  /**
   * Checks if a person on the right is matched to anyone on the left
   * @param rightRow the row on the right to check
   */
  function rightMatchedToAnyLeft(rightRow){
    let rightMatch = getEachLeftMatchedByRight(rightRow);
    return rightMatch.length > 0;
  }

  function logInSalesforce(){
    console.log("logging into sales force...")
    window.location = '/auth/login';
  }

  function loginBody(){
    return (
       <div className="Body"> 
        <div className="slds-modal slds-fade-in-open">
         <div className="slds-modal__container">
           <div className="slds-box slds-theme--shade">
             <p className="slds-text-heading--medium slds-m-bottom--medium">Welcome, please log in with your Salesforce account:</p>
             <div className="slds-align--absolute-center">
               <button onClick={logInSalesforce} className="slds-button slds-button--brand">
                 <svg aria-hidden="true" className="slds-button__icon--stateful slds-button__icon--left">
                   <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#salesforce1"></use>
                 </svg>
                 Log in
               </button>
            </div>
           </div>
         </div>
       </div>
      </div>
    );
  }

  function dataBody(){
    //Load data if unloaded.
    if ((!leftRefreshing && !rightRefreshing) && (leftData.length  == 0 ||rightData.length == 0)) 
      loadSalesforceData(setLeftData, setRightData);

    //Return visual component.
    return  <div className="Body">
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
              salesforceEnabled = {true}
            />
            <RightDataPanel
              matchingEnabled = {matchingEnabled}
              salesforceEnabled = {true}
              match = {match}
              unmatch = {unmatch}
              getLeftMatch = {getFirstRightMatchedByLeft}
              getRightMatch = {getRightMatch}
              getEachRightMatchedByLeft = {getEachRightMatchedByLeft}
              getEachLeftMatchedByRight = {getEachLeftMatchedByRight}
              rightMatchedToSpecificLeft = {rightMatchedToSpecificLeft}
              rightMatchedToAnyLeft = {rightMatchedToAnyLeft}
              />
          </SplitPane>
        </div>
      </LoadingOverlay>
    </div>
  }

  function checkIfLoggedIn(){
    const that = this;
    fetch('/auth/whoami', {
            method: 'get',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
        console.log("RECEIVED RESPONSE",response);
        if (response.ok) {
          response.json().then(function(json) {
            setAppState(prev => {
              return {...prev, sfUser: json}
            })
          });
        } else if (response.status !== 401) { // Ignore 'unauthorized' responses before logging in
          console.error('Failed to retrieve logged user.', JSON.stringify(response));
        } else {
          console.error('Unauthorized', JSON.stringify(response));
        }
      });
  }

  //Check if logged in on component "mounting".
  useEffect(checkIfLoggedIn, []);

  console.log("APP STATE USER IS:",appState.sfUser);
  return (
    <div>
      <div style = {{marginLeft:10, marginBottom:10}}>
          <p style = {{color:'red'}}> {!matchingEnabled && leftSpreadsheetId && rightSpreadsheetId? "Matching Disabled. Ensure that the left Google sheet has a column named \"MATCH\" and each sheet has a name column as defined in settings.": ""} </p>
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
              <Checkbox style={{ marginLeft: '50px' }} defaultChecked={shouldSortLeft} onChange = {(e) => 
                // Set refreshing to be true
                  setLeftData(leftDataState => {
                  return {
                    ...leftDataState,
                    shouldSortLeft: e.target.checked, // use checkbox status to update state
                  }
                })
              }
              >
              Sort Left By Closest Match</Checkbox> : null
            }
          </span>
        </div>
        {/* BODY */}
        {appState.sfUser == null ? loginBody() : dataBody()}
      </div>
    </div>
  );
}
