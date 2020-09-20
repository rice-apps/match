export function exportCSV(assignments) {
    //Exports list of Externship objects with matched students and list of unmatched students into a CSV file
    //Input: assignments - list of Externship objects, unmatchedStudents - list of Student objects
    //Output: CSV file
        //example output:   externship1, student1
        //                  externship1, student2
        //                  externship2, student3
        //                  unmatched, student4

    const rows = [["Externshp", "Student", "Email", "Ranking", ]];

    //create [externshipName, studentName] rows 
    var i;
    for (i = 0; i < assignments.length; i++) {
        var externship = assignments[i];
        var s;
        for (s = 0; s < externship.matched.length; s++) {
            var student = externship.matched[s];
            rows.push([externship.companyName, student.getFullName(), student.getEmail(), externship.getStudentRank(student)]);
        }
    }

    // //add [unmatched, studentName] rows
    // var u;
    // for (u = 0; u < unmatchedStudents.length; u++) {
    //     rows.push(["Unmatched", unmatchedStudents[u].getFullName()]);
    // }

    return rows;
}

export function exportExternshipsCSV(unmatchedExternships) {
    //Exports list of Externship objects with matched students and list of unmatched students into a CSV file
    //Input: assignments - list of Externship objects, unmatchedStudents - list of Student objects
    //Output: CSV file
        //example output:   externship1, student1
        //                  externship1, student2
        //                  externship2, student3
        //                  unmatched, student4

    const rows = [["Unmatched Externships"]];

    //create [externshipName, ] rows 
    var u;
    for (u = 0; u < unmatchedExternships.length; u++) {
        rows.push([unmatchedExternships[u].getCompanyName()]);
    }

    return rows;
}

export function exportUnmatchedStudentsCSV(unmatchedStudents) {    

    const rows = [["Student", "Externship", "Email", "Ranking", "Class", "Major",]];

    //add [unmatched, studentName] rows
    var u;
    for (u = 0; u < unmatchedStudents.length; u++) {
        var s;
        var externships = unmatchedStudents[u].applications;
        
        for (s = 0; s < externships.length; s++) {
            var externship = externships[s];
            var student = unmatchedStudents[u];
            rows.push([student.getFullName(), externship.companyName, student.getEmail(), externship.getStudentRank(student)]);
        }
        
    }

    return rows;
}
