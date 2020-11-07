import {Externship, Student} from "./objects"

/*  columnNames:
        A dictionaring mapping key variables to column names
        This is useful for when/if the CCD changes the column headers.
        The key represent the variable the code access while the value
        represents the column name (all lower case, spaces replaced with '_')
*/
var columnNames = {
    email: "applicant_email",
    first: "applicant_first",
    last: "applicant_last",
    externshipName: "externship",
    jobId: "job_id",
    postingId: "posting_id",
    ranking: "ranking",
    slotCount: "number_of_externs"
};

function extractStudent(row) {
    /*  Inputs: a CSV row (array)
        Outputs: a student object (if represented in row) or null
    */
    var email = row[columnNames.email];
    var student = null;
    if (email !== "") {
         //Get information about student
         var first = row[columnNames.first];
         var last = row[columnNames.last];
         //Create student object
         student = new Student(email,first,last);
    }
    return student
}

function extractExternship(row) {
    /*  Inputs: a CSV row (array)
        Outputs: an externship object (if represented in row) or null
    */
    var name = row['externship'] || row['externships'];
    var externship = null;
    if (name !== "") {
        //Get information about the externship
        var jobId = row[columnNames.jobId];
        var postingId = row[columnNames.postingId];
        var slotCount = row[columnNames.slotCount];
        //Create externship object
        externship = new Externship(name,slotCount,[],jobId,postingId);
    }
    return externship;
}

function linkStudentToExternship(studentObject,externshipObject) {
    /*  Inputs: studentObject, externshipObject
        Adds student to externship's applicants and externship to student's applications
    */
   externshipObject.applicants.push(studentObject);
   studentObject.applications.push(externshipObject);
}

export function getStudentsAndExternships(data) {
    /*  Inputs: fileData - a JS object containing CSV data
        Outputs: {
            students: a list of all unique student objects found in fileData
            externships: a list of all unique externship objects found in fileData
        }
    */

    // Sort Data To Put Applicants in Increasing Order Of Ranking
    data = data.slice().sort((row1, row2) => {
        // First by externship name
        let extern1 = row1[columnNames.externshipName];
        let extern2 = row2[columnNames.externshipName];
        if (extern1 != extern2) {
            return extern1 > extern2 ? 1 : -1;
        }
        // Next by rank
        let rank1 = parseInt(row1[columnNames.ranking]);
        let rank2 = parseInt(row2[columnNames.ranking]);
        return rank1 - rank2;
    })

    //Create mappings to prevent duplicates
    var studentMap = {}; //email -> studentObject
    var externshipMap = {}; //externshipName -> externshipObject

    //Grow through each row of csv file
    for (var i = 0; i < data.length; i++) {
        //Read csv row
        var row = data[i];

        //Handle student
        var studentKey = row[columnNames.email];
        var student = studentMap[studentKey] || extractStudent(row);
        //Map if novel
        if (!studentMap[studentKey] && student) studentMap[studentKey] = student;

        //Handle externship
        var externshipKey = row['externship'] || row['externships'];
        var externship = externshipMap[externshipKey] || extractExternship(row);
        //Map if novel
        if (!externshipMap[externshipKey] && externship) externshipMap[externshipKey] = externship;

        //Add applicants to externship & externship to applicant
        if (student && externship) linkStudentToExternship(student, externship);
    }

    //Extract values from map
    var studentList = Object.values(studentMap);
    var externshipList = Object.values(externshipMap);
    
    //Return lists in object
    return {students:studentList,externships:externshipList};
}

export function getColumnNames(){
    return Object.values(columnNames);
}