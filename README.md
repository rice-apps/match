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
  - [ ] sticky
- [x] center and widen left card
- [ ] Make cards more readable (Zawie)
- [ ] match-making functionality
  - [x] buttons on top of right cards
  - [x] buttons actually create matches stored in state LEFT
  - [ ] buttons actually create matches stored in state RIGHT
  - [x] when a match is made, both sides have colored indicators
  - [x] when a match is made, it is written to google sheet LEFT
  - [ ] when a match is made, it is written to google sheet RIGHT
  - [ ] unmatch-ability
- [ ] time data processing

## Icebox:
- [ ] select by search auto-complete
