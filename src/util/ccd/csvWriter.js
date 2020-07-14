
export function exportCSV(assignments, unmatchedStudents) {
    // TODO: Anna implement functionality

    //Exports list of Externship objects with matched students and list of unmatched students into a CSV file
    //Input: assignments - list of Externship objects, unmatchedStudents - list of Student objects
    //Output: CSV file
        //example output:   externship1, student1
        //                  externship1, student2
        //                  externship2, student3
        //                  unmatched, student4

    const { write } = require('@fast-csv/format');

    const rows = [];

    //create [externshipName, studentName] rows 
    var i;
    for (i = 0; i < assignments.length; i++) {
        var externship = assignments[i];
        var s;
        for (s = 0; s < externship.matched.length; s++) {
            var student = externship.matched[s];
            rows.push([externship.companyName, student]);
        }
    }

    //add [unmatched, studentName] rows
    var u;
    for (u = 0; u < unmatchedStudents.length; u++) {
        rows.push(["unmatched", unmatchedStudents[u].getFullName()])
    }

    write(rows).pipe(process.stdout);
}

