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
  addApplication(externshipObject){
    /*
      Simply appends an externship object to applications list
    */
    this.applications.push(externshipObject);
  }
}
