const yahoo_constants = {
    base_link: "https://fantasysports.yahooapis.com/fantasy/v2/",
    league_id: "nhl.l.61609",
    team_id: "7",
}

const nhl_constants = {
    base_link: "https://statsapi.web.nhl.com/api/v1/",
}

const yahoo_nhl_stat_id_map = {
    0: 'GP', 1: 'G', 2: 'A', 3: 'PTS', 4: '+/-', 5: 'PIM',
    6: 'PPG', 7: 'PPA', 8: 'PPP', 12: 'GWG', 14: 'SOG', 15: 'S%',
    18: 'GS', 19: 'W', 20: 'L', 22: 'GA', 23: 'GAA',
    24: 'SA', 25: 'SV', 26: 'SV%', 27: 'SHO', 28: 'MIN', 32: 'BLK',
    1001: 'PPT', 1002: 'Avg-PPT', 1003: 'SHT', 1004: 'Avg-SHT',
    1005: 'COR', 1006: 'FEN', 1007: 'Off-ZS', 1008: 'Def-ZS',
    1009: 'ZS-Pct', 1010: 'GStr', 1011: 'Shifts'
}

function alertConsole(message) {
    console.log("");
    console.log("%c" + message, "font-weight: bold");
    console.log("");
}