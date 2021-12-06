import APWebSocket from './APWebSocket';

const MAX_REQUESTS = 128;

class NotiSportAPIRequest {
	payload: any;
	promise: Promise<any>;
	resolve: (value: any) => void;
	reject: (value: any) => void;

	constructor(payload: any) {
		this.payload = payload;
		this.resolve = (_value: any) => {};	//	placeholder
		this.reject = (_value: any) => {};	//	placeholder

		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
}

type ActiveRequest = {
	index: number,
	request: NotiSportAPIRequest | null
}

export class NFLAPIConnection {

	m_availableRequests: number[];
	m_activeRequests: ActiveRequest[];
	m_pendingRequests: ActiveRequest[];
	m_exitPromise: any;
	exitResolve: any;
	sessionUpdateHandler: any;
	m_webSocket: any;
	m_autoPortWebSocket: APWebSocket;

	constructor(sessionUpdateHandler: any) {

		this.m_availableRequests = [];
		this.m_activeRequests = [];
		this.m_pendingRequests = [];
		this.m_exitPromise = null;
		this.exitResolve = null;
		this.sessionUpdateHandler = sessionUpdateHandler;
		this.m_webSocket = null;

		// Fill availableRequests with indexes in descending order.
		// Fill activeRequests with empty requests (indexes in ascending order)
		for (let i = MAX_REQUESTS - 1; i >= 0; i--) {
			this.m_availableRequests.push(i);
			this.m_activeRequests.push({ index: (MAX_REQUESTS - 1 - i), request: null });
		}

		this.onWebSocketOpen = this.onWebSocketOpen.bind(this);

		const host = window.location.hostname;
		const port = window.location.port;
		const path = "";
		this.m_autoPortWebSocket = new APWebSocket(host, port, path, this.onWebSocketOpen);

	}

	getSocket() {
		return this.m_autoPortWebSocket.getSocket();
	}

	onWebSocketOpen(_event: Event)
	{
		// The socket is open.  If we have pending requests, send them
		if (this.m_pendingRequests.length > 0) {
			// If there is a Queue of messages waiting to be sent, send one.
			const pendingRequest = this.m_pendingRequests.shift();

			if (pendingRequest && pendingRequest.request){
				this.m_webSocket.send(JSON.stringify(pendingRequest.request.payload));
			}
			
		}
	}

	allocateRequest() {
		let request = null;
		if (this.m_availableRequests.length > 0) {

			const availableRequestIndex = this.m_availableRequests.pop();

			// availableRequestIndex should not be undefined since we check the length of the array.
			if (availableRequestIndex){
				request = this.m_activeRequests[availableRequestIndex];
			}

		}
		return request;
	}

	endJob(reqID: number) {
		this.m_availableRequests.push(reqID);
	}

	exitLobby() {
		return new Promise(resolve => {
			this.m_webSocket.close();
			this.m_exitPromise = new Promise(resolve => this.exitResolve = resolve);
			this.m_exitPromise.then(() => resolve);
		});
	}
}

export async function listTeams(nflAPIConnection: NFLAPIConnection) {
	console.debug("Calling listTeams..");
	return await lobbyAPI(nflAPIConnection, 'teams_list', {});
}

export async function listEvents(nflAPIConnection: NFLAPIConnection, count: number) {
	console.debug("Calling listEvents..");
	return await lobbyAPI(nflAPIConnection, 'events_list', { count });
}


async function lobbyAPI(nflAPIConnection: NFLAPIConnection, cmd: string, parameters: any) {

	const allocatedRequest = nflAPIConnection.allocateRequest();

	if (allocatedRequest === null) {

		console.error(new Error('Unable to allocate job.'));

	} else {

		const payload = [
			cmd,
			allocatedRequest.index,
			parameters
		];

		allocatedRequest.request = new NotiSportAPIRequest(payload);

		// This waits for the socket to open
		nflAPIConnection.m_webSocket = await nflAPIConnection.m_autoPortWebSocket.getSocket();

		nflAPIConnection.m_webSocket.onclose = (_wsCloseEvent: Event) => {
			if (nflAPIConnection.exitResolve !== null) {
				nflAPIConnection.exitResolve();
			} else {

				console.warn('Potentially unexpected lobby exit');
			}
		}

		nflAPIConnection.m_webSocket.onmessage = (wsMessageEvent: any) => {

			const message = JSON.parse(wsMessageEvent.data);

			const messageRequestID = message[0];

			if (messageRequestID !== undefined) {

				const messageResponse = message[1].response;

				const messageRequest = nflAPIConnection.m_activeRequests[messageRequestID].request;

				if (messageRequest){

					if (messageResponse === undefined && message.error !== undefined) {
						messageRequest.reject(message.error);
					} else {
						messageRequest.resolve(messageResponse);
					}

				}

				nflAPIConnection.endJob(messageRequestID);

			} else if (message.subscription !== undefined) {

				if (message.subscription === "session") {
					nflAPIConnection.sessionUpdateHandler(message.update);
				}

			} else {
				console.warn('Unknown message type');
				console.warn(message);
			}

			if (nflAPIConnection.m_pendingRequests.length > 0) {
				// If there is a Queue of messages waiting to be sent, send one.
				const pendingRequest = nflAPIConnection.m_pendingRequests.shift();

				if (pendingRequest && pendingRequest.request) {
					nflAPIConnection.m_webSocket.send(JSON.stringify(pendingRequest.request.payload));
				}
				
			}

		}

		nflAPIConnection.m_webSocket.send(JSON.stringify(allocatedRequest.request.payload));

		return allocatedRequest.request.promise;

	}

}
