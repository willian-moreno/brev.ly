import { eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isUUIDv7Valid } from '@/shared/is-uuidv7-valid'

export const removeShortUrlInput = z.object({
  id: z.string().refine(isUUIDv7Valid, { error: 'The id format is invalid' }),
})

export type RemoveShortUrlInput = z.input<typeof removeShortUrlInput>

export async function removeShortUrlUseCase(
  input: RemoveShortUrlInput
): Promise<void> {
  const { id } = removeShortUrlInput.parse(input)

  await db.delete(schema.shortenedUrls).where(eq(schema.shortenedUrls.id, id))
}
