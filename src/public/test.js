// vars and objects
var xhttp;
// let allPlayers = {};

const herokuLink = "https://whispering-savannah-84238.herokuapp.com/" + "http://localhost:3000/";

const base_link = "https://fantasysports.yahooapis.com/fantasy/v2/";
const league_id = "nhl.l.61609";
const team_id = "nhl.l.61609.t.7";


// var parser = require('xml2json');

async function showRosterWithScheduleInIndex() {
    let roster = await getYahooRoster();

}

async function getYahooTeamSchedule() {
    let link = base_link + "team/" + team_id + "/games";
    let schedule = await getDataViaAjax(link, "GET");
    return schedule;
}

async function testYahooApi() {
    // // get roster
    // let roster = await getYahooRoster();
    // console.log("Roster:");
    // console.log(roster);

    // // get matchups
    // let matchups = await getYahooMatchup();
    // console.log("Matchups:");
    // console.log(matchups);

    // // get stats for all players on roster
    // let stats = await getAllStatsFromPlayersOnRoster();
    // console.log("Stats:");
    // console.log(stats);

    // // get league standings
    // let standings = await getLeagueStandings();
    // console.log("Standings:");
    // console.log(standings);

    // // get all team rosters
    // let allRosters = await getAllRosters();
    // console.log("All Rosters:");
    // console.log(allRosters);

    // // get team schedule
    // let schedule = await getYahooTeamSchedule();
    // console.log("Schedule:");
    // console.log(schedule);

    // get all player data from NHL API
    let allPlayerData = await getAllPlayerDataFromNHLApiOnRoster();
    console.log("All Player Data:");
    console.log(allPlayerData);
    
}

async function getAllPlayerDataFromNHLApiOnRoster() {
    let roster = await getYahooRoster();
    let allPlayerData = {};

    for (let i = 0; i < roster.length; i++) {
        let player = roster[i];
        let player_name = player.name.full;

        let player_data = await searchForPlayer(player_name);
        allPlayerData[player_name] = player_data;
    }

    return allPlayerData;
}


async function getYahooRoster() {
    let rosterLink = base_link + "/team/" + team_id + "/roster";
    let roster = await getDataViaAjax(rosterLink, "GET");
    return roster.fantasy_content.team.roster.players.player;
}

async function getYahooRosterFromTeamId(team_id) {
    let rosterLink = base_link + "/team/" + team_id + "/roster";
    let roster = await getDataViaAjax(rosterLink, "GET");
    return roster.fantasy_content.team.roster.players.player;
}

async function getAllRosters() {
    let standings = await getLeagueStandings();
    let allRosters = {};

    for (let i = 0; i < standings.length; i++) {
        let team = standings[i];
        let team_key = team.team_key;
        let roster = await getYahooRosterFromTeamId(team_key);
        allRosters[team.name + " - " + team.managers.manager.nickname] = roster;
    }

    return allRosters;
}

async function getYahooMatchup() {
    let matchupLink = base_link + "/team/" + team_id + "/matchups";
    let matchups = await getDataViaAjax(matchupLink, "GET");
    return matchups.fantasy_content.team.matchups.matchup;
}

async function getAllStatsFromPlayersOnRoster() {
    // get the roster
    let roster = await getYahooRoster();

    let stats = {};

    for (let i = 0; i < roster.length; i++) {
        let player = roster[i];
        let player_key = player.player_key;
        
        // get the stats for the player
        let playerStats = await getPlayerStats(player_key);
        let player_name = playerStats.fantasy_content.league.players.player.name.full;
        let player_stats_detailed = labelStats(playerStats.fantasy_content.league.players.player.player_stats.stats.stat);


        stats[player_name] = player_stats_detailed;
    }

    return stats;
}

function labelStats(stats) {
    let stats_detailed = {};

    for (let i = 0; i < stats.length; i++) {
        let stat = stats[i];
        let stat_name = "";
        switch(stat.stat_id) {
            case '1': stat_name = "G"; break;
            case '2': stat_name = "A"; break;
            case '8': stat_name = "PPP"; break;
            case '14': stat_name = "SOG"; break;
            case '32': stat_name = "BLK"; break;
            case '19': stat_name = "W"; break;
            case '22': stat_name = "GA"; break;
            case '25': stat_name = "SV"; break;
            case '27': stat_name = "SHO"; break;

            default: stat_name = stat.stat_id; break;
        }

        stats_detailed[stat_name] = Number(stat.value);
    }

    return stats_detailed;
}

async function getPlayerStats(player_key) {
    let link = base_link + "/league/" + league_id + "/players;player_keys=" + player_key + "/stats";
    let stats = await getDataViaAjax(link, "GET");
    return stats;
}

async function getYahooPlayers() {
    
}

async function getLeagueStandings() {
    let link = base_link + "/league/" + league_id + "/standings";
    let standings = await getDataViaAjax(link, "GET");

    let standings_detailed = standings.fantasy_content.league.standings.teams.team;

    // order standings_detailed by team_standings.rank
    standings_detailed.sort((a, b) => {
        return a.team_standings.rank - b.team_standings.rank;
    });

    return standings_detailed;
}

async function getAllTeamsIWillFace() {

}



async function getNewAccessToken() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://api.login.yahoo.com/oauth2/get_token",
            type: "POST",
            data: {
                client_id: secrets.client_id,
                client_secret: secrets.client_secret,
                redirect_uri: secrets.redirect_uri,
                refresh_token: secrets.refresh_token,
                grant_type: "refresh_token"
            },
            success: function (response) {
                resolve(secrets.access_token = response.access_token);
            },
            error: function (error) {
                console.log("Error getting new access token");
                console.log(error);
            }
        });
    });
}

async function getDataViaAjax(link, type) {
    // get the access token, it will be updated in the secrets file
    await getNewAccessToken();
    // time delay to allow for the access token to be updated
    // await new Promise(r => setTimeout(r, 1000));

    return new Promise(function (resolve, reject) {
        $.ajax({
            url: link,
            type: type,
            headers: {
                "Authorization": "Bearer " + secrets.access_token,
                "Access-Control-Allow-Origin": "*"
            },
            success: function (data) {
                var json = xml2json(data, "  ");
                resolve(JSON.parse(json));
            },
            error: function (error) {
                console.log("Error getting data via AJAX request with link: " + link + " and type: " + type);
                console.log(error);
            }
        });
    });
}