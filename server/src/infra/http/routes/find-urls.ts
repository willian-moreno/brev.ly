import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { findUrlsUseCase } from '@/app/use-cases/find-urls-use-case'
import { unwrapEither } from '@/shared/either'

const findUrlsQuery = z.object({
  search: z.string().optional(),
  sortBy: z
    .enum(['id', 'unshortenedUrl', 'slug', 'totalVisits', 'createdAt'])
    .optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(0).optional(),
  pageSize: z.coerce.number().min(1).optional(),
})

type FindUrlsQuery = z.infer<typeof findUrlsQuery>

export const findUrlsRoute: FastifyPluginAsyncZod = async (
  server: FastifyInstance
) => {
  server.get<{ Querystring: FindUrlsQuery }>(
    '/urls',
    {
      schema: {
        summary: 'Find urls',
        tags: ['urls'],
        querystring: findUrlsQuery,
        response: {
          200: z.object({
            items: z.array(
              z.object({
                id: z.string(),
                unshortenedUrl: z.string(),
                slug: z.string(),
                totalVisits: z.number(),
                createdAt: z.date(),
              })
            ),
            total: z.number(),
          }),
          400: z.object({
            message: z.string(),
            issues: z.array(z.unknown()).optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search, sortBy, sortDirection, page, pageSize } = request.query

      const result = await findUrlsUseCase({
        search,
        sortBy,
        sortDirection,
        page,
        pageSize,
      })

      const { items, total } = unwrapEither(result)

      return reply.code(200).send({ items, total })
    }
  )
}
