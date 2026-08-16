import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

declare module 'fastify' {
    interface FastifyInstance {
        db: PrismaClient;
    }
}

export default fp(async (fastify: FastifyInstance) => {
    const pool = new pg.Pool({
        connectionString: fastify.config.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    fastify.decorate('db', prisma);

    fastify.addHook('onClose', async (instance: FastifyInstance) => {
        await instance.db.$disconnect();
        await pool.end();
    });
}, {
    name: 'prisma-plugin',
    dependencies: ['env-plugin']
});