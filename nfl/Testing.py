import urllib.request, json

from jsonUtils import json_parsing

#request = urllib.request.urlopen("https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams")
#data = json.load(request)
#data = data["sports"][0]["leagues"][0]["teams"]

#for team in data:
    #print(team["team"]["id"])
from nfl.NFLutils import get_league

get_league()