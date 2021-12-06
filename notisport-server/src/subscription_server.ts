import ws from 'ws';

interface Webclient {
	uuid: string,
	webSocket: any
}

export class SubscriptionServer {

	m_serverName: string;
	m_connectedWebclients: Webclient[];
	m_wsServer: any;

	constructor(name: string, messageHandler: (webSocket: any, webclient: Webclient, incomingMessage: any) => void) {

		this.m_serverName = name;
		this.m_connectedWebclients = [];

		this.m_wsServer = new ws.Server({ noServer: true });

		this.wsServer.on('connection', (webSocket: any, webclient: any) => {

			//function heartbeat() {
				//console.log('Pong!');
			//	this.isAlive = true;
			//}

			webSocket.isAlive = true;
			webSocket.ping(function noop() { });

			//	Add client to Lobby
			//	Maybe we should check array to see if UUID exists?
			this.addWebclient(webclient);

			webSocket.on('message', (incomingMessage: any) => messageHandler(webSocket, webclient, incomingMessage));
			//webSocket.on('pong', heartbeat);

		});

		const heartbeatInterval = setInterval(() => {
			for (let i = 0; i < this.m_connectedWebclients.length; i++) {

				const webSocket = this.m_connectedWebclients[i].webSocket;

				if (webSocket.isAlive === false) {
					this.removeWebclient(this.m_connectedWebclients[i].uuid);
				} else {
					webSocket.isAlive = false;
					webSocket.ping(function noop() { });
				}

			}

		}, 30000);

		this.wsServer.on('close', () => {
			clearInterval(heartbeatInterval);
		});


	}

	get webclientCount() {
		return this.m_connectedWebclients.length;
	}

	get wsServer() {
		return this.m_wsServer;
	}

	addWebclient(webclient: Webclient) {
		return this.m_connectedWebclients.push(webclient);
	}

	removeWebclient(uuid: string) {
		const indexToRemove = this.m_connectedWebclients.findIndex(webclient => webclient.uuid === uuid);
		this.m_connectedWebclients.splice(indexToRemove, 1)[0].webSocket.terminate();
	}

	/*
	broadcastUpdate(updateType, identifier, payload) {

		if (updateType === SubscriptionServer.UPDATE_TYPES.SESSION) {

			const sessionUpdatePayload = payload;   //  prev

			if (sessionUpdatePayload !== null) {

				this.connectedWebclients.forEach(webclient => {

					webclient.webSocket.send(JSON.stringify({ subscription: "session", update: sessionUpdatePayload }));

				});

			}

		} else if (updateType === SubscriptionServer.UPDATE_TYPES.GROUP) {

			const groupUpdatePayload = payload;   //  prev

			if (groupUpdatePayload !== null) {

				this.connectedWebclients.forEach(webclient => {

					webclient.webSocket.send(JSON.stringify({ subscription: "group", update: groupUpdatePayload }));

				});

			}

		} else if (updateType === SubscriptionServer.UPDATE_TYPES.HOST) {


			const hostUpdatePayload = payload;   //  prev

			if (hostUpdatePayload !== null) {

				this.connectedWebclients.forEach(webclient => {

					webclient.webSocket.send(JSON.stringify(['_sub', 'host', hostUpdatePayload]));

				});

			}

		} else if (updateType === SubscriptionServer.UPDATE_TYPES.TAKE) {

			const takeUpdatePayload = payload;   //  prev

			if (takeUpdatePayload !== null) {

				this.connectedWebclients.forEach(webclient => {

					webclient.webSocket.send(JSON.stringify({ subscription: "take", update: takeUpdatePayload }));

				});

			}

		} else {
			//	error, unrecognized updateType parameter
		}

	}
	*/

	destroy() {
		//	Normally we would use this.c_wsServer.close()
		//	But since we are using an external HTTP server, we are just gonna kick each webclient out
		for (let i = 0; i < this.m_connectedWebclients.length; i++) {
			this.removeWebclient(this.m_connectedWebclients[i].uuid);
		}
	}

}
