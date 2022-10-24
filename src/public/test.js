// vars and objects
var xhttp;
// let allPlayers = {};

async function testYahooApi() {

}

async function getYahooRoster() {
    // get the access token, it will be updated in the secrets file
    await getNewAccessToken();
    // time delay to allow for the access token to be updated
    await new Promise(r => setTimeout(r, 1000));

    console.log("")

    // get roster using /yahooGetRoster endpoint
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Got roster from yahoo");
            console.log(JSON.parse(this.responseText));
        }
    };

    // send GET request to get roster
    xhttp.open("GET", "http://localhost:3000/yahooTeam/yahooGetRoster?client_id=" + secrets.client_id + "&client_secret=" + secrets.client_secret + "&access_token=" + secrets.access_token, true);
    xhttp.send();
}

let matchups = {};

async function getYahooMatchup() {
    // get the access token, it will be updated in the secrets file
    await getNewAccessToken();
    // time delay to allow for the access token to be updated
    await new Promise(r => setTimeout(r, 1000));

    console.log("")

    // get roster using /yahooGetRoster endpoint
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
            matchups = JSON.parse(this.responseText);
            matchups = matchups.matchups;
        }
    };

    // send GET request to get roster
    xhttp.open("GET", "http://localhost:3000/yahooTeam/yahooGetMatchup?client_id=" + secrets.client_id + "&client_secret=" + secrets.client_secret + "&access_token=" + secrets.access_token, true);
    xhttp.send();
}

async function getAllTeamsIWillFace() {
    await getYahooMatchup();
    await new Promise(r => setTimeout(r, 2000));

    console.log(matchups);

    let teams = [];

    for (let i = 0; i < matchups.length; i++) {
        teams.push(matchups[i].teams[1].name);
    }

    for (let i = 0; i < teams.length; i++) {
        console.log(teams[i]);
    }


    // let teams = matchup[0].teams;

    // console.log(teams);
}


async function getNewAccessToken() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log("Got new access token");
            // console.log(this.responseText);
            let response = JSON.parse(this.responseText);
            let accessToken = response.access_token;

            // update the access token in the secrets file
            secrets.access_token = accessToken;
        } 
    };

    // send POST request to get new access token
    xhttp.open("POST", "https://fast-gorge-98923.herokuapp.com/https://api.login.yahoo.com/oauth2/get_token", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("client_id=" + secrets.client_id + "&client_secret=" + secrets.client_secret + "&redirect_uri=" + secrets.redirect_uri + "&refresh_token=" + secrets.refresh_token + "&grant_type=refresh_token");
}