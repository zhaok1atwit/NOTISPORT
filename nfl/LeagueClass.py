from typing import List

from nfl.NFLclasses import Team
from nfl.NFLutils import get_schedule


class League:
    league_id: int
    #year: int
    teams: List[Team]

    def __init__(self, leagueID,data):
        self.teams = list()
        self.league_id=leagueID
        #clean Data to give list of teams
        data = data["sports"][0]["leagues"][0]["teams"]
        for team in data:
            #This exists :)
            newTeam = Team(team["team"]["id"],team["team"]["abbreviation"],team["team"]["displayName"],team["team"]["record"]["items"][0]["stats"][1]["value"],team["team"]["record"]["items"][0]["stats"][2]["value"],team["team"]["record"]["items"][0]["stats"][5]["value"],team["team"]["record"]["items"][0]["stats"][15]["value"],team["team"]["record"]["items"][0]["stats"][0]["value"],team["team"]["logos"][0]["href"])
            self.teams.append(newTeam)


