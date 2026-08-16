import { FastifyInstance } from "fastify";

export default async function AuthRoutes(fastify: FastifyInstance) {
    fastify.get('/health', async () => {
        return { status: 'ok', module: 'auth' };
    });
}
