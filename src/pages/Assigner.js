import React, { useState } from 'react';
import Loader from '../components/loader/Loader';
import {makeAssignments, getUnmatchedStudents, getAverageMatchedRank, getMatchedStudents} from '../util/ccd/assigner'
import {ceateStudentAndExternshipLists} from '../util/ccd/externshipParser'
import {sortExternships} from '../util/ccd/sorter'
import {exportCSV} from '../util/ccd/csvWriter'
import { useRecoilState } from 'recoil';
import { applicationState } from '../store/atoms';
import {CSVLink, CSVDownload} from 'react-csv';

export default function Assigner() {
  const [appState, setAppState] = useRecoilState(applicationState);
  const [csvData, setCsvData] = useState([]);

  var windowWidth = window.innerWidth;

  function handleData(fileData) {
    // Handle the data uploaded by the user
    let lists = ceateStudentAndExternshipLists(fileData)
    let students = lists.students
    let externships = lists.externships

    // Uncomment when sorter is fixed
    // externships = sortExternships(externships)

    console.log("Externships", externships)

    let assignments = makeAssignments(externships)
    let unmatchedStudents = getUnmatchedStudents(students)

    console.log("Matched Student Count:", getMatchedStudents(students).length)
    console.log("Unmatched Student Count:", unmatchedStudents.length)
    console.log("Average Matched Rank:", getAverageMatchedRank(students, externships))

    setCsvData(
      exportCSV(assignments, unmatchedStudents)
    );
    
  }

  return (
    <div>
        <div className="Main">
            <div className="Body">
            <Loader 
              onUpload={handleData}
              allowManualSort={true}
              />
            
            {/* CSV Downloader */}
            <CSVLink data= {csvData} filename={"ListOfMatches.csv"} >Download CSV</CSVLink>  
            </div>
        </div>
      </div>
  );
}
