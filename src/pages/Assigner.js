import React, { useState } from 'react';
import Loader from '../components/loader/CSVFileLoader';
import { makeAssignments, getUnmatchedStudents, getUnmatchedExternships, getStats } from '../util/ccd/assignerLogic'
import { getStudentsAndExternships } from '../util/ccd/externshipParser'
import { exportCSV, exportExternshipsCSV, exportUnmatchedStudentsCSV, exportStatsCSV } from '../util/ccd/csvWriter'
import { CSVLink } from 'react-csv';
import SheetsLoader from '../components/loader/SheetsLoader';
import CSVFileLoader from '../components/loader/CSVFileLoader';

import { useRecoilState } from 'recoil';
import { ccdState } from '../store/atoms';

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
      assignments:makeAssignments(externships),
      unmatchedStudents:getUnmatchedStudents(students),
      unmatchedExternships:getUnmatchedExternships(externships),
      stats:getStats(students, externships)
    }
    return outputData;
  }
}

/**
 * Take in rowData and column headers and validate the data.
 * -Ensure it has all the necessary columns (see externshipParser)
 * -Ensure there's nothing else whack about it
 * (You may not need both parameters, so feel free to change inputs)
 * 
 * @param rowData An array of row objects
 * @param columns An array of column headers
 * @return {isValid: (boolean) whether or not the data is good to go, m
 *          essage: (string) what's wrong with the data, null otherwise}
 */ 
function validate(rowData,columns){
  //TODO: Implement
  if(false){
    return {
      isValid:true,
      message:null
    };
  } else {
    return {
      isValid:false,
      message:"Data is WHACK my dude."
    };
  }
}


export default function Assigner() {
  const [{ data, columns, isRefreshing}, setDataState] = useRecoilState(ccdState);

  const [csvData, setCsvData] = useState([]);
  const [csvExternshipData, setCsvExternshipData] = useState([]);
  const [csvStudentData, setCsvStudentData] = useState([]);
  const [csvStats, setCsvStats] = useState([]);

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
    return null;
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
      let validationResult = validate(data,columns);
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
    return(<p>Loading</p>)
  }

  /**
   * This will be rendered when there is no data
   * @return a react component
   */
  function getUploaderComponent(){
      //Return a data uploader
      //TODO: make it prettier and probs add more info
      return (<div>
        <SheetsLoader onUpload={setDataState}/>
      </div>);
  }

  /**
   * This should return a good to go card
   * @return a react component
   */
  function getGoodComponent(){
    //TODO: Make it be like "yo data is legit", green check more, and add assignmentRequst button. 
    //TODO: Also maybe preview data? like name of file or something
    return(<div>
      <p> ur data is good</p>            
      <p> you uploaded spreadsheet x</p>
      <button onClick={onAssignmentRequest}> bOIIIIII GET THAT DATA MATCHED </button>
    </div>);
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
      return <div>It's not valid, idiot: {invalidReason}</div>
  }

  //The final compnent
  return (
    <div className="Main">
      <div className="Body">
        <div> {/* Add instructions here */}
          Instructions!
        </div>
        {getStatusComponent()}   
      </div>
    </div>
  );
}
