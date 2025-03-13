// vitest.config.mts
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
	test: {
		pool: '@cloudflare/vitest-pool-workers',
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' },
				miniflare: {
					compatibilityDate: '2025-02-24',
					durableObjects: {
						SESSION_STORE: 'SessionStore',
						MATCH_MAKER: 'MatchMaker',
					},
					durableObjectsPersist: true,
					log: { level: 'debug' },
				},
				main: './src/index.ts',
			},
		},
	},
});
