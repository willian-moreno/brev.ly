import { eq } from 'drizzle-orm'
import z from 'zod'
import { ShortenedUrlAlreadyExists } from '@/app/errors/shortened-url-already-exists'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { isSlugValid } from '@/shared/is-slug-valid'

export const createShortUrlInput = z.object({
  unshortenedUrl: z.url({ error: 'The url contains invalid characters' }),
  slug: z.string().refine(isSlugValid, {
    error: 'The slug contains invalid characters',
  }),
})

export type CreateShortUrlInput = z.input<typeof createShortUrlInput>

export type CreateShortUrlOutput = {
  id: string
}

export async function createShortUrlUseCase(
  input: CreateShortUrlInput
): Promise<Either<Error, CreateShortUrlOutput>> {
  const { unshortenedUrl, slug } = createShortUrlInput.parse(input)

  const result = await db
    .select({ slug: schema.shortenedUrls.slug })
    .from(schema.shortenedUrls)
    .where(eq(schema.shortenedUrls.slug, slug))

  if (result.length > 0) {
    return makeLeft(new ShortenedUrlAlreadyExists())
  }

  const [{ id }] = await db
    .insert(schema.shortenedUrls)
    .values({
      unshortenedUrl,
      slug,
    })
    .returning({ id: schema.shortenedUrls.id })

  return makeRight({ id })
}
