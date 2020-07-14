import React from 'react';
import Loader from '../components/loader/Loader';
import {makeAssignments, getUnmatchedStudents} from '../util/ccd/assigner'
import {ceateStudentAndExternshipLists} from '../util/ccd/externshipParser'
import {sortExternships} from '../util/ccd/sorter'
import {exportCSV} from '../util/ccd/csvWriter'
import { useRecoilState } from 'recoil';
import { applicationState } from '../store/atoms';

export default function Assigner() {
  const [appState, setAppState] = useRecoilState(applicationState);

  var windowWidth = window.innerWidth;

  function handleData(fileData) {
    // Handle the data uploaded by the user
    let lists = ceateStudentAndExternshipLists(fileData)
    let students = lists.students
    let externships = lists.externships

    externships = sortExternships(externships)

    let assignments = makeAssignments(externships)
    let unmatchedStudents = getUnmatchedStudents(students)

    console.log(assignments)
    console.log(unmatchedStudents)
    //exportCSV(assignments, unmatchedStudents)
  }

  return (
    <div>
        <div className="Main">
            <div className="Body">
            <Loader 
              onUpload={handleData}
              allowManualSort={true}
              />
            </div>
        </div>
      </div>
  );
}
