import { Queue } from "bullmq";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { IngestionJobData } from "../modules/ingestion/ingestion.schema.js";

declare module 'fastify' {
    interface FastifyInstance {
        ingestionQueue: Queue<IngestionJobData>;
    }
}

export default fp(async (fastify: FastifyInstance) => {
    const ingestionQueue = new Queue<IngestionJobData>('ingestion-queue', {
        connection: fastify.redis,
        defaultJobOptions: {
            removeOnComplete: true,
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 }, // 2s - 4s -8s   
            removeOnFail: { count: 1000 }
        }
    });

    ingestionQueue.on('error', (error) => {
        fastify.log.error(error, 'Ingestion Queue error');
    });

    await ingestionQueue.waitUntilReady();
    fastify.log.info('Ingestion Queue Ready');

    const counts = await ingestionQueue.getJobCounts('active', 'waiting', 'delayed', 'completed', 'failed');
    fastify.log.info(`Current Job Counts: Active: ${counts.active}, Waiting: ${counts.waiting}, Delayed: ${counts.delayed}, Completed: ${counts.completed}, Failed: ${counts.failed}`);

    fastify.decorate('ingestionQueue', ingestionQueue);

    fastify.addHook('onClose', async (instance) => {
        await instance.ingestionQueue.close();
    });
}, {
    name: 'queue-plugin',
    dependencies: ['env-plugin', 'redis-plugin']
});