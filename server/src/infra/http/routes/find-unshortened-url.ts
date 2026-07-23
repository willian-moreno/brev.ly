import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { findUnshortenedUrlUseCase } from '@/app/use-cases/find-unshortened-url-use-case'
import { isLeft, unwrapEither } from '@/shared/either'

const findUnshortenedUrlParams = z.object({
  slug: z.string(),
})

type FindUnshortenedUrlParams = z.infer<typeof findUnshortenedUrlParams>

export const findUnshortenedUrlRoute: FastifyPluginAsyncZod = async (
  server: FastifyInstance
) => {
  server.get<{ Params: FindUnshortenedUrlParams }>(
    '/unshortened-url/:slug',
    {
      schema: {
        summary: 'Find a unshortened url by slug',
        tags: ['unshortened-url'],
        params: findUnshortenedUrlParams,
        response: {
          200: z.object({
            unshortenedUrl: z.url(),
          }),
          400: z.object({
            message: z.string(),
            issues: z.array(z.unknown()).optional(),
          }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const result = await findUnshortenedUrlUseCase({ slug })

      if (isLeft(result)) {
        const error = unwrapEither(result)

        if (error.name === 'UnshortenedUrlNotFound') {
          return reply.code(404).send({ message: error.message })
        }

        return reply.code(400).send({ message: error.message })
      }

      const data = unwrapEither(result)

      return reply.code(200).send({
        unshortenedUrl: data.unshortenedUrl,
      })
    }
  )
}
