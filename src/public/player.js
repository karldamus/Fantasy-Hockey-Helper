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