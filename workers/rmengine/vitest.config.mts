// vitest.config.mts
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
	test: {
		pool: '@cloudflare/vitest-pool-workers',
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' },
				miniflare: {
					compatibilityDate: '2025-02-24', // Match Wrangler 3.112.0
					durableObjects: {
						SESSION_STORE: 'SessionStore',
						MATCH_MAKER: 'MatchMaker',
					},
				},
				main: './src/index.ts', // Match wrangler.toml
			},
		},
	},
});
