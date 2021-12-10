from jsonUtils import get_JSON




getGame: str
getTeams: str = "http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams"



def get_NBAleague():
    data = get_JSON(getTeams)
    parsedData = data["sports"][0]["leagues"][0]["teams"]
    newLeague = NBALeague(data["sports"][0]["leagues"][0]["id"],parsedData)



class Event:
    homeTeamID: int
    awayTeamID: int
    homeTeamScore: int
    awayTeamSore: int
    date: str
    stats: dict[]
    winner: str


class Team:
    team_id: int
    team_name: str
    wins: int
    losses: int
    ties: int
    logo: str
    schedule: [Event]
    team_abbrev: str
    playoff_seed: int
    def __init__(self,teamID,teamABV,teamName,Ws,Ls,Ts,POseed,logoURL):
        self.schedule = list()
        self.team_id = teamID
        self. team_abbrev = teamABV
        self.team_name = teamName
        self.wins = Ws
        self.losses = Ls
        self.ties = Ts
        self.playoff_seed = POseed
        self.logo = logoURL


class NBALeague:

    teams = list[Team]
    leagueID: int

    def __init__(self,leagueID,data):
        self.teams = list()
        self.leagueID = leagueID

        for team in data:
            newTeam = Team(team["id"],team["abbreviation"],team["name"],int(team["record"]["items"]["stats"][1]),int(team["record"]["items"]["stats"][2]),            newTeam = Team(team["id"],team["abbreviation"],team["name"],int(team["record"]["items"]["stats"][1]["value"]),int(team["record"]["items"]["stats"][2]["value"]),int(team["record"]["items"]["stats"][5]["value"]),int(team["record"]["items"]["stats"][0]["value"]),team["logos"][0]["href"])
)

