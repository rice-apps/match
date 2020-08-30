## How to develop:

Clone locally
```
$ git clone https://github.com/rice-apps/match.git
$ cd match
```

Install node dependencies (should be once)
```
$ npm install
```

Run server locally
```
$ npm run start
```

## How to deploy:

GCP Cloudbuild trigger is setup to deploy every push to master branch.

## How to use:
### CCD
Go to `/ccd`
Upload a .CSV file with at least the following columns (case doesn't matter):
- externships/externships
- applicant email
- applicant first
- applicant last
- ranking
- number of externs
- job id (OPTIONAL)
- posting id (OPTIONAL)

The column name requirements can be changed in the dictioanry in `stc/utils/ccd/externshipParser.js`

Each row represents an applicantion, if an externship has no applicants, include a row with just the externships with no value for student name, email, etc.

Click 'Download Results'
