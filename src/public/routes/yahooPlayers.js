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


// get players from yahoo fantasy api
router.get('/yahooGetPlayers', (req, res) => {
    console.log("Got request from client to get players from yahoo fantasy api");

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

    // get players
    yf.league.players("nhl.l.61609", ["nhl.p.4969"]).then((data) => {
        res.send(data);
    })
    .catch((err) => {
        console.log(err);
    });
});




module.exports = router;