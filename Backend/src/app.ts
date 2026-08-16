import 'dotenv/config'
import './lib/typebox-formats.js'
import Fastify from 'fastify'
import AutoLoad from '@fastify/autoload'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const fastify = Fastify({ logger: true })

fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
})

fastify.register(AutoLoad, {
    dir: join(__dirname, 'modules'),
})

const start = async () => {
    try {
        await fastify.ready()
        const address = await fastify.listen({ port: fastify.config.PORT })
        fastify.log.info(`Server listening on ${address}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()