# Info
The goal of this program is to easily manage your fantasy hockey roster by visually seeing your rosters schedule autonomously and maximizing "off days"!

Other functionality will include things such as looking at optimal pickups for the week to see who would be a best fit to further maximize the schedule. I am looking to combine the Yahoo API with the current NHL API I am using already.

# Getting Started

```
npm init --y
npm install express
```

```
nodemon server.js
```

Navigate to http://localhost:3000


Fill in your player names in the src/public/data/rosterNames.txt file

Head to the terminal and enter createRoster(). Your roster will be generated into a json object inside src/public/data/MY_ROSTER.json