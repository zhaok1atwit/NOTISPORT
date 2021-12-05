import urllib.request, json
import json
from pymongo import MongoClient
from jsonUtils import json_parsing
import jsonpickle
from nfl.LeagueClass import get_league
#request = urllib.request.urlopen("https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams")
#data = json.load(request)
#data = data["sports"][0]["leagues"][0]["teams"]

#for team in data:
    #print(team["team"]["id"])
#mongo = MongoClient("mongodb://myUserAdmin:Happykid60@ec2-23-22-81-62.compute-1.amazonaws.com:27017/")
#db = mongo["NFL"]
#collection = db["league"]

league = get_league()
print("Done!")
for team in league.teams:
    #Turns each team into JSON
    newJSON = jsonpickle.encode(team,unpicklable=False,separators=(',',':'))
    fileName = team.team_abbrev + ".json"
    with open(fileName, "w") as f:
        print(newJSON, file=f)

    #JSONdata = json.load(newJSON)

    #for k, v in JSONdata.items():
      #  collection.insert_one(v)


#newJSON = jsonpickle.encode(league,unpicklable=False,separators=(',', ':'))

