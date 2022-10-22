function hello() {
    searchForPlayer("Matthews");
}

async function main() {
    // let player = await searchForPlayer("Matthews");
    // console.log(player);

    // let leafs = await getAllTeamBasicData(10);
    // console.log(leafs);

    // let leafsSchedule = await getTeamSchedule(10);
    // console.log(leafsSchedule);

    let myRoster = await getRoster();
    console.log(myRoster);

    // add all teamID's from myRoster to an array minus duplicates
    let teamsOnRoster = {};

    for (let player of Object.entries(myRoster)) {
        if (player[1].teamID in teamsOnRoster) {
            continue;
        } else {
            teamsOnRoster[player[1].teamID] = {
                team: player[1].team,
                teamID: player[1].teamID
            }
        }
    }

    // get team schedules for all teams in teamIDs
    let teamSchedules = {};

    for (let [key, value] of Object.entries(teamsOnRoster)) {
        let teamSchedule = await getTeamSchedule(key);
        teamSchedules[key] = {
            team: value.team,
            schedule: teamSchedule
        };
    }

    let numberOfGamesByDate = {};

    console.log(teamSchedules);

    for (let [key, value] of Object.entries(teamSchedules)) {
        for (let date of value.schedule) {
            if (date in numberOfGamesByDate) {
                numberOfGamesByDate[date].num += 1;
            } else {
                let dayOfWeek = await getDayOfWeekAsWord(date);

                numberOfGamesByDate[date] = {
                    num: 1,
                    dayOfWeek: dayOfWeek
                }

            }
        }
    }

    for (let [key, value] of Object.entries(numberOfGamesByDate)) {
        console.log(value.dayOfWeek + ": " + value.num);
    }



    // // print out all dates in teamSchedules
    // for (let [key, value] of Object.entries(teamSchedules)) {
    //     for (let date of Object.entries(value.schedule)) {
    //         console.log(date[1].date);
    //     }
    // }

}

async function getDayOfWeekAsWord(date) {
    let dayOfWeek = new Date(date).getDay();

    switch (dayOfWeek) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "Error";
    }
}