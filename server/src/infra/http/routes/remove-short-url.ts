import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { removeShortUrlUseCase } from '@/app/use-cases/remove-short-url-use-case'

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
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      await removeShortUrlUseCase({ slug })

      return reply.code(204).send()
    }
  )
}
