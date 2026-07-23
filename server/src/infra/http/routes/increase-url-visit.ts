import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { increaseUrlVisitUseCase } from '@/app/use-cases/increase-url-visit-use-case'
import { isLeft, unwrapEither } from '@/shared/either'

const increaseUrlVisitParams = z.object({
  slug: z.string(),
})

type IncreaseUrlVisitParams = z.infer<typeof increaseUrlVisitParams>

export const increaseUrlVisitRoute: FastifyPluginAsyncZod = async (
  server: FastifyInstance
) => {
  server.patch<{ Params: IncreaseUrlVisitParams }>(
    '/urls/:slug/access',
    {
      schema: {
        summary: 'Increase the number of visits to the url',
        tags: ['urls'],
        params: increaseUrlVisitParams,
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

      const result = await increaseUrlVisitUseCase({ slug })

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
