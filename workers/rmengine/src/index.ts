// src/index.ts

import { SessionStore } from './sessionStore';
import { MatchMaker } from './matchMaker';
import { createKeyPairFromBytes, getAddressFromPublicKey } from '@solana/kit';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// Auth endpoint (no token required)
		if (url.pathname.startsWith('/auth')) {
			const sessionStore = env.SESSION_STORE.get(env.SESSION_STORE.idFromName('auth'));
			return sessionStore.fetch(request);
		}

		// Require access_token for all subsequent endpoints
		const token = request.headers.get('Authorization')?.replace('Bearer ', '');
		if (!token) {
			return new Response("Missing 'Authorization' header with Bearer token", { status: 400 });
		}

		// Verify token with SessionStore
		const publicKey = url.searchParams.get('public_key');
		if (!publicKey) {
			return new Response("Missing 'public_key' parameter", { status: 400 });
		}
		const sessionStore = env.SESSION_STORE.get(env.SESSION_STORE.idFromName('auth'));
		const verifyRequest = new Request(`${url.origin}/auth/verify?public_key=${publicKey}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const verifyResponse = await sessionStore.fetch(verifyRequest);
		if (verifyResponse.status !== 200) {
			return new Response('Unauthorized - Invalid or expired token', { status: 401 });
		}

		// // Matchmaking endpoint
		// if (url.pathname.startsWith('/matchmaking')) {
		// 	const matchMaker = env.MATCH_MAKER.get(env.MATCH_MAKER.idFromName('matchmaking'));
		// 	return matchMaker.fetch(request);
		// }

		// Airdrop endpoint
		if (url.pathname === '/airdrop') {
			const secretKeyBytes = JSON.parse(env.SOLANA_SECRET_KEY);
			const secretKey = Uint8Array.from(secretKeyBytes);
			const keypairSigner = await createKeyPairFromBytes(secretKey);
			const adPubkey = await getAddressFromPublicKey(keypairSigner.publicKey);
			if (adPubkey !== env.SOLANA_PUBLIC_KEY) {
				return new Response('Keypair mismatch', { status: 500 });
			}
		}

		// 	// Set up RPC with HTTP transport
		// 	const transport = createHttpTransport({ url: env.SOLANA_RPC_URL });
		// 	const rpc = createRpc({ transport });
		// 	const requestAirdrop = requestAirdropFactory({ rpc });

		// 	// Perform airdrop
		// 	const userAddress = address(publicKey); // Convert string to Address
		// 	const signature = await requestAirdrop({
		// 		recipient: userAddress,
		// 		lamports: 100_000_000n, // 0.1 SOL
		// 		commitment: 'confirmed',
		// 	});

		// 	// Confirm transaction using Connection (for compatibility)
		// 	const connection = createConnection(env.SOLANA_RPC_URL, { commitment: 'confirmed' });
		// 	await connection.confirmTransaction(signature);

		// 	return new Response(JSON.stringify({ signature }), {
		// 		status: 200,
		// 		headers: { 'Content-Type': 'application/json' },
		// 	});

		return new Response('Not Found', { status: 404 });
	},
};

export { SessionStore, MatchMaker };

interface Env {
	SESSION_STORE: DurableObjectNamespace;
	MATCH_MAKER: DurableObjectNamespace;
	SOLANA_RPC_URL: string;
	SOLANA_PUBLIC_KEY: string;
	SOLANA_SECRET_KEY: string; // JSON string of byte array
}
