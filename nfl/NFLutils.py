
import re
from jsonUtils import get_JSON, json_parsing
from nfl.LeagueClass import League
from nfl.NFLclasses import Event

#Endpoints
getGame: str = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event="
getTeams: str = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams"
# URL below is just template must insert teamID
getTeamSchedule: str = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/teamID/schedule"


def get_league():

   data = get_JSON(getTeams)
   #get league id and create league obj
   newLeague = League(data["sports"][0]["leagues"][0]["id"],data)


def get_schedule(teamID):
   #replaces "teamID" with the given teamsID
   getTeamSchedule = re.sub("(teamID)",str(teamID))

   data = get_JSON(getTeamSchedule)
   #go deeper into JSON
   data = data["events"]
   eventIDList = list()
   eventsObjList= list()
   #gets all event Ids
   for event in data:
      eventIDList.append(event["id"])

   eventsObjList = get_events(eventIDList)

def get_events(eventIDList):
   for id in eventIDList:
      data = get_JSON(getGame+str(id))






