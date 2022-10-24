// Setup the localhost server on port 3000
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');
var qs = require('querystring');
const YahooFantasy = require('yahoo-fantasy');
// const secrets = require('./public/secrets.js');

app.use(express.static(__dirname + '/public'));

// require secrets from public/secrets.js
// const secrets = require('./public/secrets.js');

// Send test message to the client
app.get('/', (req, res) => {
    // send index.html from public along with any other files in public
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// get new access token from https://api.login.yahoo.com/oauth2/get_token with the following in the body:
// secrets.client_id, secrets.client_secret, secrets.redirect_uri, secrets.refresh_token, and grant_type=refresh_token
// use xhttp to send the request
// save the new access token to secrets.js



// xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = async function() {
//     if (this.readyState == 4 && this.status == 200) {
//         console.log("Got new access token");
//         console.log(this.responseText);
//     }
// };

// // send POST request to get new access token
// xhttp.open("POST", "https://api.login.yahoo.com/oauth2/get_token", true);
// xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// xhttp.send("client_id=" + secrets.client_id + "&client_secret=" + secrets.client_secret + "&redirect_uri=" + secrets.redirect_uri + "&refresh_token=" + secrets.refresh_token + "&grant_type=refresh_token");




// app.yf = new YahooFantasy(
//     secrets.clientID,
//     secrets.clientSecret,
//     app.tokenCallback,
//     "https://localhost:3000/auth/yahoo/callback"
// );

// app.get(
//     "/auth/yahoo",
//     (req, res) => {
//         app.yf.auth(res);
//     }
// );

// app.get("/auth/yahoo/callback", (req, res) => {
//     app.yf.authCallback(req, (err) => {
//         if (err) {
//             return res.redirect("/error");
//         }

//         return res.redirect("/");
//     });
// });

// // attempt to get league settings
// try {
//     const leagueSettings = app.yf.league.settings(".l.{61609}");
//     console.log(leagueSettings);
// } catch (err) {
//     console.log(err);
// }


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