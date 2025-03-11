// src/index.ts
import { SessionStore } from './sessionStore';
import { MatchMaker } from './matchMaker'; // Adjust path if needed

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname.startsWith('/auth')) {
			const sessionStore = env.SESSION_STORE.get(env.SESSION_STORE.idFromName('auth'));
			return sessionStore.fetch(request);
		}
		if (url.pathname.startsWith('/matchmaking')) {
			const matchMaker = env.MATCH_MAKER.get(env.MATCH_MAKER.idFromName('matchmaking'));
			return matchMaker.fetch(request);
		}
		return new Response('Not Found', { status: 404 });
	},
};

export { SessionStore, MatchMaker };

interface Env {
	SESSION_STORE: DurableObjectNamespace;
	MATCH_MAKER: DurableObjectNamespace;
}
