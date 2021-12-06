class ExternalPromise {
	promise: Promise<any>;
	resolve: (value: any) => void;
	reject: (value: any) => void;


	constructor() {
		this.resolve = (_value: any) => {};	//	placeholder
		this.reject = (_value: any) => {};	//	placeholder

		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
}

export default class AutoPortWebSocket {

	m_socket: any;
	m_socketConnectedPromises: any;
	m_host: string;
	m_path: string;
	m_proxyOrReleasePort: number
	onopen: any;

	constructor(host: string, proxyOrReleasePortString: string, path: string, onopen: any) {
		this.m_socket = null;
		this.m_socketConnectedPromises = [];
		this.m_host = host;
		this.m_path = path;

		this.m_proxyOrReleasePort = 8080;
		if (proxyOrReleasePortString)
			
			this.m_proxyOrReleasePort = parseInt(proxyOrReleasePortString);

		this.onopen = onopen;
	}

	async getSocket()
	{

		// If already connected, return what we've got
		if (this.m_socket !== null)
			return this.m_socket;

		const socketConnectedPromise = new ExternalPromise();
		this.m_socketConnectedPromises.push(socketConnectedPromise);

		if (this.m_socketConnectedPromises.length === 1)
		{

			const socketOpened = new ExternalPromise();

			// otherwise, connect it
			const [ _ , socket ] = await getWebSocketConnection(this.m_host, this.m_proxyOrReleasePort, this.m_path);

			// We pass through the event handlers but know to continue when onopen() is called

			if (socket) {

				socket.onopen = (event: Event) => {

					if (this.onopen !== null)
					{
						// We set m_socket early, because the onopen handler will need it
						this.m_socket = socket;
						this.onopen(event);
					}
	
					socketOpened.resolve(1);
	
				}

			}
			

			// Wait for the open to finish
			await socketOpened.promise;

			for (const callerPromise of this.m_socketConnectedPromises)
			{
				callerPromise.resolve(socket);
			}

			// We're done calling them, so reset the array
			this.m_socketConnectedPromises = [];

		}

		const socket = await socketConnectedPromise.promise;

		this.m_socket = socket;

		return this.m_socket;

	}

}

function sleep(timeInMs: number)
{
	return new Promise(resolve => setTimeout(resolve, timeInMs));
}

function attemptWebSocketConnection(url: string)
{

	return new Promise<[ number, WebSocket | null ]>((resolve, reject) =>
	{

		let success = false;

		console.debug(`Attempting web socket connection to [${url}]`);

		let testSocket: WebSocket | null = null;

		testSocket = new WebSocket(url);

		testSocket.onclose = function (event)
		{
			console.debug(`Socket closed on connection attempt to [${url}]`);
			resolve([ -1, testSocket ]);
		}

		testSocket.onerror = function (event)
		{
			console.debug(`Socket error on connection attempt to [${url}]`);
			resolve([ -1, testSocket ]);
		}

		testSocket.onopen = function (event)
		{

			console.debug(`Socket opened on connection attempt to [${url}] ...\n`
				+ `  ... closing test socket and opening the found socket`);

			success = true;
			// close the test socket
			if (testSocket) {
				testSocket.onclose = null;
				testSocket.close();
			}

			// open and return the found socket
			const foundSocket = new WebSocket(url);
			resolve([0, foundSocket]);

		}

		// If we don't connect in 50ms, fail the connection
		sleep(500)
			.then( () =>
			{
				if (!success)
				{
					console.debug(`Timed out on connection attempt to [${url}]`);
					resolve([-1, testSocket]);
				}
			});

	});

}

async function getWebSocketConnection(host: string, proxyOrReleasePort: number, path: string): Promise<[ number, WebSocket | null ]>
{

	let candidateSocket = null;
	let rc = 0;

	const candidateURL = `ws://${host}:${proxyOrReleasePort}/${path}`;
	[ rc, candidateSocket ] = await attemptWebSocketConnection(candidateURL);

	return [ rc, candidateSocket ];

}
