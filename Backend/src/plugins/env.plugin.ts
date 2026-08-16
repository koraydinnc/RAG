import { Type, Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

export const EnvSchema = Type.Object({
    NODE_ENV: Type.String({ default: "development" }),
    PORT: Type.Number({ default: 3000 }),

    DATABASE_URL: Type.String({ minLength: 1, description: "PostgreSQL Database Connection URL" }),
    REDIS_URL: Type.String({ minLength: 1, description: "Redis Connection URL" }),
    ADMIN_API_KEY: Type.String({ minLength: 1, description: "Admin API Key" }),
    GCP_PROJECT_ID: Type.String({ minLength: 1, description: "GCP Project ID" }),

    WORKER_CONCURRENCY: Type.Number({ default: 5, minimum: 1 }),
    SHUTDOWN_TIMEOUT: Type.Number({ default: 10000, minimum: 1000 }),
});

export type EnvConfig = Static<typeof EnvSchema>;

declare module "fastify" {
    interface FastifyInstance {
        config: EnvConfig;
    }
}

export default fp(async (fastify: FastifyInstance) => {
    const rawEnv = {
        NODE_ENV: process.env.NODE_ENV || "development",
        PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        ADMIN_API_KEY: process.env.ADMIN_API_KEY,
        GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
        WORKER_CONCURRENCY: process.env.WORKER_CONCURRENCY ? parseInt(process.env.WORKER_CONCURRENCY, 10) : 5,
        QUEUE_PREFIX: process.env.QUEUE_PREFIX || "saas-rag",
        SHUTDOWN_TIMEOUT: process.env.SHUTDOWN_TIMEOUT ? parseInt(process.env.SHUTDOWN_TIMEOUT, 10) : 10000,
    };

    const cleanedEnv = Value.Clean(EnvSchema, Value.Default(EnvSchema, rawEnv));

    if (!Value.Check(EnvSchema, cleanedEnv)) {
        const errors = [...Value.Errors(EnvSchema, cleanedEnv)];
        const formattedErrors = errors
            .map((err) => `  - ${err.path || 'root'}: ${err.message}`)
            .join("\n");

        fastify.log.error(`❌ Invalid Environment Variables Configuration:\n${formattedErrors}`);
        throw new Error(`Invalid Environment Variables:\n${formattedErrors}`);
    }

    const validEnv = cleanedEnv as EnvConfig;
    fastify.decorate("config", validEnv);
    fastify.log.info("✅ Environment variables validated successfully.");
}, {
    name: "env-plugin"
});
