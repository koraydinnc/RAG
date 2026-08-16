import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { v7 as uuidv7 } from "uuid";

import { EmbeddingResult } from "../lib/ai/ai.schema.js";

export default fp(async (fastify: FastifyInstance) => {
    async function saveEmbedding(
        chunkId: string,
        result: EmbeddingResult,
        tenantId: string,
        chatbotId: string
    ) {
        const id = uuidv7();
        const vectorString = `[${result.embedding.join(',')}]`;

        if (result.dimensions === 768) {
            return await fastify.db.$executeRaw`
                INSERT INTO "Embedding768" ("id", "tenantId", "chatbotId", "documentChunkId", "model", "embedding", "createdAt")
                VALUES (${id}, ${tenantId}, ${chatbotId}, ${chunkId}, ${result.model}, ${vectorString}::vector, NOW())
                ON CONFLICT ("documentChunkId") 
                DO UPDATE SET 
                    "embedding" = ${vectorString}::vector, 
                    "model" = ${result.model}, 
                    "createdAt" = NOW()
            `;
        } else if (result.dimensions === 1536) {
            return await fastify.db.$executeRaw`
                INSERT INTO "Embedding1536" ("id", "tenantId", "chatbotId", "documentChunkId", "model", "embedding", "createdAt")
                VALUES (${id}, ${tenantId}, ${chatbotId}, ${chunkId}, ${result.model}, ${vectorString}::vector, NOW())
                ON CONFLICT ("documentChunkId") 
                DO UPDATE SET 
                    "embedding" = ${vectorString}::vector, 
                    "model" = ${result.model}, 
                    "createdAt" = NOW()
            `;
        }
    }

    async function deleteEmbedding(
        chunkId: string,
        tenantId: string,
        chatbotId: string,
        dimensions?: 768 | 1536
    ) {
        if (dimensions === 768) {
            return await fastify.db.$executeRaw`
                DELETE FROM "Embedding768"
                WHERE "documentChunkId" = ${chunkId} AND "tenantId" = ${tenantId} AND "chatbotId" = ${chatbotId}
            `;
        } else if (dimensions === 1536) {
            return await fastify.db.$executeRaw`
                DELETE FROM "Embedding1536"
                WHERE "documentChunkId" = ${chunkId} AND "tenantId" = ${tenantId} AND "chatbotId" = ${chatbotId}
            `;
        } else {
            await fastify.db.$executeRaw`
                DELETE FROM "Embedding768"
                WHERE "documentChunkId" = ${chunkId} AND "tenantId" = ${tenantId} AND "chatbotId" = ${chatbotId}
            `;
            await fastify.db.$executeRaw`
                DELETE FROM "Embedding1536"
                WHERE "documentChunkId" = ${chunkId} AND "tenantId" = ${tenantId} AND "chatbotId" = ${chatbotId}
            `;
        }
    }

    fastify.decorate('saveEmbedding', saveEmbedding);
    fastify.decorate('deleteEmbedding', deleteEmbedding);
}, {
    name: 'ai-plugin',
    dependencies: ['prisma-plugin']
});

declare module 'fastify' {
    interface FastifyInstance {
        saveEmbedding: (
            chunkId: string,
            result: EmbeddingResult,
            tenantId: string,
            chatbotId: string
        ) => Promise<unknown>;
        deleteEmbedding: (
            chunkId: string,
            tenantId: string,
            chatbotId: string,
            dimensions?: 768 | 1536
        ) => Promise<unknown>;
    }
}
