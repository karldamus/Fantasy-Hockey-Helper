# Info
The goal of this program is to easily manage your fantasy hockey roster by visually seeing your rosters schedule autonomously and maximizing "off days"!

Other functionality will include things such as looking at optimal pickups for the week to see who would be a best fit to further maximize the schedule. I am looking to combine the Yahoo API with the current NHL API I am using already.

# Getting Started

```
npm init --y
npm install express
npm install yahoo-fantasy
```

```
nodemon server.js
```

Set up your OAuth authentication with the Yahoo Developer platform

Create a secrets.js file in src/public and create a const secrets object with the following paramaters:

```
client_id
client_secret
access_token
refresh_token
redirect_uri
expires_in
token_type
```

Navigate to http://localhost:3000

# From REQUIREMENTS.txt 
```
git clone https://github.com/Rob--W/cors-anywhere.git
cd cors-anywhere/
npm install
heroku create
git push heroku master
```


<!-- Fill in your player names in the src/public/data/rosterNames.txt file

Head to the terminal and enter createRoster(). Your roster will be generated into a json object inside src/public/data/MY_ROSTER.json -->