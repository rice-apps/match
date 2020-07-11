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
  - [ ] actually, directly read/write to Google sheet??? 
- [ ] allow hiding columns
  - either create modal, sidebar, or separate page for this setting
- [ ] center and widen left card
- [ ] match-making functionality
  - buttons on top of right cards
  - 
- [ ] time data processing
- [ ] rice idp authentication (if we do Google integration, we can just use that auth instead)
- [ ] separate pages for ccd and covidsitters with appropriate auth (again, if we use Google integration, this isn't needed)

## Icebox:
- [ ] select by search auto-complete
