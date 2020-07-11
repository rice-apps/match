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
  - [ ] actually, directly read/write to google sheet??? 
- [ ] allow hiding columns
  - [ ] first, hardcode this into recoil state
  - [ ] create modal, sidebar, or separate page to modify this setting
- [ ] center and widen left card
- [ ] variable column lengths based on the longest value in the column
- [ ] sticky column handling
  - [ ] first hardcode into recoil state
  - [ ] modal, sidebar, or separate page to modify this setting
- [ ] match-making functionality
  - [ ] buttons on top of right cards
  - [ ] buttons actually create matches stored in state
  - [ ] when a match is made, both sides have colored indicators
  - [ ] when a match is made, it is written to either db or google sheet
- [ ] time data processing
- [ ] rice idp authentication 
  - (if we do google integration, we can just use that auth instead)
- [ ] separate pages for ccd and covidsitters with appropriate auth 
  - (again, if we use google integration, this isn't needed)

## Icebox:
- [ ] select by search auto-complete
