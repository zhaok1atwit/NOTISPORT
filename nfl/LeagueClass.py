import json
from typing import List
import re
from jsonUtils import get_JSON
from nfl.NFLclasses import Drive,Play,Event,Team

getGame: str = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event="
getTeams: str = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?limit=35"


def get_league():
    data = get_JSON(getTeams)
    # get league id and create league obj
    newLeague = League(data["sports"][0]["leagues"][0]["id"], data)
    return newLeague


def get_schedule(teamID):
    # URL below is just template must insert teamID
    getTeamSchedule: str = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/teamID/schedule"
    # replaces "teamID" with the given teamsID

    getTeamSchedule = re.sub("teamID", str(teamID), getTeamSchedule, 1)
    data = get_JSON(getTeamSchedule)
    # go deeper into JSON
    data = data["events"]
    eventIDList = list()
    # gets all event Ids
    for event in data:
        eventIDList.append(event["id"])
    return eventIDList


class League:
    league_id: int
    # year: int
    teams: List[Team]



    def __init__(self, leagueID, data):
        self.teams = list()
        self.league_id = leagueID
        # clean Data to give list of teams
        data = data["sports"][0]["leagues"][0]["teams"]
        for team in data:
            # This exists :)
            newTeam = Team(team["team"]["id"], team["team"]["abbreviation"], team["team"]["displayName"],
                           team["team"]["record"]["items"][0]["stats"][1]["value"],
                           team["team"]["record"]["items"][0]["stats"][2]["value"],
                           team["team"]["record"]["items"][0]["stats"][5]["value"],
                           team["team"]["record"]["items"][0]["stats"][15]["value"],
                           team["team"]["record"]["items"][0]["stats"][0]["value"], team["team"]["logos"][0]["href"])
            self.teams.append(newTeam)

        # Would have been located in NFLutils but I couldnt figure out how to Pass the League instance to everywhere

        # Populates each Team Schedule
        for curTeam in self.teams:
            print("Getting Schedule for: " + curTeam.team_abbrev)
            # ITERATE THROUGH EACH TEAM IN LEAGUE
            eventIDlist = get_schedule(curTeam.team_id)

            # iterate through eventID list for each team to create Eventobj for each ID
            for id in eventIDlist:
                data = get_JSON(getGame + str(id))
                drives = list()
                # gets list of drives from JSON
                try:
                    primitiveDrives = data["drives"]["previous"]

                    # iterate through each Drive
                    for drive in primitiveDrives:

                        #get List of plays for each Drive
                        primitivePlays = drive["plays"]
                        plays = list()

                        for play in primitivePlays:
                            # Another Crazy long JSON assignment
                            try:
                                newPlay = Play(play["text"], play["start"]["down"], play["start"]["distance"],
                                               play["start"]["yardLine"],
                                               play["end"]["down"], play["end"]["distance"], play["end"]["yardLine"],
                                               play["end"]["downDistanceText"], play["type"]["text"])

                            except KeyError:
                                newPlay = Play(play["text"], play["start"]["down"], play["start"]["distance"],
                                               play["start"]["yardLine"],
                                               play["end"]["down"], play["end"]["distance"], play["end"]["yardLine"],
                                               "", play["type"]["text"])


                            plays.append(newPlay)

                        # New Drive Creation with really cool JSON assigment

                        newTeam = self.getTeamByABV(drive["team"]["abbreviation"])
                        newTeamID = newTeam.team_id
                        newDrive = Drive(newTeamID, plays, drive["displayResult"],
                                         drive["description"], drive["yards"], drive["isScore"])
                        drives.append(newDrive)

                    # gets teams list from JSON
                    competitors = data["header"]["competitions"][0]["competitors"]

                    #Finds out whos team is away and home
                    for team in competitors:
                        if team["homeAway"] == "away":
                            awayTeam = int(team["id"])
                        if team["homeAway"] == "home":
                            homeTeam = int(team["id"])
                    #get Scores for game by getting last scoringplays Scores list
                    scoringPlays = data["scoringPlays"]
                    awayScore = scoringPlays[-1]["awayScore"]
                    homeScore = scoringPlays[-1]["homeScore"]
                    newEvent = Event(id, drives, homeTeam, awayTeam, homeScore, awayScore, self)
                    curTeam.schedule.append(newEvent)
                    print("Got GAME! id: "+str(newEvent.event_id))
                except KeyError:
                    # Future games that havent been played yet
                    competitors = data["header"]["competitions"][0]["competitors"]
                    for team in competitors:
                        if team["homeAway"] == "away":
                            awayTeam = int(team["id"])
                        if team["homeAway"] == "home":
                            homeTeam = int(team["id"])
                                        #Drives will be empty
                    newEvent = Event(id, drives, homeTeam, awayTeam,homeScore,awayScore,self)
                    print("Got GAME! id: " + str(newEvent.event_id))
                    curTeam.schedule.append(newEvent)


    def getTeamByABV(self,abv):
        for team in self.teams:
            if team.team_abbrev==abv:
                return team


    def getTeam(self,teamid):
        for team in self.teams:
            if teamid == team.team_id:
                return team

