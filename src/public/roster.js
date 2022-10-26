async function getRoster() {
    let roster = await getRosterFromTeamId(yahoo_constants.team_id);
    return roster;
}

async function getRosterFromTeamId(team_id) {
    let rosterLink = yahoo_constants.base_link + "/team/" + yahoo_constants.league_id + ".t." + team_id + "/roster";
    let roster = await getData(rosterLink, "GET");
    return roster.fantasy_content.team.roster.players.player;
}

async function testRosterMethods() {
    alertConsole("Testing Roster Methods");

    let roster = await getRoster();
    console.log(roster);

    let roster2 = await getRosterFromTeamId(8);
    console.log(roster2);

    alertConsole("End of Testing Roster Methods");
}