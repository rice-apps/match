import {Externship, Student, MockStudents, MockExternships} from "./objects"

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
    // TODO: Zawie implement this functionality
    // Create a list of unique student objects (with no duplicates)
    var studentMap = {};
    var externshipMap = {};
    for (var i = 0; i < fileData.data.length; i++) {
       var row = fileData.data[i];
       //Handle student
       var email = row[columnNames.email];
       var student = null;
       if (email !== "") {
            var first = row[columnNames.first];
            var last = row[columnNames.last];
            studentMap[email] = studentMap[email] ? studentMap[email] : new Student(email,first,last);
            student = studentMap[email];
            student.firstName = student.firstName ? student.firstName : first;
            student.lastName = student.lastName ? student.lastName : last;
       }
       //Handle externship
       var name = row[columnNames.externshipName];
       if (name != ""){
           var jobId = row[columnNames.jobId];
           var postingId = row[columnNames.postingId]
           var slotCount = row[columnNames.slotCount]
           externshipMap[name] = externshipMap[name] ? externshipMap[name]: new Externship(name,slotCount,[],jobId,postingId)
           var externship = externshipMap[name];
           if (student != null){
            externship.applicants.push(student);
            student.applications.push(externship);
           }
       }
    }
    var studentList = Object.values(studentMap);
    var externshipList = Object.values(externshipMap);
    console.log("STUDENTS:",studentList);
    console.log("EXTERNSHIPS:",externshipList);
    return {students:studentList,externships:externshipList};
}