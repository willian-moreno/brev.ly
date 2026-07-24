import { eq, sql } from 'drizzle-orm'
import z from 'zod'
import { UrlNotFound } from '@/app/errors/url-not-found'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { isSlugValid } from '@/shared/is-slug-valid'

export const increaseUrlVisitInput = z.object({
  slug: z.string().refine(isSlugValid, {
    error: 'The slug contains invalid characters',
  }),
})

export type IncreaseUrlVisitInput = z.input<typeof increaseUrlVisitInput>

export type IncreaseUrlVisitOutput = {
  totalVisits: number
}

export async function increaseUrlVisitUseCase(
  input: IncreaseUrlVisitInput
): Promise<Either<Error, IncreaseUrlVisitOutput>> {
  const { slug } = increaseUrlVisitInput.parse(input)

  const result = await db
    .update(schema.shortenedUrls)
    .set({ totalVisits: sql`${schema.shortenedUrls.totalVisits} + 1` })
    .where(eq(schema.shortenedUrls.slug, slug))
    .returning({ totalVisits: schema.shortenedUrls.totalVisits })

  if (result.length === 0) {
    return makeLeft(new UrlNotFound())
  }

  return makeRight({
    totalVisits: result[0].totalVisits,
  })
}
