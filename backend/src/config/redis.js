import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

let redisClient = null;
let isConnected = false;

const initRedis = async () => {
    // Only attempt Redis connection if explicitly enabled or configured
    if (process.env.USE_REDIS !== 'true' && !process.env.REDIS_HOST) {
        return;
    }

    try {
        const redisHost = process.env.REDIS_HOST || 'localhost';
        const redisPort = process.env.REDIS_PORT || 6379;

        redisClient = createClient({
            url: `redis://${redisHost}:${redisPort}`,
            socket: {
                reconnectStrategy: false
            }
        });

        redisClient.on('error', () => {
            isConnected = false;
        });

        redisClient.on('connect', () => {
            isConnected = true;
            console.log('Connected to Redis');
        });

        await redisClient.connect();
    } catch (err) {
        isConnected = false;
        if (redisClient) {
            try {
                await redisClient.disconnect();
            } catch (_) {}
        }
    }
};

// Attempt initial non-blocking connection
initRedis().catch(() => {
    isConnected = false;
});

export const getRedisClient = () => redisClient;
export const isRedisReady = () => isConnected;

export default {
    getRedisClient,
    isRedisReady
};
