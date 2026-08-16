import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

const client = new SecretManagerServiceClient()

interface CacheEntry {
  value: string
  expiresAt: number
}

const DEFAULT_TTL_MS = 15 * 60 * 1000
const secretCache = new Map<string, CacheEntry>()

export async function getSecretValue(secretRef: string, projectId?: string, ttlMs: number = DEFAULT_TTL_MS): Promise<string> {
  if (!secretRef) {
    throw new Error('Secret reference is missing or empty')
  }

  const cached = secretCache.get(secretRef)
  if (cached && Date.now() < cached.expiresAt) {
    return cached.value
  }
  try {
    const activeProjectId = projectId || process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT
    const name = secretRef.startsWith('projects/')
      ? secretRef
      : `projects/${activeProjectId}/secrets/${secretRef}/versions/latest`

    const [version] = await client.accessSecretVersion({ name })
    const payload = version.payload?.data?.toString()

    if (!payload) {
      throw new Error(`Secret '${secretRef}' payload is empty.`)
    }

    secretCache.set(secretRef, {
      value: payload,
      expiresAt: Date.now() + ttlMs,
    })

    return payload
  } catch (error) {
    throw new Error(`Failed to retrieve secret '${secretRef}' from Google Secret Manager: ${(error as Error).message}`)
  }
}

export function clearSecretCache(secretRef?: string): void {
  if (secretRef) {
    secretCache.delete(secretRef)
  } else {
    secretCache.clear()
  }
}

export default fp(async (fastify: FastifyInstance) => {
  const projectId = fastify.config.GCP_PROJECT_ID;

  fastify.decorate('getSecretValue', (secretRef: string, ttlMs?: number) => getSecretValue(secretRef, projectId, ttlMs))
  fastify.decorate('clearSecretCache', clearSecretCache)
}, {
  name: 'secret-manager-plugin',
  dependencies: ['env-plugin']
})

declare module 'fastify' {
  interface FastifyInstance {
    getSecretValue: (secretRef: string, ttlMs?: number) => Promise<string>
    clearSecretCache: (secretRef?: string) => void
  }
}
