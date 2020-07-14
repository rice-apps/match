import {Externship, Student} from "./objects"

/* 
columnNames:
    A dictionaring mapping key variables to column names
    This is useful for when/if the CCD changes the column headers.
    The key represent the variable the code access while the value
        represents the column name (all lower case, spaces replaced with '_')
*/
var columnNames = {
    email: "applicant_email",
    first: "applicant_first",
    last: "applicant_last",
    externshipName: "externships",
    jobId: "job_id",
    postingId: "posting_id",
    ranking: "ranking",
    slotCount: "number_of_externs"
};

export function ceateStudentAndExternshipLists(fileData) {
    /*
        Inputs: fileData - a JS object containing CSV data
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
       var row = fileData.data[i];
       //Handle student
       var email = row[columnNames.email];
       var student = null;
       if (email !== "") {
            //Get information about student
            var first = row[columnNames.first];
            var last = row[columnNames.last];
            //Create students, if not already existing
            studentMap[email] = studentMap[email] ? studentMap[email] : new Student(email,first,last);
            student = studentMap[email];
            //Update name, if not existing
            student.firstName = student.firstName ? student.firstName : first;
            student.lastName = student.lastName ? student.lastName : last;
       }
       //Handle externship
       var name = row[columnNames.externshipName];
       if (name != ""){
           //Get information about the externship
           var jobId = row[columnNames.jobId];
           var postingId = row[columnNames.postingId]
           var slotCount = row[columnNames.slotCount]
           //Create externship, if not already created
           externshipMap[name] = externshipMap[name] ? externshipMap[name]: new Externship(name,slotCount,[],jobId,postingId)
           var externship = externshipMap[name];
           //Add applicants to externship & externship to applicant
           if (student != null){
            externship.applicants.push(student);
            student.applications.push(externship);
           }
       }
    }
    //Extract values from map
    var studentList = Object.values(studentMap);
    var externshipList = Object.values(externshipMap);
    //Return lists in object
    return {students:studentList,externships:externshipList};
}