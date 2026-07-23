import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
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
import { createShortUrlRoute } from './routes/create-short-url'
import { findUnshortenedUrlRoute } from './routes/find-unshortened-url'
import { increaseUrlVisitRoute } from './routes/increase-url-visit'
import { removeShortUrlRoute } from './routes/remove-short-url'
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

  return reply.status(500).send({
    message: 'Internal server error',
  })
})

server.register(fastifyCors, { origin: '*' })

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

server.register(findUnshortenedUrlRoute)
server.register(createShortUrlRoute)
server.register(removeShortUrlRoute)
server.register(increaseUrlVisitRoute)

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`🤖 HTTP server is running on port ${env.PORT}`)
})
