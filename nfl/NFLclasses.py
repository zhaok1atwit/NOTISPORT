from nfl.Team import Team


#class Player:
  #  name: str
   # playerId: int
  #  posRank: int # players positional rank
   # eligibleSlots: list[str] # example ['WR', 'WR/TE/RB']
   # acquisitionType: str
  #  proTeam: str # 'PIT' or 'LAR'
   # injuryStatus: str
    #injured: bool
    #total_points: int # players total points during the season
    #projected_total_points: int


class playDetails:
    down: int
    distance: int
    yardLine: int
    yardsTillEndzone: int


class playType:
    playId: int
    text: str
    abv: str


class Play:
    playType: playType
    scoringPlay: bool
    start: playDetails
    end: playDetails
    playResultText: str
    awayScore: int
    homeScore: int

#class Drive:
 #   currentPos: Team
   # plays: list[Play]
   # result: str
  #  endInScore: bool


class Event:
    def __init__(self,eventID):
        self.event_id = eventID
        self.previous_drives = list()
        self.current_drives = list()


    event_id: int
    home_hasPos: bool
    home_team: Team
    away_team: Team
    away_hasPos: bool
    previous_drives: list[Drive]
    current_drives: list[Drive]











    



