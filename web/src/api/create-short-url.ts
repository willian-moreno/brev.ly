import z from 'zod'
import { api } from '@/libs/axios'
import { slugSchema, unshortenedUrlSchema } from '@/schemas'

export const createShortUrlBodySchema = z.object({
  unshortenedUrl: unshortenedUrlSchema,
  slug: slugSchema,
})

export const createShortUrlInputSchema = z.object({
  body: createShortUrlBodySchema,
})

export type CreateShortUrlInput = z.input<typeof createShortUrlInputSchema>

export async function createShortUrl(input: CreateShortUrlInput) {
  const { body } = createShortUrlInputSchema.parse(input)
  const { unshortenedUrl, slug } = body

  await api.post('/urls', { unshortenedUrl, slug })
}
