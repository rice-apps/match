export function makeAssignments(externships) {
    let matchWasMade = true;
    while (matchWasMade) {
      matchWasMade = false;
      externships.forEach(externship => {
        if (externship.hasSpace()) {
          let studentMatch = externship.getHighestUnmatched()
          if (studentMatch != null) {
            externship.match(studentMatch)
            matchWasMade = true;
          }
        }
      })
    }
    return externships
}

export function getUnmatchedStudents(students) {
    // Find unmatched students
    return students.filter(student => student.assignedExternship == null)
}
