import { FastifyReply, FastifyRequest } from "fastify"

declare module "fastify" {
    interface FastifyRequest {
        tenantId: string
    }
}

export async function verifyTenant(request: FastifyRequest, reply: FastifyReply) {
    const apiKey = request.headers['x-api-key'] as string

    if (!apiKey) {
        return reply.status(400).send({ error: 'API key is required' })
    }

    const tenant = await request.server.db.tenant.findUnique({
        where: {
            apiKey
        }
    })

    if (!tenant) {
        return reply.status(401).send({ error: 'Invalid API key' })
    }

    request.tenantId = tenant.id
}