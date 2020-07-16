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

## Roadmap (AUGUST MVP):

- [x] gcp deployment 😃
- [x] grey background to focus on data
- [x] connect to match.riceapps.org
- [x] use RECOIL on frontend to simplify state logic
- [x] google oauth
- [x] separate pages for ccd and covidsitters with appropriate auth
  - (again, if we use google integration, this isn't needed)
- [x] connect to db
  - [x] actually, directly read/write to google sheet???
- [ ] column settings
  - (for each of these, hard code them first, and then make them configurable)
  - (once you can prove it can be done through hard-coding, then add to recoil state,
    and create a page/modal/sidebar to allow users to configure this)
  - [ ] hiding
  - [ ] variable width lengths based on the longest value in the column
  - [x] sticky
- [x] center and widen left card
- [x] make cards more readable
- [ ] match-making functionality
  - [x] buttons on top of right cards
  - [x] buttons actually create matches stored in state LEFT
  - [x] buttons actually create matches stored in state RIGHT
  - [x] when a match is made, both sides have colored indicators
  - [x] when a match is made, it is written to google sheet LEFT
  - [x] when a match is made, it is written to google sheet RIGHT
  - [ ] unmatch-ability for both LEFT and RIGHT
  - [ ] loading screen while match being made
- [ ] time data processing
  - [ ] once this is done, we should be able to sort by who matches the time availability of the hcw best maybe?
- [ ] some complicated ass css for antd table 
  - [ ] color for hover over row
  - [ ] color for fixed column
  - [ ] color for selected row
- [ ] when selecting a hcw, bring the students matched to him/her to the top
  - [ ] this could also just be some more complicated sort logic ("contains" operation")
- [ ] when selected a hcw, highlight the students matched to him/her in a different color
- [x] pod view page

## Icebox:
- [ ] clean up syncing logic???
- [ ] clean up app.yaml handlers by using regex
- [ ] 404 screen
- [ ] look into sub-domain (i.e. ccd.match.riceapps.org)
- [ ] select by search auto-complete
- [ ] automated match making decisions
- [ ] email template generation
- [ ] data backups with timestamps
