// general js and json
let helpers = "js/helpers/";
let constants = "js/data/constants/";

// data specific js
let games = "js/data/games/";
let players = "js/data/players/";
let teams = "js/data/teams/";
let tournaments = "js/data/tournaments/";

let filePaths = [
    constants + "links",
    helpers + "validateInput",
    helpers + "getData",

    teams + "singleTeam",

    players + "singlePlayer",

    "js/main"
]

// add js extension (improves readability in filePaths array)
for (let i = 0; i < filePaths.length; i++) {
    filePaths[i] += ".js";
}

// export filePaths
export default filePaths;