from typing import List

from jsonUtils import get_JSON
from nfl import NFLclasses,NFLutils

getGame: str = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event="



class League:
    league_id: int
    # year: int
    teams: List[NFLclasses.Team]



    def __init__(self, leagueID, data):
        self.teams = list()
        self.league_id = leagueID
        # clean Data to give list of teams
        data = data["sports"][0]["leagues"][0]["teams"]
        for team in data:
            # This exists :)
            newTeam = NFLclasses.Team(team["team"]["id"], team["team"]["abbreviation"], team["team"]["displayName"],
                           team["team"]["record"]["items"][0]["stats"][1]["value"],
                           team["team"]["record"]["items"][0]["stats"][2]["value"],
                           team["team"]["record"]["items"][0]["stats"][5]["value"],
                           team["team"]["record"]["items"][0]["stats"][15]["value"],
                           team["team"]["record"]["items"][0]["stats"][0]["value"], team["team"]["logos"][0]["href"])
            self.teams.append(newTeam)

        # Would have been located in NFLutils but I couldnt figure out how to Pass the League instance to everywhere

        # Populates each Team Schedule
        for curTeam in self.teams:
            # ITERATE THROUGH EACH TEAM IN LEAGUE
            eventIDlist = NFLutils.get_schedule(curTeam.team_id)

            # iterate through eventID list for each team to create Eventobj for each ID
            for id in eventIDlist:
                data = get_JSON(getGame + str(id))
                drives = list()
                # gets list of drives from JSON
                primitiveDrives = data["drives"]["previous"]

                # iterate through each Drive
                for drive in primitiveDrives:
                    #get List of plays for each Drive
                    primitivePlays = drive["plays"]
                    plays = list()

                    for play in primitivePlays:
                        # Another Crazy long JSON assignment
                        newPlay = NFLclasses.Play(play["text"], play["start"]["down"], play["start"]["distance"], play["start"]["yardLine"],
                                       play["end"]["down"], play["end"]["distance"], play["end"]["yardLine"],
                                       play["end"]["downDistanceText"], play["type"]["text"])
                    plays.append(newPlay)

                # New Drive Creation with really cool JSON assigment
                newDrive = NFLclasses.Drive(getTeambyABV(drive["team"]["abbreviation"]), plays, drive["displayResult"],
                                 drive["description"], drive["yards"], drive["isScore"])
                drives.append(newDrive)

                # gets teams list from JSON
                competitors = data["header"]["competitions"][0]["competitors"]

                #Finds out whos team is away and home
                for team in competitors:
                    if team["homeAway"] == "away":
                        awayTeam = team["id"]
                    if team["homeAway"] == "home":
                        homeTeam = team["id"]
            #get Scores for game by getting last scoringplays Scores list
            scoringPlays = data["scoringPlays"]
            awayScore = scoringPlays[-1]["awayScore"]
            homeScore = scoringPlays[-1]["homeScore"]
            newEvent = NFLclasses.Event(id, drives, homeTeam, awayTeam,homeScore,awayScore)


        curTeam.schedule.append(newEvent)


def getTeambyABV(abv):
    for team in League.teams:
        if abv == team.team_abbrev:
            return team


def getTeam(teamID):
    for team in League.teams:
        if teamID == team.team_id:
            return team

