import z from 'zod'
import { api } from '@/libs/axios'
import { urlsSchema } from '@/schemas'

export const findUrlsQuerySchema = z
  .object({
    search: z.string().optional(),
    sortBy: z
      .enum(['id', 'unshortenedUrl', 'slug', 'totalVisits', 'createdAt'])
      .optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
    page: z.coerce.number().min(0).optional(),
    pageSize: z.coerce.number().min(1).optional(),
  })
  .optional()

export const findUrlsInputSchema = z
  .object({ query: findUrlsQuerySchema })
  .optional()

export const findUrlsOutputSchema = z.object({
  items: urlsSchema,
  total: z.number(),
})

export type FindUrlsInput = z.input<typeof findUrlsInputSchema>

export type FindUrlsOutput = z.infer<typeof findUrlsOutputSchema>

export async function findUrls(input?: FindUrlsInput) {
  const parse = findUrlsInputSchema.parse(input)

  const response = await api.get('/urls', {
    params: {
      search: parse?.query?.search,
      sortBy: parse?.query?.sortBy,
      sortDirection: parse?.query?.sortDirection,
      page: parse?.query?.page,
      pageSize: parse?.query?.pageSize,
    },
  })

  const { items, total } = findUrlsOutputSchema.parse(response.data)

  return {
    items,
    total,
  }
}
