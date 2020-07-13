export{Externship,Student,MockStudents,MockExternships}
/*
  IMPORT INSTRUCTIONS:
  To import anything from here simple put
  "import {Externship, Student, MockStudents, MockExternships} from "./objects"
  At the top of your javascript file (add/remove variables as needed)
*/

//Define Classes
class Externship {
  constructor(
    companyName,
    numberOfSpots,
    applicants = [],
    jobId = null,
    postingId = null
  ) {
    this.companyName = companyName;
    this.jobId = jobId;
    this.postingId = postingId;
    this.numberOfSpots = numberOfSpots;
    this.applicants = applicants;
    this.matched = [];
  }
  match(studentObject) {
    /*
      Inputs: studentObject
      Outputs: None
      Appends students object to matched list
    */
    if (studentObject.assignedExternship !== null) {
      throw new Error(`Student <${studentObject.email}> has already been assigned an externship <${studentObject.assignedExternship.companyName}>`)
    }
    studentObject.assignedExternship = this
    this.matched.push(studentObject);
  }
  getHighestUnmatched() {
    /*
      Inputs: None
      Outputs: The highest ranked studentObject who is not ranked.
    */
    var i;
    for (i in this.applicants) {
      var applicant = this.applicants[i];
      if (applicant.assignedExternship === null) {
        return applicant;
      }
    }
  }
  getNumberOfApplicants(){
    /*
      Returns the number of applicants
    */
    return this.applicants.length;
  }
}

class Student {
  constructor(
    email,
    firstName=null,
    lastName=null,
    applications = [],
  ) {
    this.email = email
    this.firstName = firstName;
    this.lastName = lastName;
    this.applications = applications;
    this.assignedExternship = null;
  }
  getFullName(){
    /*
       Returns the string of the full name of the student
    */
    var first = (this.firstName ? this.firsName : "<No First Name>");
    var last = (this.lastName ? this.lastName : "<No Last Name>");
    return string.concat(first," ",last);
  }
  getNumberOfApplicants(){
    /*
     Returns the number of applications
    */
    return this.applications.length;
  }
}

//Generate Mock Data
//Define soe students
var adam = new Student("adz2@rice.edu","Adam", "Zawierucha");
var anna = new Student("anna@rice.edu", "Anna", "Bai");
var sanjanaa = new Student("sanj@rice.edu","Sanjanaa","Shanmugam");
var ryan = new Student("knight@rice.edu",  "Ryan", "Knighlty");
var johnny = new Student("john@rice.edu","Johnny");
var bob = new Student("bob@rice.edu","Bob")
var jill = new Student("jill@rice.edu","Jill")
var MockStudents = [adam,anna,sanjanaa,ryan,johnny,bob,jill];

//Define some externships
var MockExternships = [new Externship("Facebook",3,[anna,adam,ryan,sanjanaa]),
                       new Externship("Apple",2,[bob,jill,adam]),
                       new Externship("Netflix",2,[anna,sanjanaa,jill]),
                       new Externship("Google",1,[ryan,bob,johnny,adam]),
                      ];

//Add all externships to student's applicatiosn (NON-CRUCIAL, for now!)
var i;
for (i in MockExternships) {
  var externship = MockExternships[i];
  var j;
  for (j in externship.applicants) {
    var applicant = externship.applicants[j];
    applicant.applications.push(externship);
    console.log(applicant)
  }
}
