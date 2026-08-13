import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import z from 'zod'
import { env } from '@/env'
import { hasStatusCode } from '@/shared/has-status-code'
import { createShortUrlRoute } from './routes/create-short-url'
import { exportUrlsRoute } from './routes/export-urls'
import { findUnshortenedUrlRoute } from './routes/find-unshortened-url'
import { findUrlsRoute } from './routes/find-urls'
import { increaseUrlVisitRoute } from './routes/increase-url-visit'
import { removeUrlRoute } from './routes/remove-url'
import { transformSwaggerSchema } from './transform-swagger-schema'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Bad Request',
      issues: error.validation,
    })
  }

  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      message: 'Bad Request',
      issues: error.issues,
    })
  }

  if (hasStatusCode(error) && error.statusCode === 429) {
    return reply.status(429).send({
      message: 'Too Many Requests',
    })
  }

  return reply.status(500).send({
    message: 'Internal server error',
  })
})

server.register(fastifyCors, {
  origin: env.VITE_FRONTEND_URL ?? '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
})

server.register(fastifyRateLimit, {
  max: 10,
  timeWindow: '5000ms',
})

server.register(fastifyMultipart)

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Url Shortener API',
      version: '1.0.0',
    },
  },
  transform: transformSwaggerSchema,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

server.register(findUrlsRoute)
server.register(createShortUrlRoute)
server.register(removeUrlRoute)
server.register(findUnshortenedUrlRoute)
server.register(increaseUrlVisitRoute)
server.register(exportUrlsRoute)

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`🤖 HTTP server is running on port ${env.PORT}`)
})
