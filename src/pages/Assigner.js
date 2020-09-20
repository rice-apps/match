import React, { useState } from 'react';
import Loader from '../components/loader/CSVFileLoader';
import { makeAssignments, getUnmatchedStudents, getUnmatchedExternships } from '../util/ccd/assignerLogic'
import { getStudentsAndExternships } from '../util/ccd/externshipParser'
import { exportCSV, exportExternshipsCSV, exportUnmatchedStudentsCSV } from '../util/ccd/csvWriter'
import { CSVLink } from 'react-csv';
import CSVFileUploader from '../components/loader/CSVFileLoader';

export default function Assigner() {
  const [csvData, setCsvData] = useState([]);
  const [csvExternshipData, setCsvExternshipData] = useState([]);
  const [csvStudentData, setCsvStudentData] = useState([]);

  function handleData(fileData) {
    if (fileData && fileData.data){
      // Handle the data uploaded by the user
      let data = getStudentsAndExternships(fileData);
      let students = data.students;
      let externships = data.externships;

      //Sort externships based on priority
      externships.sort((a, b) => a.getPriority() - b.getPriority());

      //Matched students
      let assignments = makeAssignments(externships);

      //Finds unmatched students
      let unmatchedStudents = getUnmatchedStudents(students);

      //Finds unmatched externships
      let unmatchedExternships = getUnmatchedExternships(externships);

      // Statistic Calls
      // console.log("Matched Student Count:", getMatchedStudents(students).length);
      // console.log("Unmatched Student Count:", unmatchedStudents.length);
      // console.log("Average Matched Rank:", getAverageMatchedRank(students));

      setCsvData(
        exportCSV(assignments)
      );
      setCsvExternshipData(
        exportExternshipsCSV(unmatchedExternships)
      );
      setCsvStudentData(
        exportUnmatchedStudentsCSV(unmatchedStudents)
      );
    }
  }

  return (
    <div>
      <div className="Main">
        <div className="Body">
          <CSVFileUploader
            onUpload={handleData}
            allowManualSort={true}
            allowCSV={true}
          />
          {/* CSV Downloader */}
          <CSVLink data={csvData} filename={"ListOfMatches.csv"} >Download CSV</CSVLink>
          <CSVLink data={csvExternshipData} filename={"ListOfUnmatchedExternships.csv"} >Download externship CSV</CSVLink>
          <CSVLink data={csvStudentData} filename={"ListOfUnmatchedStudents.csv"} >Download students CSV</CSVLink>
        </div>
      </div>
    </div>
  );
}
