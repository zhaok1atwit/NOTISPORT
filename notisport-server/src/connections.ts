import { SubscriptionServer } from "./subscription_server";
import { Collection, Db, MongoClient } from "mongodb";

import { v4 as uuidv4 } from 'uuid';

import { verifyNFLRequest } from '../api/nfl_api';

const MONGO_SERVER_URL = 'mongodb://ec2-23-22-81-62.compute-1.amazonaws.com:27017/';

const LOBBY_PERMISSIONS = Object.freeze({
	NONE: 0,
	LIST: 1,
	CREATE: 2,
	DESTROY: 3
});

var mongoNFL_DB: Db;
var mongoNFL_Collection: Collection<Document>;


const nflSubscriptionServer = new SubscriptionServer('nfl', nflMessageHandler);





//mongoClient.connect()
//.then(() => mongoClient.db('NFL'))
//.then(db => db.collection('league'))
//.then(collection => console.log(collection.find().toArray()))

export async function initMongoDB(){

	console.log('hello')
	const mongoClient = new MongoClient(MONGO_SERVER_URL);

	await mongoClient.connect();

	mongoNFL_DB = mongoClient.db('NFL');

	mongoNFL_Collection = mongoNFL_DB.collection('league');

	//const teams = await getTeams();
	//console.log(teams);
	//console.log(await getLastGames(10));
	//mongoNFL_Collection.find().toArray()
	//.then((yeet) => console.log(yeet))

	//	console.log();

}


export function authenticateClient(request: any, socket: any, head: any, route: any) {

	//	<Authentication Logic Here>
	//	For now we don't have any user DB set up so any user that joins shall be assigned default perms

	nflSubscriptionServer.wsServer.handleUpgrade((request: any, socket: any, _head: never, webSocket: any) => {

		const webclient = {
			uuid: uuidv4(),
			socket: socket,
			ip: request.socket.remoteAddress,
			permissions: LOBBY_PERMISSIONS.LIST,
			session: null,
			webSocket: webSocket
		};

		//m_log.info(`[Lobby] newLobbyUser=${webclient.uuid.substring(0, 8)} (${webclient.uuid}) ip=${webclient.ip}`);

		nflSubscriptionServer.wsServer.emit('connection', webSocket, webclient);

	});

}

interface ApiSwitch {
	[command: string]: (requestParameters: any, webclient: any) => Promise<any>;
}

function nflMessageHandler(webSocket: any, webclient: any, incomingMessage: any) {

	const errorResponse = (apiError: any, reqID: number) => {
		return JSON.stringify([
			reqID,
			{ error: apiError.name, msg: apiError.message }
		]);
	};

	/** [ <cmd>, <reqID>, { <payload> } ] */
	const parsedMessage = JSON.parse(incomingMessage);

	const [ isFlawedRequest, error ] = verifyNFLRequest(parsedMessage);
	if (isFlawedRequest) {
		webSocket.send(errorResponse(error, parsedMessage[1]));
		return;
	}

	//m_log.info(`[LobbyAPI] cmd=${parsedMessage[0]} user=${webclient.uuid.substring(0, 8)}`);
	const NFL_API_SWITCH: ApiSwitch = Object.freeze({
		//'host_list': () => hostList(),

		//'session_list': () => sessionList(),
		//'session_join': (requestParameters, webclient) => m_sessions.joinSession(requestParameters.sessionID, webclient.uuid),
		//'session_create': (requestParameters) => m_sessions.createSession(requestParameters.sessionName, requestParameters.clientName, requestParameters.layout),
		//'session_start': async (requestParameters) => m_sessions.startSession(requestParameters.sessionID),
		//'session_update': (requestParameters) => m_sessions.updateSession(requestParameters.sessionID, requestParameters.layout),
		//'session_stop': (requestParameters) => m_sessions.stopSession(requestParameters.sessionID)
	});

	NFL_API_SWITCH[parsedMessage[0]](parsedMessage[2], webclient)
	.then(response => {
		webSocket.send(JSON.stringify([parsedMessage[1], { response: response } ]));
		if (parsedMessage[0] === 'session_join') {
			//	Remove webclient from Lobby subscription server.
			nflSubscriptionServer.removeWebclient(webclient.uuid);
		}

	})
	.catch(error => webSocket.send(errorResponse(error, parsedMessage[1])))

}

interface NFLTeam {
	id: number,
	abbrev: string,
	name: string,
	wins: number,
	losses: number,
	ties: number,
	standing: number,
	logo_url: string
}

async function getTeams(): Promise<NFLTeam[]> {

	const teams = await mongoNFL_Collection.find().toArray();

	return teams.map((team: any) => {

		return {
			id: team.team_id,
			abbrev: team.team_abbrev,
			name: team.team_name,
			wins: team.wins,
			losses: team.losses,
			ties: team.ties,
			standing: team.standing,
			logo_url: team.logo_url
		}

	});

}

interface NFLEvent {
	id: number,
	drives: any[],
	home_team: number,
	away_team: number,
	awayScore: number,
	homeScore: number,
	date: Date
}

async function getLastGames(count: number) {

	const teams = await mongoNFL_Collection.find().toArray();

	const allTeamEventsRaw = teams.flatMap((team: any) => team.schedule);

	const allTeamEventIDs: number[] = [];
	const allTeamEvents: NFLEvent[] = [];

	for (let i = 0; i < allTeamEventsRaw.length; i++) {

		if (allTeamEventIDs.includes(allTeamEventsRaw[i].event_id)){
			break;
		}

		const nflEvent: NFLEvent = {
			id: allTeamEventsRaw[i].event_id,
			drives: allTeamEventsRaw[i].drives,
			home_team: allTeamEventsRaw[i].home_team,
			away_team: allTeamEventsRaw[i].away_team,
			awayScore: allTeamEventsRaw[i].awayScore,
			homeScore: allTeamEventsRaw[i].homeScore,
			date: new Date(allTeamEventsRaw[i].date) 
		};


		allTeamEvents.push(nflEvent);
		allTeamEventIDs.push(nflEvent.id);

	}

	allTeamEvents.sort((eventA, eventB) => eventB.date.valueOf() - eventA.date.valueOf());

	return allTeamEvents.slice(0, count);

}
