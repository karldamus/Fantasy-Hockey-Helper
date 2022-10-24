// Setup the localhost server on port 3000
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');
var qs = require('querystring');
const YahooFantasy = require('yahoo-fantasy');
const secrets = require('../secrets.js');
const { assert } = require('console');

const router = express.Router();

// get roster from yahoo fantasy api
router.get('/yahooGetRoster', (req, res) => {
    console.log("Got request from client to get roster from yahoo fantasy api");

    // get the client_id, client_secret, and access_token from the request
    let client_id = req.query.client_id;
    let client_secret = req.query.client_secret;
    let access_token = req.query.access_token;

    // create new yahoo fantasy object
    const yf = new YahooFantasy(
        client_id,
        client_secret,
    );

    // set the access token
    yf.setUserToken(access_token);


    // get team roster
    yf.team.roster("nhl.l.61609.t.7").then((data) => {
        res.send(data.roster);
    })
    .catch((err) => {
        console.log(err);
    });
});

// get matchup for week from yahoo fantasy api
router.get('/yahooGetMatchup', (req, res) => {
    console.log("Got request from client to get matchup from yahoo fantasy api");

    console.log(req.query);

    // get the client_id, client_secret, and access_token from the request
    let client_id = req.query.client_id;
    let client_secret = req.query.client_secret;
    let access_token = req.query.access_token;

    // create new yahoo fantasy object
    const yf = new YahooFantasy(
        client_id,
        client_secret,
    );

    // set the access token
    yf.setUserToken(access_token);

    // get matchup for week
    yf.team.matchups("nhl.l.61609.t.7").then((data) => {
        res.send(data);
    })
    .catch((err) => {
        console.log(err);
    });
});

module.exports = router;