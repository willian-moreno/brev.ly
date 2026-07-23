import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createShortUrlUseCase } from '@/app/use-cases/create-short-url-use-case'
import { isLeft, unwrapEither } from '@/shared/either'

const createShortUrlBody = z.object({
  unshortenedUrl: z.url(),
  slug: z.string(),
})

type CreateShortUrlBody = z.infer<typeof createShortUrlBody>

export const createShortUrlRoute: FastifyPluginAsyncZod = async (
  server: FastifyInstance
) => {
  server.post<{ Body: CreateShortUrlBody }>(
    '/shortened-urls',
    {
      schema: {
        summary: 'Create a short url',
        tags: ['shortened-urls'],
        body: createShortUrlBody,
        response: {
          201: z.void(),
          400: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { unshortenedUrl, slug } = request.body

      const result = await createShortUrlUseCase({
        unshortenedUrl,
        slug,
      })

      if (isLeft(result)) {
        const error = unwrapEither(result)

        if (error.name === 'ShortenedUrlAlreadyExists') {
          return reply.status(409).send({ message: error.message })
        }

        return reply.status(400).send({ message: error.message })
      }

      return reply.status(201).send()
    }
  )
}
