var xhttp;

let filePaths = "constats/filePaths.js";

// function print hello world
function test() {
    console.log('Hello World');
}


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

    // for (let team of Object.entries(allTeamBasicData)) {
    //     console.log(team[1].name + " " + team[1].id + " " + team[1].link);
    // }


    return allTeamBasicData;
}

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
                team: team[1].name
            }
        }
    }

    return allPlayers;
}

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

async function searchForPlayer(name) {
    let allPlayers = await getAllPlayers();

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

function printPlayers(players) {
    for (let player of Object.entries(players)) {
        console.log(player[1].name + " " + player[1].id + " " + player[1].team);
    }
}

function printPlayer(player) {
    console.log(player.name + " " + player.id + " " + player.team);
}

async function main() {
    let players = await getAllPlayersSorted("id");
    printPlayers(players);
}

async function getData(URL) {
    let response = await fetch(URL);
    let data = await response.json();
    return data;
}