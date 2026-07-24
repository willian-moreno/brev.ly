import { eq } from 'drizzle-orm'
import z from 'zod'
import { UrlNotFound } from '@/app/errors/url-not-found'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { isSlugValid } from '@/shared/is-slug-valid'

export const removeShortUrlInput = z.object({
  slug: z
    .string()
    .refine(isSlugValid, { error: 'The slug contains invalid characters' }),
})

export type RemoveShortUrlInput = z.input<typeof removeShortUrlInput>

export async function removeShortUrlUseCase(
  input: RemoveShortUrlInput
): Promise<Either<Error, true>> {
  const { slug } = removeShortUrlInput.parse(input)

  const result = await db
    .select({
      unshortenedUrl: schema.shortenedUrls.unshortenedUrl,
    })
    .from(schema.shortenedUrls)
    .where(eq(schema.shortenedUrls.slug, slug))

  if (result.length === 0) {
    return makeLeft(new UrlNotFound())
  }

  await db
    .delete(schema.shortenedUrls)
    .where(eq(schema.shortenedUrls.slug, slug))

  return makeRight(true)
}
