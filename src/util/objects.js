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
    this.matched.push(studentObject);
  }
  getHighestUnmatched() {
    /*
      Inputs: None
      Outputs: The highest ranked studentObject who is not ranked (not in matched)
    */
    var i;
    for (i in this.applicants) {
      var unmatched = true;
      var j;
      for (j in this.matched) {
        if (this.applicants[i] === this.matched[j]) {
          unmatched = false;
          break;
        }
      }
      if (unmatched) {
        return this.applicants[i];
      }
    }
  }
}
