export function makeAssignments(externships) {
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

export function getUnmatchedStudents(students) {
  // Find unmatched students
  return students.filter(student => student.assignedExternship == null);
}

export function getMatchedStudents(students) {
  // Find matched students
  return students.filter(student => student.assignedExternship != null);
}

export function getAverageMatchedRank(students, externships) {
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
