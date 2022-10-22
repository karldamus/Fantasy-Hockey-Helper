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
    xhttp.open("GET", "http://localhost:3000/addPlayerToRoster?name=" + player.name + "&id=" + player.id + "&team=" + player.team + "&teamID=" + player.teamID, true);
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

async function getRoster() {
    // get the roster from the server and wait for a response before returning
    let response = await fetch("http://localhost:3000/getRoster");
    let roster = await response.json();
    return roster;
}

async function testGetRoster() {
    // get roster from MY_ROSTER.json
    let roster = await getRoster();

    if (roster == {} || roster == null || roster == undefined) {
        console.log("roster is empty");
        return;
    }   

    console.log(roster);
}

// async function test2GetRoster() {

// }

