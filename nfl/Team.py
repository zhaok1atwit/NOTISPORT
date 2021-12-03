from nfl.NFLclasses import *
from nfl.NFLutils import get_schedule


class Team:

    def __init__(self, teamID, teamAbr, teamName, Ws, Ls, Ts, currStreakLength, currStanding,
                 logo):
        self.team_id = teamID
        self.team_abbrev = teamAbr
        self.team_name = teamName
       # self.division_id = divID
       # self.division_name = divName
        self.wins = Ws
        self.losses = Ls
        self.ties = Ts
        #self.streak_type = streak
        self.streak_length = currStreakLength
        self.standing = currStanding
        self.logo_url = logo
        self.schedule = list()
        self.get_schedule(team_id)

    team_id: int
    team_abbrev: str
    team_name: str
    #division_id: str
    #division_name: str
    wins: int
    losses: int
    ties: int
    streak_type: str  # string of either WIN or LOSS
    streak_length: int  # how long the streak is for streak type
    standing: int  # standing before playoffs
    final_standings: int  # final standing at end of season
    logo_url: str
    #roster: list[Player]
    #These 3 variables will have the same index and match on those indexes
    schedule: list[Event]
    #scores: list[int]
