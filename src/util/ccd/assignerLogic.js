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
    Outputs: List of the externships who weren't assigned students
  */
  return externships.filter(externship => externship.getIsUnmatched());
}

export function getNumberUnmatchedExternships(externships) {
  /*
    Inputs: List of Externship objects
    Outputs: Number of the externships who weren't assigned students
  */
  return (externships.filter(externship => externship.getIsUnmatched())).length;
}

export function getNumberMatchedExternships(externships) {
  /*
    Inputs: List of Externship objects
    Outputs: Number of externships who were assigned students
  */
  return externships.length - getNumberUnmatchedExternships(externships);
}

export function getPercentageMatchedHosts(externships) {
  /*
    Inputs: List of Student objects
    Outputs: Percentage of externships who were matched to students
  */
  return getNumberMatchedExternships(externships)/((externships).length * 100.0);
}

export function getUnmatchedStudents(students) {
  /*
    Inputs: List of Student objects
    Outputs: List of the students who are not matched to an externship
  */
  return students.filter(student => student.assignedExternship == null);
}

export function getNumberUnmatchedStudents(students) {
  /*
    Inputs: List of Student objects
    Outputs: Number of students who are not matched to an externship
  */
  return (students.filter(student => student.assignedExternship == null)).length;
}

export function getPercentageMatchedStudents(students) {
  /*
    Inputs: List of Student objects
    Outputs: Percentage of students who are not matched to an externship
  */
  return getNumberMatchedStudents(students)/((students).length * 100.0);
}

export function getMatchedStudents(students) {
  /*
    Inputs: List of Student objects
    Outputs: List of the students who are already matched to an externship
  */
  return students.filter(student => student.assignedExternship != null);
}

export function getNumberMatchedStudents(students) {
  /*
    Inputs: List of Student objects
    Outputs: Number of students who are already matched to an externship
  */
  return (students.filter(student => student.assignedExternship != null)).length;
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
  return rankTotal / (matchedStudents.length * 1.0);
}

export function getAverageUnmatchedRank(students) {
  /*
    Inputs: List of Student objects 
    Outputs: The average rank of the students in the list who were not matched,
             using each student's ranking within the externship they were matched to.
  */
  var unmatchedStudents = getUnmatchedStudents(students);
  var u;
  var rankTotal = 0
    for (u = 0; u < unmatchedStudents.length; u++) {
        var s;
        var externships = unmatchedStudents[u].applications;
        
        for (s = 0; s < externships.length; s++) {
          var externship = externships[s];
          var student = unmatchedStudents[u];
          var rank = externship.getStudentRank(student);
          rankTotal = rankTotal + rank;
        }
      }
  return rankTotal / (unmatchedStudents.length * 1.0);
}

export function getStats(students, externships){
  /*
    Inputs: List of Student objects and list of Externship objects
    Outputs: An array of statistics in this order: Number of matched students,
              Number of unmatched students, Percentage of matched students, Average 
              rank of matched students, Average rank of unmatched students, Number
              of matched externships, Number of unmatched externships, Percentage
              of matched hosts (externships)

  */
  
  var stats = [];
  stats.push(getNumberMatchedStudents(students));
  stats.push(getNumberUnmatchedStudents(students));
  stats.push(getPercentageMatchedStudents(students));
  stats.push(getAverageMatchedRank(students));
  stats.push(getAverageUnmatchedRank(students));
  stats.push(getNumberMatchedExternships(externships));
  stats.push(getNumberUnmatchedExternships(externships));
  stats.push(getPercentageMatchedHosts(externships));
  
  return stats;
}