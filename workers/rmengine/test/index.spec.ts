// test/index.spec.ts
import { describe, it, expect } from 'vitest';
import { SELF } from 'cloudflare:test';
import '../src/index'; // Ensure the Worker is imported

describe('solana-auth-worker', () => {
	it('gets a nonce from /auth', async () => {
		const response = await SELF.fetch('http://localhost:8787/auth?public_key=test');
		expect(response.status).toBe(200);
		const json = await response.json();
		expect(json).toHaveProperty('nonce');
	});

	it('authenticates and gets a token', async () => {
		expect(true).toBe(true); // Placeholder
	});

	it('connects to /matchmaking WebSocket', async () => {
		expect(true).toBe(true); // Placeholder
	});
});
