import Redis from 'ioredis';
import { logger } from './logger';

// Redis client may be optional for local dev. Export `redis` as nullable
// and provide a `redisReady` promise that resolves when connection is established.
export let redis: Redis | null = null;
let _resolveReady: () => void = () => {};
export const redisReady: Promise<void> = new Promise((resolve) => {
	_resolveReady = resolve;
});

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
	logger.warn('REDIS_URL not provided — continuing without Redis (degraded mode)');
	// resolve immediately so callers waiting can continue
	_resolveReady();
} else {
	try {
		redis = new Redis(redisUrl, {
			// allow ioredis to retry; we also log and keep redis nullable if it cannot connect
			maxRetriesPerRequest: null,
			enableOfflineQueue: true,
		});

		redis.on('connect', () => {
			logger.info('Redis client connected');
			_resolveReady();
		});
		redis.on('ready', () => logger.info('Redis ready'));
		redis.on('error', (err) => logger.error('Redis client error', { error: err }));
		// if close happens, we keep redis reference but operations may fail until reconnection
		redis.on('end', () => logger.warn('Redis connection ended'));
	} catch (err: any) {
		logger.error('Failed to initialize Redis client', { error: err });
		redis = null;
		_resolveReady();
	}
}
