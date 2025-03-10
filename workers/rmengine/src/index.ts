// src/index.ts
import { SessionStore } from './sessionStore';
import { MatchMaker } from './matchMaker';
import { Request, Response, DurableObjectNamespace } from '@cloudflare/workers-types';

interface Env {
	SESSION_STORE: DurableObjectNamespace;
	MATCH_MAKER: DurableObjectNamespace;
}

export { SessionStore, MatchMaker };

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		// Authentication endpoint (no token required)
		if (url.pathname === '/auth') {
			if (!env.SESSION_STORE) {
				return new Response('SESSION_STORE binding is undefined', { status: 500 });
			}
			const id = env.SESSION_STORE.idFromName('global');
			const stub = env.SESSION_STORE.get(id);
			return stub.fetch(request);
		}

		// All other routes require authentication
		const token = request.headers.get('Authorization')?.replace('Bearer ', '');
		const publicKey = url.searchParams.get('public_key');

		if (!token || !publicKey) {
			return new Response('Missing token or public_key', { status: 400 });
		}

		// Verify token
		if (!env.SESSION_STORE) {
			return new Response('SESSION_STORE binding is undefined', { status: 500 });
		}
		const sessionId = env.SESSION_STORE.idFromName('global');
		const sessionStub = env.SESSION_STORE.get(sessionId);
		const sessionUrl = new URL('/verify', url);
		sessionUrl.searchParams.set('public_key', publicKey);
		const sessionReq = new Request(sessionUrl.toString(), {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});
		const sessionRes = await sessionStub.fetch(sessionReq);

		if (sessionRes.status !== 200) {
			return new Response('Invalid token', { status: 401 });
		}

		// Matchmaking WebSocket endpoint
		if (url.pathname === '/matchmaking') {
			if (!env.MATCH_MAKER) {
				return new Response('MATCH_MAKER binding is undefined', { status: 500 });
			}
			const id = env.MATCH_MAKER.idFromName('global');
			const stub = env.MATCH_MAKER.get(id);
			return stub.fetch(request);
		}

		return new Response('Not found', { status: 404 });
	},
};
