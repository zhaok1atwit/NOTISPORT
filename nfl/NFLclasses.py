class Team:
    team_id: int
    team_abbrev: str
    team_name: str
    division_id: str
    division_name: str
    wins: int
    losses: int
    ties: int
    streak_type: str # string of either WIN or LOSS
    streak_length: int # how long the streak is for streak type
    standing: int # standing before playoffs
    final_standings: int # final standing at end of season
    logo_url: str
    roster: list[Player]
    # These 3 variables will have the same index and match on those indexes
    schedule: list[Event]
    scores: list[int]


class League:
    league_id: int
    year: int
    teams: list[Team]
    nfl_week: int # current nfl week


class playDetails:
    down: int
    distance: int
    yardLine: int
    yardsTillEndzone: int


class Play:
    playType: playType
    scoringPlay: bool
    start: playDetails
    end: playDetails
    playResultText: str
    awayScore: int
    homeScore: int
    
class playType:
    playId: int
    text: str
    abv: str

class Drive:
    currentPos: Team
    plays: list[Play]
    result: str
    endInScore: bool

class Event:
    event_id: int

    home_hasPos: bool
    home_team: Team
    
    away_team: Team
    away_hasPos: bool
    previous_drives:list[Drive]
    current_drives:list[Drive]


class Player:
    name: str
    playerId: int
    posRank: int # players positional rank
    eligibleSlots: list[str] # example ['WR', 'WR/TE/RB']
    acquisitionType: str
    proTeam: str # 'PIT' or 'LAR'
    position: str # main position like 'TE' or 'QB'
    injuryStatus: str
    injured: bool
    total_points: int # players total points during the season
    projected_total_points: int



    



