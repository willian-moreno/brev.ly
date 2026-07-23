import { eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isSlugValid } from '@/shared/is-slug-valid'

export const removeShortUrlInput = z.object({
  slug: z
    .string()
    .refine(isSlugValid, { error: 'The slug contains invalid characters' }),
})

export type RemoveShortUrlInput = z.input<typeof removeShortUrlInput>

export async function removeShortUrlUseCase(
  input: RemoveShortUrlInput
): Promise<void> {
  const { slug } = removeShortUrlInput.parse(input)

  await db
    .delete(schema.shortenedUrls)
    .where(eq(schema.shortenedUrls.slug, slug))
}
