import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { exportUrlsUseCase } from '@/app/use-cases/export-urls-use-case'
import { isLeft, unwrapEither } from '@/shared/either'

const exportUrlsQuery = z.object({
  search: z.string().optional(),
})

type ExportUrlsQuery = z.infer<typeof exportUrlsQuery>

export const exportUrlsRoute: FastifyPluginAsyncZod = async (
  server: FastifyInstance
) => {
  server.post<{ Querystring: ExportUrlsQuery }>(
    '/urls/exports',
    {
      schema: {
        summary: 'Export urls',
        tags: ['urls'],
        querystring: exportUrlsQuery,
        response: {
          200: z.object({
            reportUrl: z.string(),
          }),
          400: z.object({
            message: z.string(),
            issues: z.array(z.unknown()).optional(),
          }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { search } = request.query

      const result = await exportUrlsUseCase({ search })

      if (isLeft(result)) {
        const error = unwrapEither(result)

        if (error.name === 'FailureToUploadToStorage') {
          return reply.code(500).send(error.message)
        }

        return reply.code(400).send({ message: error.message })
      }

      const { reportUrl } = unwrapEither(result)

      return reply.code(200).send({ reportUrl })
    }
  )
}
