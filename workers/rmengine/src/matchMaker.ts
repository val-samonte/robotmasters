import { DurableObject } from 'cloudflare:workers';

export class MatchMaker extends DurableObject {
	private connections: Map<string, WebSocket> = new Map(); // publicKey -> WebSocket

	constructor(private state: DurableObjectState, env: any) {
		super(state, env);
	}

	async initialize(): Promise<void> {
		this.state.blockConcurrencyWhile(() => {
			this.state.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS deployed_robots (
          public_key TEXT PRIMARY KEY,
          deployed_at INTEGER NOT NULL
        )
      `);
			this.state.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS elo_ratings (
          public_key TEXT PRIMARY KEY,
          rating INTEGER NOT NULL DEFAULT 1500,
          updated_at INTEGER NOT NULL
        )
      `);
			return Promise.resolve();
		});
	}

	async fetch(request: Request): Promise<Response> {
		await this.initialize();

		const url = new URL(request.url);
		const publicKey = url.searchParams.get('public_key');

		if (!publicKey) {
			return new Response("Missing 'public_key' parameter", { status: 400 });
		}

		// WebSocket connection
		if (request.headers.get('Upgrade') === 'websocket') {
			const pair = new WebSocketPair();
			const [client, server] = Object.values(pair);
			server.accept();

			this.connections.set(publicKey, server);

			server.addEventListener('message', (event) => {
				server.send(`Echo: ${event.data}`); // Placeholder for future API
			});

			server.addEventListener('close', () => {
				this.connections.delete(publicKey);
			});

			return new Response(null, { status: 101, webSocket: client });
		}

		return new Response('Expected WebSocket', { status: 426 });
	}
}
