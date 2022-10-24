// Setup the localhost server on port 3000
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');
var qs = require('querystring');
const YahooFantasy = require('yahoo-fantasy');
const secrets = require('./public/secrets.js');
const { assert } = require('console');

app.use(express.static(__dirname + '/public'));

// require secrets from public/secrets.js
// const secrets = require('./public/secrets.js');

// Send test message to the client
app.get('/', (req, res) => {
    // send index.html from public along with any other files in public
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// add yahooTeam routes
app.use('/yahooTeam', require('./public/routes/yahooTeam.js'));

// add yahooSchedule routes
app.use('/yahooSchedule', require('./public/routes/yahooSchedule.js'));

// receive a POST request from the client
app.get('/addPlayerToRoster', (req, res) => {
    let name = req.query.name;
    let id = req.query.id;
    let team = req.query.team;
    let teamID = req.query.teamID;
    let position = req.query.position;

    // create player object
    let player = {
        name: name,
        id: id,
        team: team,
        teamID: teamID,
        position: position
    };

    console.log("Adding " + player.name + " to MY_ROSTER.json");

    // parse the MY_ROSTER.json file if it exists
    let rawdata = fs.readFileSync(path.join(__dirname + '/public/data/MY_ROSTER.json'));
    if (rawdata.length > 0) {
        let roster = JSON.parse(rawdata);
        roster[name] = player;
        fs.writeFileSync(path.join(__dirname + '/public/data/MY_ROSTER.json'), JSON.stringify(roster));
    } else {
        let roster = {};
        roster[name] = player;
        fs.writeFileSync(path.join(__dirname + '/public/data/MY_ROSTER.json'), JSON.stringify(roster));
    }

    // send response to client
    res.send("Added " + name + " to MY_ROSTER.json");

});


// create roster based on list of names from rosterNames.txt. each name will be on a new line
app.get('/createRoster', (req, res) => {
    // empty the MY_ROSTER.json file
    fs.writeFileSync(path.join(__dirname + '/public/data/MY_ROSTER.json'), "");

    let rosterNames = fs.readFileSync(path.join(__dirname + '/public/data/rosterNames.txt'), 'utf8');


    // create array of names, remove \r and \n characters
    let names = rosterNames.split("\r");
    for (let i = 0; i < names.length; i++) {
        names[i] = names[i].replace("\n", "");
    }

    res.send(names);
});

// receive a GET request from the client
app.get('/getRoster', (req, res) => {
    // parse the MY_ROSTER.json file if it exists
    let rawdata = fs.readFileSync(path.join(__dirname + '/public/data/MY_ROSTER.json'));
    if (rawdata.length > 0) {
        // let roster = JSON.parse(rawdata);
        // res.send(roster);
        res.send(rawdata);
    } else {
        res.send("MY_ROSTER.json is empty");
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});