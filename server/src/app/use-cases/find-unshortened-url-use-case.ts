import { eq } from 'drizzle-orm'
import z from 'zod'
import { UnshortenedUrlNotFound } from '@/app/errors/unshortened-url-not-found'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { isSlugValid } from '@/shared/is-slug-valid'

export const findUnshortenedUrlInput = z.object({
  slug: z.string().refine(isSlugValid, {
    error: 'The slug contains invalid characters',
  }),
})

export type FindUnshortenedUrlInput = z.input<typeof findUnshortenedUrlInput>

export type FindUnshortenedUrlOutput = {
  unshortenedUrl: string
}

export async function findUnshortenedUrlUseCase(
  input: FindUnshortenedUrlInput
): Promise<Either<Error, FindUnshortenedUrlOutput>> {
  const { slug } = findUnshortenedUrlInput.parse(input)

  const result = await db
    .select({
      unshortenedUrl: schema.shortenedUrls.unshortenedUrl,
    })
    .from(schema.shortenedUrls)
    .where(eq(schema.shortenedUrls.slug, slug))

  if (result.length === 0) {
    return makeLeft(new UnshortenedUrlNotFound())
  }

  return makeRight({
    unshortenedUrl: result[0].unshortenedUrl,
  })
}
