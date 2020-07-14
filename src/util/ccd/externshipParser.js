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

export function createStudentList(fileData) {
    // TODO: Zawie implement this functionality
    // Create a list of unique student objects (with no duplicates)
    var studentMap = {};
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
    }
    var studentList = Object.values(studentMap);
    console.log(studentList);
    return MockStudents
}

export function createExternshipList(fileData, students) {
    // TODO: Zawie implement this functionality
    // Note: Make sure that student objects are shared between externships (not duplicated)
    console.log(fileData)
    return MockExternships
}