import { describe, it, expect, beforeAll } from 'vitest';
import { generateKeyPairSigner, KeyPairSigner } from '@solana/web3.js'; // v2 imports
import bs58 from 'bs58';
import type { WebSocket as WebSocketType } from '@cloudflare/workers-types';

interface WorkersTestContext {
	worker: {
		fetch: (input: string, init?: RequestInit) => Promise<Response>;
	};
}

declare module 'vitest' {
	interface TestContext {
		worker: WorkersTestContext['worker'];
	}
}

// Base URL for local testing (adjusted by Vitest Workers pool)
const BASE_URL = 'https://localhost:8787';

// Test keypair signer
let keyPairSigner: KeyPairSigner;
let publicKey: string;

beforeAll(async () => {
	keyPairSigner = await generateKeyPairSigner(); // SolanaError: Cryptographic operations are only allowed in secure browser contexts. Read more here: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts.

	publicKey = keyPairSigner.address;
});

describe('solana-auth-worker', () => {
	it('gets a nonce from /auth', async ({ worker }) => {
		const response = await worker.fetch(`/auth?public_key=${publicKey}`);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toHaveProperty('nonce');
		console.log(data);
		// expect(typeof data.nonce).toBe('string');
	});

	it('authenticates and gets a token', async ({ worker }) => {
		// Step 1: Get nonce
		// const nonceResponse = await worker.fetch(`/auth?public_key=${publicKey}`);
		// const { nonce } = await nonceResponse.json();
		// // Step 2: Sign nonce and get token (Solana Web3.js v2)
		// const message = new TextEncoder().encode(nonce);
		// const signature = await signMessage(message, keyPairSigner); // v2 signing
		// const signatureBase58 = bs58.encode(signature);
		// const tokenResponse = await worker.fetch(`/auth?public_key=${publicKey}`, {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify({ signature: signatureBase58, nonce }),
		// });
		// expect(tokenResponse.status).toBe(200);
		// const data = await tokenResponse.json();
		// expect(data).toHaveProperty('token');
		// expect(typeof data.token).toBe('string');
		// return data.token; // Return token for next test
	});

	it('connects to /matchmaking WebSocket', async ({ worker }) => {
		// Get token first
		// const nonceResponse = await worker.fetch(`/auth?public_key=${publicKey}`);
		// const { nonce } = await nonceResponse.json();
		// const message = new TextEncoder().encode(nonce);
		// const signature = await signMessage(message, keyPairSigner); // v2 signing
		// const signatureBase58 = bs58.encode(signature);
		// const tokenResponse = await worker.fetch(`/auth?public_key=${publicKey}`, {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify({ signature: signatureBase58, nonce }),
		// });
		// const { token } = await tokenResponse.json();
		// // Connect to WebSocket
		// return new Promise<void>((resolve, reject) => {
		// 	const wsUrl = `${BASE_URL.replace('http', 'ws')}/matchmaking?public_key=${publicKey}`;
		// 	// Use global WebSocket constructor from Workers runtime
		// 	const ws = new globalThis.WebSocket(wsUrl, [], {
		// 		headers: { Authorization: `Bearer ${token}` },
		// 	}) as WebSocketType;
		// 	ws.addEventListener('open', () => {
		// 		console.log('WebSocket connected');
		// 		ws.send(JSON.stringify({ message: 'Hello from test' }));
		// 	});
		// 	ws.addEventListener('message', (event) => {
		// 		const data = event.data.toString();
		// 		expect(data).toBe('Echo: {"message":"Hello from test"}');
		// 		ws.close();
		// 	});
		// 	ws.addEventListener('close', () => {
		// 		resolve();
		// 	});
		// 	ws.addEventListener('error', (error) => {
		// 		reject(error);
		// 	});
		// });
	});
});
