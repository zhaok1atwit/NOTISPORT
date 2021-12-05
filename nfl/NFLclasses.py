
from typing import List


from nfl import LeagueClass


class Play:
    type: str
    desc: str
    startDown: int
    startDistatnce: int
    startYardage: int

    endDown: int
    endDistance: int
    endYardage: int
    endDownDistanceText: str

    def __init__(self, desc, sDown, sDistance, sYardage, eDown, eDistance, eYardage, eDownDistanceText,
                 playType):
        self.desc = desc
        self.startDown = sDown
        self.startDistance = sDistance
        self.startYardage = sYardage

        self.endDown = eDown
        self.endDistance = eDistance
        self.endYardage = eYardage
        self.endDownDistanceText = eDownDistanceText

        self.type = playType


class Drive:
    endInScore: bool

    currentPos: int  #teamID
    plays: List[Play]
    desc: str
    totalDistance: int
    result: str

    def __init__(self, team, plays, result, desc, dist, boolScore):
        self.currentPos = team
        self.plays = plays
        self.desc = desc
        self.result = result
        self.totalDistance = dist
        self.endInScore = boolScore


class Event:
    def __init__(self, eventID, drives, homeTeam, awayTeam,homeScore,awayScore,currLeague):
        self.event_id = int(eventID)
        self.drives = drives
        self.home_team = homeTeam #Team(homeTeam.team_id,homeTeam.team_abbrev,homeTeam.team_name,homeTeam.wins,homeTeam.losses,homeTeam.ties,homeTeam.streak_length,homeTeam.standing,homeTeam.logo_url)
        self.away_team = awayTeam
        self.awayScore = awayScore
        self.homeScore = homeScore

    event_id: int
    home_team: int #TeamIDs
    homeScore: int
    away_team: int #TeamIDs
    awayScore: int
    drives: List[Drive]

class Team:

    def __init__(self, teamID, teamAbr, teamName, Ws, Ls, Ts, currStreakLength, currStanding,
                 logo):

        self.team_id = int(teamID)
        self.team_abbrev = teamAbr
        self.team_name = teamName
        # self.division_id = divID
        # self.division_name = divName
        self.wins = Ws
        self.losses = Ls
        self.ties = Ts
        # self.streak_type = streak
        self.streak_length = currStreakLength
        self.standing = currStanding
        self.logo_url = logo
        self.schedule = list()
    def get_teamID(self):
        return self.team_id

    team_id: int
    team_abbrev: str
    team_name: str
    # division_id: str
    # division_name: str
    wins: int
    losses: int
    ties: int
    streak_type: str  # string of either WIN or LOSS
    streak_length: int  # how long the streak is for streak type
    standing: int  # standing before playoffs
    final_standings: int  # final standing at end of season
    logo_url: str
    # roster: list[Player]
    # These 3 variables will have the same index and match on those indexes
    schedule: List[Event]
    # scores: list[int]







# class Player:
#  name: str
# playerId: int
#  posRank: int # players positional rank
# eligibleSlots: list[str] # example ['WR', 'WR/TE/RB']
# acquisitionType: str
#  proTeam: str # 'PIT' or 'LAR'
# injuryStatus: str
# injured: bool
# total_points: int # players total points during the season
# projected_total_points: int
