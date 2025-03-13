// src/sessionStore.ts
import bs58 from 'bs58';
import { DurableObject } from 'cloudflare:workers';
import type { DurableObjectState } from '@cloudflare/workers-types';

export class SessionStore extends DurableObject {
	constructor(state: DurableObjectState, env: any) {
		super(state, env);
		this.state = state;
	}

	private state: DurableObjectState;
	private initialized = false;

	// src/sessionStore.ts (partial)
	async initialize(): Promise<void> {
		if (this.initialized) return;
		try {
			await this.state.blockConcurrencyWhile(async () => {
				if (this.initialized) return;
				console.log('Executing: CREATE TABLE sessions');
				this.state.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
          public_key TEXT PRIMARY KEY,
          nonce TEXT NOT NULL,
          token TEXT,
          created_at INTEGER NOT NULL,
          expires_at INTEGER
        )
      `);
				this.initialized = true;
				console.log('Sessions table initialized');
			});
		} catch (error) {
			console.error('Failed to initialize sessions table:', error);
			throw error;
		}
	}

	async fetch(request: Request): Promise<Response> {
		await this.initialize();

		const url = new URL(request.url);
		const method = request.method;
		const publicKey = url.searchParams.get('public_key');

		if (!publicKey) {
			return new Response("Missing 'public_key' parameter", { status: 400 });
		}

		if (url.pathname.endsWith('/verify')) {
			const token = request.headers.get('Authorization')?.replace('Bearer ', '');
			if (!token) {
				return new Response('Missing token', { status: 400 });
			}

			console.log('Executing: SELECT token, expires_at FROM sessions WHERE public_key = ?', [publicKey]);
			const stored = this.state.storage.sql.exec('SELECT token, expires_at FROM sessions WHERE public_key = ?', publicKey).one();

			if (!stored || stored.token !== token || (stored.expires_at as number) < Math.floor(Date.now() / 1000)) {
				return new Response('Invalid or expired token', { status: 401 });
			}

			return new Response('Token valid', { status: 200 });
		}

		if (method === 'GET') {
			const nonce = crypto.randomUUID();
			const createdAt = Math.floor(Date.now() / 1000);
			const expiresAt = createdAt + 300;

			console.log('Executing: INSERT OR REPLACE INTO sessions (public_key, nonce, created_at, expires_at) VALUES (?, ?, ?, ?)', [
				publicKey,
				nonce,
				createdAt,
				expiresAt,
			]);
			try {
				this.state.storage.sql.exec(
					'INSERT OR REPLACE INTO sessions (public_key, nonce, created_at, expires_at) VALUES (?, ?, ?, ?)',
					publicKey,
					nonce,
					createdAt,
					expiresAt
				);
			} catch (error) {
				console.error('SQL Insert Error:', error);
				throw error;
			}

			return new Response(JSON.stringify({ nonce }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		if (method === 'POST') {
			const { signature, nonce } = await request.json<{ signature: string; nonce: string }>();
			if (!signature || !nonce) {
				return new Response("Missing 'signature' or 'nonce'", { status: 400 });
			}

			console.log('Executing: SELECT nonce, expires_at FROM sessions WHERE public_key = ?', [publicKey]);
			const stored = this.state.storage.sql.exec('SELECT nonce, expires_at FROM sessions WHERE public_key = ?', publicKey).one();

			if (!stored || stored.nonce !== nonce || (stored.expires_at as number) < Math.floor(Date.now() / 1000)) {
				return new Response('Invalid or expired nonce', { status: 401 });
			}

			const publicKeyBytes = bs58.decode(publicKey);
			const nonceBytes = new TextEncoder().encode(nonce);
			const signatureBytes = bs58.decode(signature);

			const ed25519Key = await crypto.subtle.importKey('raw', publicKeyBytes, { name: 'Ed25519' }, false, ['verify']);

			const isValid = await crypto.subtle.verify('Ed25519', ed25519Key, signatureBytes, nonceBytes);

			if (!isValid) {
				return new Response('Invalid signature', { status: 401 });
			}

			const token = crypto.randomUUID();
			const tokenExpiresAt = Math.floor(Date.now() / 1000) + 86400;

			console.log('Executing: UPDATE sessions SET token = ?, expires_at = ? WHERE public_key = ?', [token, tokenExpiresAt, publicKey]);
			this.state.storage.sql.exec('UPDATE sessions SET token = ?, expires_at = ? WHERE public_key = ?', token, tokenExpiresAt, publicKey);

			return new Response(JSON.stringify({ token }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response('Method not allowed', { status: 405 });
	}
}
