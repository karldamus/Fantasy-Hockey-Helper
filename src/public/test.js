// vars and objects
var xhttp;
let allPlayers = {};
// let roster = {};

// ======
// ======

// essential filler function
async function getAllTeamBasicData() {
    let URL = "https://statsapi.web.nhl.com/api/v1/teams";

    const allTeamData = await getData(URL);

    let allTeamBasicData = {};

    for (let team of Object.entries(allTeamData.teams)) {
        allTeamBasicData[team[1].name] = {
            id: team[1].id,
            name: team[1].name,
            link: team[1].link
        }
    }

    // sort allTeamNames by name
    allTeamBasicData = Object.fromEntries(
        Object.entries(allTeamBasicData).sort()
    );

    return allTeamBasicData;
}

async function getTeamData(teamID) {
    let URL = "https://statsapi.web.nhl.com/api/v1/teams/" + teamID;

    const teamData = await getData(URL);

    return teamData;
}

async function getTeamSchedule(teamID) {
    let teamData = await getTeamData(teamID);

    // get start and end date
    let dates = getCurrentWeekScheduleDates();
    let startDate = dates[0];
    let endDate = dates[1];

    // get schedule data with teamId, startDate, and endDate
    let URL = "https://statsapi.web.nhl.com/api/v1/schedule?teamId=" + teamID + "&startDate=" + startDate + "&endDate=" + endDate;

    let teamSchedule = await getData(URL);

    // create array of dates from teamSchedule.dates
    let datesArray = [];
    for (let date of Object.entries(teamSchedule.dates)) {
        datesArray.push(date[1].date);
    }

    return datesArray;
}

async function getRosterSchedule() {
    // get roster from MY_ROSTER.json
    let roster = await getRoster();

    if (roster == {} || roster == null || roster == undefined) {
        console.log("roster is empty");
        return;
    } else {
        console.log(roster);
    } 
}

function getCurrentWeekScheduleDates() {
    // start date is the current week starting on monday in the format yyyy-mm-dd
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
    startDate = startDate.toISOString().split("T")[0];
    
    // end date is the sunday after the start date
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    endDate = endDate.toISOString().split("T")[0];

    let dates = [startDate, endDate];

    return dates;
}

// essential filler function
async function getAllPlayers() {
    let allTeamBasicData = await getAllTeamBasicData();

    let allPlayers = {};

    // go through each team 
    for (let team of Object.entries(allTeamBasicData)) {
        // get roster data for current team
        let URL = "https://statsapi.web.nhl.com" + team[1].link + "/roster";

        const teamRoster = await getData(URL);

        // go through each player on the team
        for (let player of Object.entries(teamRoster["roster"])) {
            // add player to allPlayers
            allPlayers[player[1].person.fullName] = {
                id: player[1].person.id,
                name: player[1].person.fullName,
                link: player[1].person.link,
                team: team[1].name,
                teamID: team[1].id
            }
        }
    }

    return allPlayers;
}

// essential filler function
// addon to getAllPlayers() 
async function getAllPlayersSorted(sortBy) {
    let allPlayers = await getAllPlayers();

    switch (sortBy) {
        case "team":
            // sort allPlayers based on their team value
            allPlayers = Object.fromEntries(
                Object.entries(allPlayers).sort(([, a], [, b]) => a.team.localeCompare(b.team))
            );
            break;
        case "name":
            // sort allPlayers by first name
            allPlayers = Object.fromEntries(
                Object.entries(allPlayers).sort()
            );
            break;
        case "id": 
            // sort allPlayers by id
            allPlayers = Object.fromEntries(
                Object.entries(allPlayers).sort(([, a], [, b]) => a.id - b.id)
            );
            break;
        default:
            break;
    }

    return allPlayers;
}

// search for a player by name
// paramater: name - the name of the player to search for. can be a partial name
// returns an object with the player's name as the key and the player's data as the value
async function searchForPlayer(name) {
    if (Object.keys(allPlayers).length == 0) {
        allPlayers = await getAllPlayers();
    }

    let playersFound = {};

    // do the search
    for (let player of Object.entries(allPlayers)) {
        if (player[1].name.toLowerCase().includes(name.toLowerCase())) {
            playersFound[player[1].name] = player[1];
        }
    }

    // no players found
    if (Object.keys(playersFound).length == 0) {
        console.log("No players found with input name " + name);
    } 
    // one player found
    else if (Object.keys(playersFound).length == 1) {
        console.log("Found 1 player with input name " + name);
        printPlayer(playersFound[Object.keys(playersFound)[0]]);
    } 
    // multiple players found
    else {
        console.log("Found " + Object.keys(playersFound).length + " players with input name " + name);
        for (let player of Object.entries(playersFound)) {
            printPlayer(player[1]);
        }
    }

    return playersFound;
}

// add the given player to the MY_ROSTER.txt file
async function addPlayerToRosterFile(player) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Added " + player.name + " to MY_ROSTER.json");
        }
    };

    console.log("Attempting to add " + player.name + " to MY_ROSTER.json");

    // send GET request to server to add player to MY_ROSTER.json
    xhttp.open("GET", "http://localhost:3000/addPlayerToRoster?name=" + player.name + "&id=" + player.id + "&team=" + player.team, true);
    xhttp.send();
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// get the current roster from the MY_ROSTER.json file
async function getRosterSchedule() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
            let roster = JSON.parse(xhttp.responseText);

            console.log("Roster created, returning");
            return roster;
        } else {
            await sleep(1000);
        }
    };

    // send GET request to server to get MY_ROSTER.json
    xhttp.open("GET", "http://localhost:3000/getRoster", true);
    xhttp.send();
}

// based on the names of players in rosterNames.txt, add those players to MY_ROSTER.json
async function createRoster() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
            let names = JSON.parse(this.responseText);

            for (let name of names) {
                player = await searchForPlayer(name);
                console.log(player);
                await addPlayerToRosterFile(player[Object.keys(player)[0]]);
            }
        }
    };

    // send GET request to server to create MY_ROSTER.json
    xhttp.open("GET", "http://localhost:3000/createRoster", true);
    xhttp.send();
}

function getLocalRoster() {
    // send request to server to get MY_ROSTER.json
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    }

    xhttp.open("GET", "http://localhost:3000/getRoster", true);
    xhttp.send();

}

// print the given player's data
function printPlayers(players) {
    for (let player of Object.entries(players)) {
        console.log(player[1].name + " " + player[1].id + " " + player[1].team);
    }
}

// print the given player's data
function printPlayer(player) {
    console.log(player.name + " " + player.id + " " + player.team);
}

// testing
async function main() {
    console.log("Before getting roster");
    roster = await getRoster();



    console.log("After getting roster");
    console.log(roster);
    // console.log(rosterSchedule);
}

// fetch data from the given URL
async function getData(URL) {
    let response = await fetch(URL);
    let data = await response.json();
    return data;
}