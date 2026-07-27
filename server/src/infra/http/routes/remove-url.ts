import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { removeUrlUseCase } from '@/app/use-cases/remove-url-use-case'
import { isLeft, unwrapEither } from '@/shared/either'

const removeUrlParams = z.object({
  slug: z.string(),
})

type RemoveUrlParams = z.infer<typeof removeUrlParams>

export const removeUrlRoute: FastifyPluginAsyncZod = async (
  server: FastifyInstance
) => {
  server.delete<{ Params: RemoveUrlParams }>(
    '/urls/:slug',
    {
      schema: {
        summary: 'Remove url by slug',
        tags: ['urls'],
        params: removeUrlParams,
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

      const result = await removeUrlUseCase({ slug })

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
