// yahoo API function 
// uses NHL api through other methods
//  - getScheduleFromTeamId
//  - getTeamIdFromTeamName
async function getSchedulesFromTeamId(team_id, week) {
    let roster = await getRosterFromTeamId(team_id);

    let playerSchedules = {};

    for (let player of roster) {
        // get the team name of the player
        let teamName = player.editorial_team_full_name;
        let playerPosition = player.primary_position;
        let display_position = player.display_position;

        // get nhl api related team id
        let nhl_team_id = await getTeamIdFromTeamName(teamName);

        // get the player's schedule from the nhl api
        let schedule = await getScheduleFromTeamId(nhl_team_id);

        // add the player's position to the schedule
        schedule.position = playerPosition;
        schedule.display_position = display_position;

        // add the player's schedule to playerSchedules
        playerSchedules[player.name.full] = schedule;
    }

    // sort the playerSchedules by position
    playerSchedules = sortObject(playerSchedules, "position");

    return playerSchedules;
}

function sortObject(obj, sortKey) {
    let sorted = {};
    let keys = Object.keys(obj);

    keys.sort(function (a, b) {
        return obj[a][sortKey].localeCompare(obj[b][sortKey]);
    });

    keys.forEach(function (key) {
        sorted[key] = obj[key];
    });

    return sorted;
}

// NHL API
async function getScheduleFromTeamId(team_id) {
    // get this weeks dates
    let dates = await getThisWeeksDates();
    let startDate = dates[0].toISOString().split("T")[0];
    let endDate = dates[1].toISOString().split("T")[0];

    let URL = nhl_constants.base_link + "schedule?teamId=" + team_id + "&startDate=" + startDate + "&endDate=" + endDate;

    let schedule = await getNhlData(URL, "GET");

    return schedule;
}

// LOCAL DATA Method
// Returns: the id of the team in the NHL API
async function getTeamIdFromTeamName(team_name) {
    // find the team id given the team_name from nhl_team_data object
    for (let team of Object.entries(nhl_team_data)) {
        // look for similar team names
        if (team[1].name.toLowerCase().includes(team_name.toLowerCase())) {
            return team[1].id;
        }
    }

    // if no team is found, return null
    return null;
}

// get this weeks dates where:
//  - first date is the monday
//  - last date is the sunday
async function getThisWeeksDates() {
    let today = new Date();
    let day = today.getDay();
    let date = today.getDate();
    let month = today.getMonth();
    let year = today.getFullYear();

    let monday = new Date(year, month, date - day + 1);
    let sunday = new Date(year, month, date - day + 7);

    return [monday, sunday];
}

async function getAllDaysInThisWeek() {
    let dates = await getThisWeeksDates();
    let monday = dates[0];
    let sunday = dates[1];

    let allDays = [];

    // get all days in this week with only YYYY-MM-DD
    for (let i = 0; i < 7; i++) {
        let day = new Date(monday);
        day.setDate(day.getDate() + i);
        allDays.push(day.toISOString().split("T")[0]);
    }

    return allDays;
}

// testing function (console)
function printSchedule(rosterSchedule) {
    for (let [player, schedule] of Object.entries(rosterSchedule)) {
        console.log(player);
        for (let game of schedule.dates) {
            console.log("    " + game.date);
        }
    }
}

async function testSchedule() {
    alertConsole("Testing Schedule Methods");

    // let team_id = await getTeamIdFromTeamName("Leafs");
    // console.log(team_id);

    let teamSchedules = await getSchedulesFromTeamId(7);
    // console.log(teamSchedules);
    // printSchedule(teamSchedules);

    alertConsole("End of Testing Schedule Methods");
}