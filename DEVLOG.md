**Tuesday October 25, 2022**

Moved old (non yahoo-api) files to folder named "old" to start revamp.

Created new files:
- ajax (handle ajax requests)
- main (handle overall app functionality)
- ui (handle front end)
- verification (handle logging user in and getting new bearer tokens)
- CONSTANTS (self explanatory)
- league (get standings, league settings, manager info, matchups, and rosters from managers)
- roster (get current roster, get roster based on team id)
- schedule (get days a player plays on, get full schedule based on roster)
- stats (get stats for single player, get overall team stats)
- compare (compare 2 teams, compare 2 players)

These files are organized to all handle AJAX requests and serve the client through main.js and ui.js with requested data based on user input.

**Monday October 24, 2022**

Yahoo API Functionality:
- getYahooRoster
- getYahooMatchups
- getAllStatsFromPlayersOnRoster
- getLeagueStandings
- getAllRosters

Other Updates:
- switched to Ajax calls instead of previous xhttp
- cors issue (now fixed)

**Sunday October 23, 2022**

So I decided to get the Yahoo API setup and after OAuth being a pain for a while I managed to do the same amount of work in a single hour that I did all day on Friday. Lessons learned I guess.

It's really nice to have my roster accessible so easily without some crazy workarounds I was doing before. There isn't really a need to list the functionality as it's pretty much the same as before. I'm going to be sticking with the Yahoo API and will probably deprecate the NHL API implementation completely.

**Friday October 21, 2022**

It was a good first day getting everything setup and organized into types of functions. The functionality that was built today includes:
- Searching for a player by name
- Getting basic team data
- Getting the schedule for any team
- Saving and loading your roster from a list of names
- Getting the schedule for your roster
- Listing the amount of games you have on an individual day of the week for the current week
  - e.g., monday: 7, tuesday: 1, (meaning 7 players will be active on monday and 1 will be active on tuesday)