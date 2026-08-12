import { eq } from 'drizzle-orm'
import z from 'zod'
import { UrlNotFound } from '@/app/errors/url-not-found'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { slugSchema } from '@/shared/schemas'

export const removeUrlInput = z.object({
  slug: slugSchema,
})

export type RemoveUrlInput = z.input<typeof removeUrlInput>

export async function removeUrlUseCase(
  input: RemoveUrlInput
): Promise<Either<Error, true>> {
  const { slug } = removeUrlInput.parse(input)

  const result = await db
    .select({
      unshortenedUrl: schema.urls.unshortenedUrl,
    })
    .from(schema.urls)
    .where(eq(schema.urls.slug, slug))

  if (result.length === 0) {
    return makeLeft(new UrlNotFound())
  }

  await db.delete(schema.urls).where(eq(schema.urls.slug, slug))

  return makeRight(true)
}
