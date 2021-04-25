import React, { useEffect } from 'react';
import RightDataPanel from '../components/data-panel/RightDataPanel';
import LeftDataPanel from '../components/data-panel/LeftDataPanel';
import SplitPane from 'react-split-pane';
import {loadSalesforceData, postUnmatch, postMatch} from '../util/salesforceInterface';

import {Button, Checkbox, Card } from 'antd';

import { useRecoilState } from 'recoil';
import { rightDataState, leftDataState, applicationState } from '../store/atoms';

import LoadingOverlay from 'react-loading-overlay';
import { useLocation } from 'react-router-dom'

export default function Matcher() {
  const route = useLocation().pathname;

  const [appState, setAppState] = useRecoilState(applicationState);
  const [
    { data: rightData,
      idColumn: rightIdColumn,
      matchColumn: rightMatchColumn,
      nameColumn: rightNameColumn,
      spreadsheetId: rightSpreadsheetId,
      emailColumn: rightEmailColumn,
      refreshing: rightRefreshing,
    }, setRightData] = useRecoilState(rightDataState);
  const [
    { data: leftData,
      selectedRows: selectedLeftRows,
      matchColumn: leftMatchColumn,
      nameColumn: leftNameColumn,
      idColumn: leftIdColumn,
      spreadsheetId: leftSpreadsheetId,
      emailColumn: leftEmailColumn,
      refreshing: leftRefreshing,
      shouldSortLeft: shouldSortLeft,
    }, setLeftData] = useRecoilState(leftDataState);

  var windowWidth = window.innerWidth;
  var defaultPaneSize = Math.round(windowWidth / 2);

  //Disable matching variables & function
  var matchingEnabled = rightIdColumn && leftIdColumn && leftMatchColumn;

  function setSidebarOpen(open) {
    setAppState({
      ...appState,
      sidebarOpen: open
    });
  }
  /**
   * Get the info about the selected left column that is needed to match/unmatch
   */
  function getSelectedLeftInfo(){
    return {
      value: selectedLeftRows[0][leftMatchColumn.key]? [selectedLeftRows[0][leftMatchColumn.key]] : [],
      rowIndex: parseInt(selectedLeftRows[0].key) + 2,
      columnIndex: leftMatchColumn.index + 1,
      entryId: selectedLeftRows[0][leftIdColumn.key]
    }
  }

  /**
   * Match a right row to the selected row on the left
   * @param row a right row
   */
  function match(row) {
    const leftInfo = getSelectedLeftInfo(row);
    const mentorId = row[rightIdColumn.key];
    const newbeeId = leftInfo.entryId;
    postMatch(newbeeId, mentorId, setLeftData, setRightData);
  }

  /**
   * Unmatch a right row with the selected row on the left
   * @param row the row on the right
   */
  function unmatch(row) {
    const leftInfo = getSelectedLeftInfo(row);
    const mentorId = row[rightIdColumn.key];
    const newbeeId = leftInfo.entryId;
    postUnmatch(newbeeId, mentorId, setLeftData, setRightData);
  }

  /**
   * Finds the email of the person that a right person is matched to (or returns null if none found)
   * @param rightRow the row of the person on the right
   */
  function getRightMatch(rightRow){
    // let rightMatches = rightRow[rightMatchColumn.key];
    let rightMatches = getEachLeftMatchedByRight(rightRow);
    // If right matches is null, just return null.
    if (rightMatches)
      return rightMatches[0];
    return null;
  }

   /**
   * Checks who the person on the right is matched to
   * @param leftRow
   */
  function getFirstRightMatchedByLeft(leftRow){
    let leftMatches = leftRow[leftMatchColumn.key];
    // If right matches is null, just return null.
    if (leftMatches)
      return JSON.parse(leftMatches)[0];
    return null;
  }

  /**
   * Gets everyone on the right that the left is matched to
   * @param leftRow
   */
  function getEachRightMatchedByLeft(leftRow){
    let leftMatches = leftRow[leftMatchColumn.key];
    // If right matches is null, just return null.
    if (leftMatches)
      return [leftMatches];
    return null;
  }

  /**
   * Gets a list of each of the left emails that are matched to a given person on the right
   * @param rightRow the row on the right to check for matches to
   */
  function getEachLeftMatchedByRight(rightRow) {
    return leftData
    .filter(row => {
      let leftMatch = row[leftMatchColumn.key];
      return leftMatch &&
             rightRow[rightIdColumn.key] &&
             leftMatch.includes(rightRow[rightIdColumn.key]);
    }).map(row => row[leftIdColumn.key]);
  }

  /**
   * Checks if two rows are matched to each other
   * @param rightRow the right row
   * @param leftRow the left row
   */
  function rightMatchedToSpecificLeft(rightRow, leftRow) {
    // Read Right Match
    let rightMatches = getEachRightMatchedByLeft(leftRow);
    let rightId = rightRow[rightIdColumn.key];
    return (rightMatches && leftRow) && (rightMatches.includes(rightId))
  }

  /**
   * Checks if a person on the right is matched to anyone on the left
   * @param rightRow the row on the right to check
   */
  function rightMatchedToAnyLeft(rightRow) {
    let rightMatch = getEachLeftMatchedByRight(rightRow);
    return rightMatch.length > 0;
  }

  /**
   * Convert a salesforce ID to a full name
   * salesforceID: a string representing a contact's salesforce ID
   * newbeeOrMentor: either "newbee" or "mentor"
   */
  function salesforceIDToName(salesforceID, newbeeOrMentor) {
    let data = leftData;
    if (newbeeOrMentor === "newbee") {
      return leftData
      .filter( // Find person with matching salesforceID
        row => row[leftIdColumn.key] === salesforceID
      ).map( // Convert ID to name
        row => row[leftNameColumn.key]
      )[0];
    } else {
      return rightData
      .filter( // Find person with matching salesforceID
        row => row[rightIdColumn.key] === salesforceID
      ).map( // Convert ID to name
        row => row[rightNameColumn.key]
      )[0];
    }
  }

  function logInSalesforce(){
    console.log("logging into sales force...");
    window.location = '/auth/login';
  }

  function loginBody(){
    return (<div style={{display:"flex", "justify-content":"center"}}>
        <Card title={"Salesforce Authentication"} className="AboutCard">
           <Button type={'primary'} block={true} shape={'round'} onClick={logInSalesforce}> Login to Salesforce </Button>
          </Card>
    </div>);
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
              salesforceIDToName = {salesforceIDToName}
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
    fetch('/auth/whoami', {
            method: 'get',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function(response) {
        //console.log("RECEIVED RESPONSE",response);
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

  //console.log("APP STATE USER IS:",appState.sfUser);
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
