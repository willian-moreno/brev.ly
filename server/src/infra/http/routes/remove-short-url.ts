import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { removeShortUrlUseCase } from '@/app/use-cases/remove-short-url-use-case'
import { isLeft, unwrapEither } from '@/shared/either'

const removeShortUrlParams = z.object({
  slug: z.string(),
})

type RemoveShortUrlParams = z.infer<typeof removeShortUrlParams>

export const removeShortUrlRoute: FastifyPluginAsyncZod = async (
  server: FastifyInstance
) => {
  server.delete<{ Params: RemoveShortUrlParams }>(
    '/urls/:slug',
    {
      schema: {
        summary: 'Remove a short url by slug',
        tags: ['urls'],
        params: removeShortUrlParams,
        response: {
          204: z.void(),
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

      const result = await removeShortUrlUseCase({ slug })

      if (isLeft(result)) {
        const error = unwrapEither(result)

        if (error.name === 'UrlNotFound') {
          return reply.code(404).send({ message: error.message })
        }

        return reply.code(400).send({ message: error.message })
      }

      return reply.code(204).send()
    }
  )
}
