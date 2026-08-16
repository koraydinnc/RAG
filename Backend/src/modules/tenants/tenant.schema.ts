import { Type, Static } from '@sinclair/typebox'

export const TenantSchema = Type.Object({
    id: Type.String({ format: 'uuid' }),
    name: Type.String({ minLength: 2 }),
    slug: Type.String({ minLength: 2 }),
    apiKey: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
}, { $id: 'TenantSchema' })

export const PublicTenantSchema = Type.Omit(TenantSchema, ['apiKey'], { $id: 'PublicTenantSchema' })

export const CreateTenantSchema = Type.Omit(TenantSchema, [
    'id',
    'apiKey',
    'createdAt',
    'updatedAt'
], { $id: 'CreateTenantSchema' })

export const CreateTenantResponseSchema = Type.Object({
    tenant: PublicTenantSchema,
    apiKey: Type.String({ description: "API key returned only once upon creation" })
}, { $id: 'CreateTenantResponseSchema' })

export const GetTenantsResponseSchema = Type.Array(PublicTenantSchema, { $id: 'GetTenantsResponseSchema' })

export type Tenant = Static<typeof TenantSchema>
export type PublicTenant = Static<typeof PublicTenantSchema>
export type CreateTenant = Static<typeof CreateTenantSchema>
export type CreateTenantResponse = Static<typeof CreateTenantResponseSchema>
export type GetTenantsResponse = Static<typeof GetTenantsResponseSchema>
