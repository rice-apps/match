import React, { useState } from 'react';
import Loader from '../components/loader/Loader';
import { makeAssignments, getUnmatchedStudents } from '../util/ccd/assignerLogic'
import { getStudentsAndExternships } from '../util/ccd/externshipParser'
import { exportCSV } from '../util/ccd/csvWriter'
import { CSVLink } from 'react-csv';

export default function Assigner() {
  const [csvData, setCsvData] = useState([]);

  function handleData(fileData) {
    if (fileData && fileData.data){
      // Handle the data uploaded by the user
      let data = getStudentsAndExternships(fileData);
      let students = data.students;
      let externships = data.externships;

      //Sort externships based on priority
      externships.sort((a, b) => a.getPriority() - b.getPriority());

      //Match students
      let assignments = makeAssignments(externships);
      let unmatchedStudents = getUnmatchedStudents(students);

      // Statistic Calls
      // console.log("Matched Student Count:", getMatchedStudents(students).length);
      // console.log("Unmatched Student Count:", unmatchedStudents.length);
      // console.log("Average Matched Rank:", getAverageMatchedRank(students));

      setCsvData(
        exportCSV(assignments, unmatchedStudents)
      );
    }
  }

  return (
    <div>
      <div className="Main">
        <div className="Body">
          <Loader
            onUpload={handleData}
            allowManualSort={true}
            allowCSV={true}
          />
          {/* CSV Downloader */}
          <CSVLink data={csvData} filename={"ListOfMatches.csv"} >Download CSV</CSVLink>
        </div>
      </div>
    </div>
  );
}
