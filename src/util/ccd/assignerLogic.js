export function makeAssignments(externships) {
  /*
    Inputs: List of Externship objects
    Outputs: Returns the list of externships with the student assignments made.
             Also modifies the input list.
  */
  let matchWasMade = true;
  while (matchWasMade) {
    matchWasMade = false;
    var i;
    for (i in externships) {
      if (externships[i].hasSpace()) {
        let studentMatch = externships[i].getHighestUnmatched()
        if (studentMatch != null) {
          externships[i].match(studentMatch);
          matchWasMade = true;
        }
      }
    }
  }
  return externships;
}

export function getUnmatchedExternships(externships) {
  /*
    Inputs: List of Externship objects
    Outputs: List of the externship who weren't assigned students
  */
  return externships.filter(externship => externship.getIsUnmatched());
}

export function getUnmatchedStudents(students) {
  /*
    Inputs: List of Student objects
    Outputs: List of the students who are not matched to an externship
  */
  return students.filter(student => student.assignedExternship == null);
}

export function getMatchedStudents(students) {
  /*
    Inputs: List of Student objects
    Outputs: List of the students who are already matched to an externship
  */
  return students.filter(student => student.assignedExternship != null);
}


export function getAverageMatchedRank(students) {
  /*
    Inputs: List of Student objects 
    Outputs: The average rank of the students in the list who were matched,
             using each student's ranking within the externship they were matched to.
  */
  var matchedStudents = getMatchedStudents(students);
  var i;
  var rankTotal = 0;
  for (i in matchedStudents) {
    var student = matchedStudents[i];
    var rank = student.assignedExternship.getStudentRank(student);
    rankTotal += rank;
  }
  return rankTotal / matchedStudents.length;
}
