import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyAdmin(request: FastifyRequest, reply: FastifyReply) {
    const apiKey = request.headers['x-admin-api-key'] as string

    if (!apiKey || apiKey !== request.server.config.ADMIN_API_KEY) {
        return reply.status(401).send({ error: "Unauthorized Access" })
    }
}