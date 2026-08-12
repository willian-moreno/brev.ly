import { eq } from 'drizzle-orm'
import z from 'zod'
import { UrlNotFound } from '@/app/errors/url-not-found'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { slugSchema } from '@/shared/schemas'

export const findUnshortenedUrlInput = z.object({
  slug: slugSchema,
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
      unshortenedUrl: schema.urls.unshortenedUrl,
    })
    .from(schema.urls)
    .where(eq(schema.urls.slug, slug))

  if (result.length === 0) {
    return makeLeft(new UrlNotFound())
  }

  return makeRight({
    unshortenedUrl: result[0].unshortenedUrl,
  })
}
