// src/matchMaker.ts
import { DurableObject } from 'cloudflare:workers';
import type { DurableObjectState } from '@cloudflare/workers-types';

export class MatchMaker extends DurableObject {
	private connections: Map<string, WebSocket> = new Map();

	constructor(state: DurableObjectState, env: any) {
		super(state, env);
		this.state = state;
	}

	private state: DurableObjectState;

	async initialize(): Promise<void> {
		await this.state.blockConcurrencyWhile(async () => {
			console.log('Executing: CREATE TABLE deployed_robots');
			this.state.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS deployed_robots (
          public_key TEXT PRIMARY KEY,
          deployed_at INTEGER NOT NULL
        )
      `);
			console.log('Executing: CREATE TABLE elo_ratings');
			this.state.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS elo_ratings (
          public_key TEXT PRIMARY KEY,
          rating INTEGER NOT NULL DEFAULT 1500,
          updated_at INTEGER NOT NULL
        )
      `);
		});
	}

	async fetch(request: Request): Promise<Response> {
		await this.initialize();

		const url = new URL(request.url);
		const publicKey = url.searchParams.get('public_key');

		if (!publicKey) {
			return new Response("Missing 'public_key' parameter", { status: 400 });
		}

		if (request.headers.get('Upgrade') === 'websocket') {
			const pair = new WebSocketPair();
			const [client, server] = [pair[0], pair[1]] as const;

			server.accept();
			this.connections.set(publicKey, server);

			server.addEventListener('message', (event) => {
				server.send(`Echo: ${event.data}`);
			});

			server.addEventListener('close', () => {
				this.connections.delete(publicKey);
			});

			return new Response(null, { status: 101, webSocket: client });
		}

		return new Response('Expected WebSocket', { status: 426 });
	}
}
