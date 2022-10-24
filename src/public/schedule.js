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

    let schedule = {};

    // for each date in datesArray, add the date with the day of the week to schedule
    for (let date of datesArray) {
        let dayOfWeek = await getDayOfWeekAsWord(date);
        
        schedule[date] = {
            date: date,
            dayOfWeek: dayOfWeek
        }
    }

    return schedule;
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

async function getRosterSchedule() {
    let myRoster = await getRoster();

    let playerSchedules = {};
    let numberOfGamesByDateWithTeamID = {};
    let playersWithGameDates = {};

    // for each player in myRoster, add their name, id, position, and schedule based on their teamID to playerSchedules
    for (let player of Object.entries(myRoster)) {
        let playerSchedule = await getTeamSchedule(player[1].teamID);

        playerSchedules[player[1].name] = {
            name: player[1].name,
            id: player[1].id,
            position: player[1].position,
            schedule: playerSchedule
        }
    }

    return playerSchedules;
    
}

async function printScheduleInReadableFormat() {
    let rosterSchedule = await getRosterSchedule();

    // for each player in rosterSchedule, print their name, position, and the days of the week they play
    for (let player of Object.entries(rosterSchedule)) {
        console.log(player[1].name + " (" + player[1].position + ") plays on:");
        for (let date of Object.entries(player[1].schedule)) {
            console.log(date[1].dayOfWeek);
        }
        console.log("");
    }
}

// display the table in index.html with the schedule with the days of the week as the columns and the players as the rows
// include position and team name
async function displayScheduleInTable() {
    let rosterSchedule = await getRosterSchedule();

    let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // create a table with the days of the week as the columns and the players as the rows
    let table = document.createElement("table");

    // create the header row
    let headerRow = document.createElement("tr");
    let headerCell = document.createElement("th");
    
    headerCell = document.createElement("th");
    headerCell.innerHTML = "Player";
    headerRow.appendChild(headerCell);

    // create the headers for the days of the week
    for (let day of daysOfWeek) {
        headerCell = document.createElement("th");
        headerCell.innerHTML = day;
        headerCell.id = day;
        headerRow.appendChild(headerCell);
    }

    // display the header row
    table.appendChild(headerRow);

    // for each player in rosterSchedule, add a cell under the day of the week they play
    for (let player of Object.entries(rosterSchedule)) {
        let row = document.createElement("tr");
        let cell = document.createElement("td");
        cell.innerHTML = player[1].name + " (" + player[1].position + ")";

        // // apply link to cell
        // cell.onclick = function() {
        //     window.open("https://www.nhl.com/player/" + player[1].id);
        // }

        // apply onclick to cell that will display the player's current stats
        cell.onmouseover = async function() {
            let isGoalie = player[1].position == "G";
            await getAndDisplayPlayerStatsAsPopup(player[1].id, player[1].name, isGoalie);
        }

        // onmouseout, remove the popup
        cell.onmouseout = function() {
            removePopup();
        }


        row.appendChild(cell);

        // for each day of the week, add a cell under the player if they play on that day
        for (let day of daysOfWeek) {
            cell = document.createElement("td");
            for (let date of Object.entries(player[1].schedule)) {
                if (date[1].dayOfWeek == day) {
                    cell.innerHTML = "X";
                }
            }
            row.appendChild(cell);
        }

        // display the row
        table.appendChild(row);
    }

    // display the table
    document.getElementById("schedule").appendChild(table);
}

async function getAndDisplayPlayerStatsAsPopup(playerID, name, isGoalie) {
    let URL = "https://statsapi.web.nhl.com/api/v1/people/" + playerID + "/stats?stats=statsSingleSeason&season=20222023";
    let playerStats = await getData(URL);

    let stats = playerStats.stats[0].splits[0].stat;

    console.log(stats);

    let organizedStats = {};

    if (isGoalie) {
        let wins = stats.wins;
        let losses = stats.losses;
        let saves = stats.saves;
        // get save percentage to 3 decimal places
        let savePercentage = (stats.savePercentage).toFixed(3);
        // let goalsAgainstAverage = (stats.goalsAgainstAverage);
        let shutouts = stats.shutouts;
        let gamesPlayed = stats.games;

        organizedStats = {
            "GP": gamesPlayed,
            "W": wins,
            "L": losses,
            "SV": saves,
            "SV%": savePercentage,
            "SO": shutouts
        }
    } else {
        let goals = stats.goals;
        let assists = stats.assists;
        let points = stats.points;
        let shots = stats.shots;
        let blocks = stats.blocked;
        let powerPlayPoints = stats.powerPlayPoints;
        let gamesPlayed = stats.games;

        organizedStats = {
            "G": goals,
            "A": assists,
            "P": points,
            "S": shots,
            "B": blocks,
            "PPP": powerPlayPoints,
            "GP": gamesPlayed
        }
    }

    removePopup();

    // create popup with player's stats
    let popup = document.createElement("div");
    popup.id = "popup";
    popup.classList.add("popup");
    popup.style.position = "absolute";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "white";
    popup.style.border = "1px solid black";
    popup.style.padding = "10px";
    popup.style.width = "300px";
    popup.style.height = "300px";

    let popupText = document.createElement("p");
    popupText.innerHTML = name + "'s stats for the 2022-2023 season:";
    
    let popupStats = document.createElement("p");
    // popupStats.innerHTML = "G: " + goals + "<br>A: " + assists + "<br>P: " + points + "<br>PPP: " + powerPlayPoints + "<br>BLK: " + blocks + "<br>GP: " + gamesPlayed;

    for (let stat of Object.entries(organizedStats)) {
        popupStats.innerHTML += stat[0] + ": " + stat[1] + "<br>";
    }

    popup.appendChild(popupText);
    popup.appendChild(popupStats);

    document.body.appendChild(popup);

    // remove popup when clicked
    popup.onclick = function() {
        popup.remove();
    }



    // // display the player's stats in the stats div
    // let statsDiv = document.getElementById("stats");
    // statsDiv.innerHTML = "Goals: " + goals + "<br>Assists: " + assists + "<br>Points: " + points + "<br>Blocks: " + blocks + "<br>Games Played: " + gamesPlayed;
}

function removePopup() {
    // remove any current popups
    let popups = document.getElementsByClassName("popup");
    for (let popup of popups) {
        popup.remove();
    }
}