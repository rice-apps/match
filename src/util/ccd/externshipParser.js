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
    //externshipName: "externships", handled in code
    jobId: "job_id",
    postingId: "posting_id",
    ranking: "ranking",
    slotCount: "number_of_externs"
};

function extractStudent(row){
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
    if (name !== ""){
        //Get information about the externship
        var jobId = row[columnNames.jobId];
        var postingId = row[columnNames.postingId]
        var slotCount = row[columnNames.slotCount]
        //Create externship object
        externship = new Externship(name,slotCount,[],jobId,postingId)
    }
    return externship;
}

function linkStudentToExternship(studentObject,externshipObject){
    /*  Inputs: studentObject, externshipObject
        Adds student to externship's applicants and externship to student's applications
    */
   externshipObject.applicants.push(studentObject);
   studentObject.applications.push(externshipObject);
}

function mapIfNovel(map,key,value){
    /*  Inputs: map,key,value
        Maps value to key in map if nothing is mapped to key and value is not null
    */
    if (!map[key] && value) {
        map[key] = value;
    }
}

export function getStudentsAndExternships(fileData) {
    /*  Inputs: fileData - a JS object containing CSV data
        Outputs: {
            students: a list of all unique student objects found in fileData
            externships: a list of all unique externship objects found in fileData
        }
    */

    //Create mappings to prevent duplicates
    var studentMap = {}; //email -> studentObject
    var externshipMap = {}; //externshipName -> externshipObject

    //Grow through each row of csv file
    for (var i = 0; i < fileData.data.length; i++) {
        //Read csv row
        var row = fileData.data[i];

        //Handle student
        var studentKey = row[columnNames.email];
        var student = studentMap[studentKey] || extractStudent(row);
        mapIfNovel(studentMap,studentKey,student);

        //Handle externship
        var externshipKey = row['externship'] || row['externships'];
        var externship = externshipMap[externshipKey] || extractExternship(row);
        mapIfNovel(externshipMap,externshipKey,externship);

        //Add applicants to externship & externship to applicant
        if (student && externship){
            linkStudentToExternship(student, externship);
        }
    }

    //Extract values from map
    var studentList = Object.values(studentMap);
    var externshipList = Object.values(externshipMap);
    
    //Return lists in object
    return {students:studentList,externships:externshipList};
}
