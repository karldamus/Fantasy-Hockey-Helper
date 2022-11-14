async function displayScheduleForRoster(team_id, week=null) {
    // get the schedule object
    let schedule = await getSchedulesFromTeamId(team_id, week);
    let stats = await getStatsForRosterFromTeamId(team_id);

    let scheduleTableDiv = document.getElementById("schedule-table-wrapper");
    let allDaysInThisWeek = await getAllDaysInThisWeek();

    // create table
    let table = document.createElement("table");

    // for all days in this week, create a header cell
    let headerRow = document.createElement("tr");
    let headerCell = document.createElement("th");
    headerCell.innerHTML = "Player";
    headerRow.appendChild(headerCell);

    // create the headers for the days of the week
    for (let day of allDaysInThisWeek) {
        headerCell = document.createElement("th");
        headerCell.innerHTML = day;
        headerCell.id = day;

        // add the header cell to the header row
        headerRow.appendChild(headerCell);
    }

    // display the header row
    table.appendChild(headerRow);

    for (let player of Object.entries(schedule)) {
        // details for each player
        let player_name = player[0];
        let player_position = player[1].position;
        let player_display_position = player[1].display_position;
        let player_schedule = player[1].dates;
        
        let player_stats = stats.get(player_name);

        // add row and first cell for player name
        let row = document.createElement("tr");
        let cell = document.createElement("td");
        cell.innerHTML = player_name + " (" + player_display_position + ")";

        // apply class to cell
        classToAdd = getClassBasedOnPosition(player_position);
        cell.classList.add(classToAdd);
        cell.classList.add("underline");
        cell.classList.add("hover");

        cell.onmouseover = function() {
            showStatsPopup(player_name, player_position, player_stats);
        }

        cell.onmouseleave = function() {
            removePopup();
        }

        // add cell to row
        row.appendChild(cell);

        // for each day in allDaysInThisWeek, add a cell
        // for each cell, if the player plays on that day, add an "X" to that cell 
        for (let day of allDaysInThisWeek) {
            cell = document.createElement("td");
            // go through player schedule and see if they play on this day
            for (let date of Object.entries(player_schedule)) {
                if (date[1].date == day) {
                    cell.classList.add(classToAdd);
                    cell.classList.add("roster-schedule-played");
                }
            }

            // add cell to row
            row.appendChild(cell);
        }

        // display the row
        table.appendChild(row);
    }

    scheduleTableDiv.appendChild(table);
}

async function showStatsPopup(player_name, player_position, player_stats) {
    let popup = document.createElement("div");
    popup.id = "popup";
    popup.classList.add("popup");

    let popupText = document.createElement("p");
    popupText.innerHTML = player_name + " (" + player_position + ")";

    let popupStats = document.createElement("p");

    for (let stat of Object.entries(player_stats)) {
        popupStats.innerHTML += stat[0] + ": " + stat[1] + "<br>";
    }

    popup.appendChild(popupText);
    popup.appendChild(popupStats);

    document.body.appendChild(popup);
}

function removePopup() {
    let popup = document.getElementById("popup");
    popup.remove();
}

function getClassBasedOnPosition(player_position) {
    switch (player_position) {
        case "C":
            return "roster-position-center";
        case "LW":
            return "roster-position-left-wing";
        case "RW":
            return "roster-position-right-wing";
        case "D":
            return "roster-position-defense";
        case "G":
            return "roster-position-goalie";
        default:
            return "roster-position-unknown";
    }
}

