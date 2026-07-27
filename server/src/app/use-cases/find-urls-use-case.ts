import { asc, count, desc, ilike, or } from 'drizzle-orm'
import z from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { makeRight, type Right } from '@/shared/either'

export const findUrlsInput = z.object({
  search: z.string().optional(),
  sortBy: z
    .enum(['id', 'unshortenedUrl', 'slug', 'totalVisits', 'createdAt'])
    .optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(0).optional(),
  pageSize: z.coerce.number().min(1).optional(),
})

export type FindUrlsInput = z.input<typeof findUrlsInput>

export type FindUrlsOutput = {
  items: {
    id: string
    unshortenedUrl: string
    slug: string
    totalVisits: number
    createdAt: Date
  }[]
  total: number
}

export async function findUrlsUseCase(
  input: FindUrlsInput
): Promise<Right<FindUrlsOutput>> {
  const { search, sortBy, sortDirection, page, pageSize } =
    findUrlsInput.parse(input)

  const query = db
    .select({
      id: schema.urls.id,
      unshortenedUrl: schema.urls.unshortenedUrl,
      slug: schema.urls.slug,
      totalVisits: schema.urls.totalVisits,
      createdAt: schema.urls.createdAt,
    })
    .from(schema.urls)
    .where(
      search && search.trim().length > 0
        ? or(
            ilike(schema.urls.unshortenedUrl, `%${search}%`),
            ilike(schema.urls.slug, `%${search}%`)
          )
        : undefined
    )
    .orderBy(fields => {
      if (sortBy && sortDirection === 'asc') {
        return asc(fields[sortBy])
      }

      if (sortBy && sortDirection === 'desc') {
        return desc(fields[sortBy])
      }

      return desc(fields.id)
    })
    .$dynamic()

  if (page && page >= 0 && pageSize && pageSize > 0) {
    query.offset((page - 1) * pageSize).limit(pageSize)
  }

  const countQuery = db
    .select({
      total: count(schema.urls.id),
    })
    .from(schema.urls)
    .where(
      search && search.trim().length > 0
        ? or(
            ilike(schema.urls.unshortenedUrl, `%${search}%`),
            ilike(schema.urls.slug, `%${search}%`)
          )
        : undefined
    )

  const [items, [{ total }]] = await Promise.all([query, countQuery])

  return makeRight({
    items,
    total,
  })
}
