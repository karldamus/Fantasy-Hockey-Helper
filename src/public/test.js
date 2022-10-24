// vars and objects
var xhttp;
// let allPlayers = {};

async function testYahooApi() {
    // get yahoo secret
}


async function getNewAccessToken() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Got new access token");
            console.log(this.responseText);
        }
    };

    // send POST request to get new access token
    xhttp.open("POST", "https://api.login.yahoo.com/oauth2/get_token", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("client_id=" + secrets.client_id + "&client_secret=" + secrets.client_secret + "&redirect_uri=" + secrets.redirect_uri + "&refresh_token=" + secrets.refresh_token + "&grant_type=refresh_token");

    console.log(xhttp.responseText);
}