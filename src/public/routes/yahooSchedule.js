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


// get schedule
// router.get('/yahooGetSchedule', (req, res) => {
//     console.log("Got request from client to get schedule from yahoo fantasy api");

//     // get the client_id, client_secret, and access_token from the request
//     let client_id = req.query.client_id;
//     let client_secret = req.query.client_secret;
//     let access_token = req.query.access_token;



module.exports = router;