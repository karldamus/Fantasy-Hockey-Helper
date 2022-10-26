// get the essential data for all teams
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

// get extended data for a specific team
async function getTeamData(teamID) {
    let URL = "https://statsapi.web.nhl.com/api/v1/teams/" + teamID;

    const teamData = await getData(URL);

    return teamData;
}