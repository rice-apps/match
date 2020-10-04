import { } from "../../util/gapi.js"

export function exportCSV(assignments) {
    //Exports list of Externship objects with matched students and list of unmatched students into a CSV file
    //Input: assignments - list of Externship objects, unmatchedStudents - list of Student objects
    //Output: CSV file
        //example output:   externship1, student1
        //                  externship1, student2
        //                  externship2, student3
        //                  unmatched, student4

    const rows = [["Externship", "Student", "Email", "Ranking", "Class", "Major",]];

    //create [externshipName, studentName] rows 
    var i;
    for (i = 0; i < assignments.length; i++) {
        var externship = assignments[i];
        var s;
        for (s = 0; s < externship.matched.length; s++) {
            var student = externship.matched[s];
            rows.push([externship.companyName, student.getFullName(), student.getEmail(), 
                externship.getStudentRank(student), student.getYear(), student.getMajor()]);
        }
    }

    //FUNCTIONALITY MOVED TO exportUnmatchedStudents()!
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
            rows.push([student.getFullName(), externship.companyName, student.getEmail(), 
                externship.getStudentRank(student), student.getYear(), student.getMajor()]);
        }
        
    }

    return rows;
}

export function exportStatsCSV(stats) {  
    //Exports a list of the desired statistics in order: number of matched students,
    //number of unmatched students, percentage of matched students, average 
    //rank of matched students, average rank of unmatched students, number
    //of matched externships, number of unmatched externships, percentage
    //of matched hosts (externships)
    //Imports a list of the stats from Assigner.js
    //Outputs a CSV file

    var rows = []
    rows.push(["Number of matched students", stats[0].toString()]);
    rows.push(["Number of unmatched students", stats[1].toString()]);
    rows.push(["Percentage of matched students", stats[2].toString()]);
    rows.push(["Average rank of matched students", stats[3].toString()]);
    rows.push(["Average rank of unmatched students", stats[4].toString()]);
    rows.push(["Number of matched externships", stats[5].toString()]);
    rows.push(["Number of unmatched externships", stats[6].toString()]);
    rows.push(["Percentage of matched hosts", stats[7].toString()]);
    
    console.log(rows);
    return rows;
}
