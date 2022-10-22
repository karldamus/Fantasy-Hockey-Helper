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