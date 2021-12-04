
import re
from jsonUtils import get_JSON, json_parsing
from nfl.LeagueClass import League


#Endpoints
getGame: str = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event="
getTeams: str = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams"

getTeamSchedule: str = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/teamID/schedule"


def get_league():
   data = get_JSON(getTeams)
   #get league id and create league obj
   newLeague = League(data["sports"][0]["leagues"][0]["id"],data)


def get_schedule(teamID):
   # URL below is just template must insert teamID
   getTeamSchedule: str = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/teamID/schedule"
   #replaces "teamID" with the given teamsID

   getTeamSchedule = re.sub("teamID", str(teamID), getTeamSchedule,1)
   data = get_JSON(getTeamSchedule)
   #go deeper into JSON
   data = data["events"]
   eventIDList = list()
   #gets all event Ids
   for event in data:
      eventIDList.append(event["id"])

   return eventIDList








