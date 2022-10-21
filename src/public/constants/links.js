let links = {
    "root" : "https://statsapi.web.nhl.com/",
    "teams" : {
        "root": "https://statsapi.web.nhl.com/api/v1/teams/",

        "modifier" : {
            "roster" : "?expand=team.roster",
            "names" : "?expand=person.names",

            "stats" : "?expand=team.stats",
            "stats-from-season" : "?expand=team.roster&season=",

            "scheduling" : {
                "next" : "?expand=team.schedule.next",
                "prev" : "?expand=team.schedule.previous"
            }
        }
    },
    
    "people" : {
        "root" : "https://statsapi.web.nhl.com/api/v1/people/",

        "modifier" : {
            
        }
    },

    "game" : {
        "root" : "https://statsapi.web.nhl.com/api/v1/game/",

        "live-feed" : "feed/live",
        "box-score" : "boxscore",
        "line-score" : "linescore",
        "content" : "content"
    },

    "divisions" : {
        "root" : "https://statsapi.web.nhl.com/api/v1/divisions/"
    },

    "conferences" : {
        "root" : "https://statsapi.web.nhl.com/api/v1/conferences/"
    }
}
