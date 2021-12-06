import { authenticateClient, initMongoDB } from "./connections";
import http from 'http';
import express from 'express';
const app = express();
import path from 'path';
import url from 'url';

const PORT = 8080;

async function init() {

	const httpServer = http.createServer(app);

	httpServer.on('upgrade', (request: any, socket: any, head: any) => {

		const route = url.parse(request.url).pathname;
		authenticateClient(request, socket, head, route);

	});

	httpServer.listen(PORT);

	console.log(`Started listening on port ${PORT}`);

	return;

}

init()
.then(() => initMongoDB());
