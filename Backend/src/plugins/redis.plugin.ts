import { Redis } from "ioredis";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

declare module 'fastify' {
    interface FastifyInstance {
        redis: Redis;
    }
}

export default fp(async (fastify: FastifyInstance) => {
    const redis = new Redis(fastify.config.REDIS_URL, {
        maxRetriesPerRequest: null,
    });

    redis.on('error', (err) => {
        fastify.log.error({ err }, 'Redis Connection Error');
    });

    redis.on('connect', () => {
        fastify.log.info('Redis connected');
    });

    fastify.decorate('redis', redis);

    fastify.addHook('onClose', async (instance) => {
        await instance.redis.quit();
    });
}, {
    name: 'redis-plugin',
    dependencies: ['env-plugin']
});