export function makeAssignments(externships) {
  let matchWasMade = true;
  while (matchWasMade) {
    matchWasMade = false;
    var i;
    for (i in externships) {
      if (externships[i].hasSpace()) {
        let studentMatch = externships[i].getHighestUnmatched()
        if (studentMatch != null) {
          externships[i].match(studentMatch)
          matchWasMade = true;
        }
      }
    }
  }
  return externships
}

export function getUnmatchedStudents(students) {
    // Find unmatched students
    return students.filter(student => student.assignedExternship == null)
}
