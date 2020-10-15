import React, { useState } from 'react';
import Loader from '../components/loader/CSVFileLoader';
import { makeAssignments, getUnmatchedStudents, getUnmatchedExternships, getStats } from '../util/ccd/assignerLogic'
import { getStudentsAndExternships, getColumnNames } from '../util/ccd/externshipParser'
import { exportCSV, exportExternshipsCSV, exportUnmatchedStudentsCSV, exportStatsCSV } from '../util/ccd/csvWriter'
import { writeToTab } from '../util/ccd/sheetsWriter'
import { CSVLink } from 'react-csv';
import SheetsLoader from '../components/loader/SheetsLoader';
import CSVFileLoader from '../components/loader/CSVFileLoader';

import { useRecoilState } from 'recoil';
import { ccdState } from '../store/atoms';

import { Card, Button } from 'antd';

const cardStyle = {margin:15}

/**
 * This actually creates the assignments, creates a list of unmatched/matched students, and calcualtes the stats.
 * In essence, this is the logic handling.
 * 
 * @param rowData An array of row objects.
 * @return an object containing all the the output data
 */
function processData(rowData) {
  if (rowData){
    // Handle the data uploaded by the user
    let things = getStudentsAndExternships(rowData);
    let students = things.students;
    let externships = things.externships;
    //Sort externships based on priority
    externships.sort((a, b) => a.getPriority() - b.getPriority());
    //Create output data
    let outputData = {
      assignments:exportCSV(makeAssignments(externships)),
      unmatchedStudents:exportUnmatchedStudentsCSV(getUnmatchedStudents(students)),
      unmatchedExternships:exportExternshipsCSV(getUnmatchedExternships(externships)),
      stats:exportStatsCSV(getStats(students, externships))
    }
    return outputData;
  }
}

function writeData(id,outputData){
  const time = new Date().toString()
  writeToTab(id,"Results "+time,outputData.assignments)
  writeToTab(id,"Unmatched Students "+time,outputData.unmatchedStudents)
  writeToTab(id,"Unmatched Externships "+time,outputData.unmatchedExternships)
  writeToTab(id,"Statistics "+time,outputData.stats)
}

/**
 * Take in rowData and column headers and validate the data.
 * -Ensure it has all the necessary columns (see externshipParser)
 * -Ensure there's nothing else whack about it
 * (You may not need both parameters, so feel free to change inputs)
 * 
 * @param columns An array of column headers
 * @return {isValid: (boolean) whether or not the data is good to go, m
 *          essage: (string) what's wrong with the data, null otherwise}
 */ 
function validate(columns){
  //TODO: Implement
  var missingColumns = [];
  const neededCols = getColumnNames()
  for(const i in neededCols){
    var has = false;
    for(const j in columns){
      var col = columns[j]
      if(col.key == neededCols[i]) {
        has = true
      }
    }
    if(!has){
      var strNeed = neededCols[i];
      strNeed = strNeed.replace(/_/g, ' ');
      strNeed = strNeed.toUpperCase(strNeed);
      missingColumns.push(strNeed);
    }
  }

  if (missingColumns.length === 0){
    return {
    isValid:true,
    message:null
    }
  } else {
    // not sure why building it one by one isnt working  

    var colsMissing = "";
    for (var i = 0; i < missingColumns.length; i++){
      colsMissing += missingColumns[i];
      if (i < missingColumns.length-1) colsMissing+=", "
    }
    
    return {
      isValid:false,
      message:<p>The sheet is missing columns: <b>{colsMissing}</b></p>
    }; 
  }
  
}


export default function Assigner() {
  const [{ data, columns, isRefreshing, spreadsheetId}, setDataState] = useRecoilState(ccdState);
  /**
   * This function is called when the "match"/"assign" button is pressed.
   * 
   * It should do the following:
   * - Double check the data is indeed validated
   * - Process the data (call handleData)
   * - Create new sheets on the Google sheet
   * - Route the user to the sheet after it is done
   * 
   * @params N/A
   * @return N/A
   */
  function onAssignmentRequest(){
    //TODO: Implement
    //Use data/columns from useRecoilState call
    //processData(data) //?maybe? stuff like this

    const validationObj = validate(columns)
    
    // if data is not valid, return message
    if(!validationObj.isValid){
      alert("Oops! Something went wrong :( \n" + validationObj.message)
    } else {
      //Make the match
      const outputData = processData(data)
      writeData(spreadsheetId, outputData)
      alert("Matched!\nThe output files have been added to your sheet :)")
      //route to google sheet
    }
    return;
  }

  /**
   * This essentially return the appropriate component based on the status
   * of the data
   * 
   * @params N/A
   * @return a component that should be displayed on the page
   */
  function getStatusComponent(){
    if(isRefreshing){ //DATA IS REFESHING
      //TODO: Return some activity activity indicator/description
      return(getLoadingComponent())
    } else if (data.length == 0){ //DATA DOESN'T EXIST
      return(getUploaderComponent())
    } else { //YO THE DATA EXISTS
      let validationResult = validate(columns);
      if(validationResult.isValid){
        return(getGoodComponent());
      } else {
        return(getBadComponent(validationResult.message));
      }
    }
  }

   /**
   * This will be rendered when the data is loading (refreshing = true)
   * @return a react component
   */
  function getLoadingComponent(){
    //TODO: Return some activity activity indicator/description
    return(<p>Loading...</p>)
  }

  /**
   * This will be rendered when there is no data
   * @return a react component
   */
  function getUploaderComponent(){
      //Return a data uploader
      //TODO: make it prettier and probs add more info
      return (<div>
        <Card title = "Upload Data" style={cardStyle}>
          <p> To upload data, copy and paste the URL of the externship/student data into the box below. Ensure you are logged into the appropriate Google account.</p>
          <SheetsLoader onUpload={setDataState}/>
        </Card>
      </div>);
  }

  /**
   * This should return a good to go card
   * @return a react component
   */
  function getGoodComponent(){
    //TODO: Make it be like "yo data is legit", green check more, and add assignmentRequst button. 
    //TODO: Also maybe preview data? like name of file or something
    return(<Card title = "Ready to Match!" style = {cardStyle}>
      <p> Your data has been validated, and we are ready to make matches.</p>            
      <p> When you press the button below, the four output files will be added to the spreadsheet in four seperate tabs.</p>
      <Button type = "primary" shape="round" onClick={onAssignmentRequest}> Match </Button>
    </Card>);
  }

  /** 
   * This should return an appropriate "invalid" card
   * 
   * @param invalidReason, (string) the reason why its not valid
   * @return a React component
   */
  function getBadComponent(invalidReason){
      //TODO: phat red x, and state why its wrong
      //TODO: probably add link to sheet
      //TODO: maybe add refresh button if its necessary
      return <Card title = "Data Invalid!" style = {cardStyle}>
        <p> Unfortunately your Google sheet data cannot be processed because something is wrong with your data. {invalidReason} </p>
        <p> Please modify the sheet accordingly and reupload it.</p>
        <SheetsLoader onUpload={setDataState}/>
      </Card>
  }

  //The final component
  return (
    <div className="Main">
        {getStatusComponent()}   
    </div>
  );
}
