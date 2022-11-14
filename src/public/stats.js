async function getStatsForRoster() {
    let stats = await getStatsForRosterFromTeamId(yahoo_constants.team_id);
    return stats;
}

async function getStatsForRosterFromTeamId(team_id) {
    let roster = await getRosterFromTeamId(team_id);
    let stats = new Map();

    for (let i = 0; i < roster.length; i++) {
        let player = roster[i];
        let player_key = player.player_key;
        let player_name = player.name.full;
        let player_stats = await getStatsForPlayerFromKey(player_key);
        
        stats.set(player_name, player_stats);
    }

    // order the stats by the value of FP
    let stats_ordered = new Map([...stats.entries()].sort((a, b) => b[1].FP - a[1].FP));

    return stats_ordered;
}

async function getStatsForPlayerFromKey(player_key) {
    let link = yahoo_constants.base_link + "/league/" + yahoo_constants.league_id + "/players;player_keys=" + player_key + "/stats";
    let stats = await getYahooData(link, "GET");
    let detailed_stats = labelStats(stats.fantasy_content.league.players.player.player_stats.stats.stat);
    let display_position = stats.fantasy_content.league.players.player.display_position;

    // add fantasy points converted to number
    detailed_stats["FP"] = Number(stats.fantasy_content.league.players.player.player_points.total);
    detailed_stats["display_position"] = display_position;

    return detailed_stats;
}


function labelStats(stats) {
    let stats_detailed = {};

    for (let i = 0; i < stats.length; i++) {
        let stat = stats[i];
        let stat_name = yahoo_nhl_stat_id_map[stat.stat_id];

        stats_detailed[stat_name] = Number(stat.value);
    }

    return stats_detailed;
}

async function testStatsMethods() {
    alertConsole("Testing Stats Methods");

    let stats = await getStatsForRoster();
    console.log(stats);

    let stats2 = await getStatsForRosterFromTeamId(8);
    console.log(stats2);

    alertConsole("End of Testing Stats Methods");
}