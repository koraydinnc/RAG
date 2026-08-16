import { FastifyInstance } from "fastify";
import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { verifyAdmin } from "../../lib/context/admin-context.js";
import { CreateTenantSchema, GetTenantsResponseSchema } from "./tenant.schema.js";
import { verifyUser } from "../../lib/context/user-context.js";

export default async function TenantsRoute(fastify: FastifyInstance) {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.get('/', {
        preHandler: verifyAdmin,
        schema: {
            response: {
                200: GetTenantsResponseSchema
            }
        },
        handler: async (request, reply) => {
            return [];
        }
    });

    server.post('/create', {

        preHandler: verifyUser,
        schema: {
            body: CreateTenantSchema,
            response: {
                201: Type.Object({ message: Type.String() })
            }
        },
        handler: async (request, reply) => {
            return { message: "Tenant Created" }
        },
    });
}