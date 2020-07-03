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

## Roadmap:

- [x] gcp deployment 😃
- [x] grey background to focus on data
- [x] connect to match.riceapps.org
- [x] use RECOIL on frontend to simplify state logic
- [ ] connect to db
- [ ] allow hiding columns and add to description [ex.](https://ant.design/components/table/#components-table-demo-expand)
- [ ] time data processing
- [ ] Rice idp authentication
- [ ] separate pages for ccd and covidsitters with appropriate auth

## Icebox:
- [ ] select by search auto-complete
