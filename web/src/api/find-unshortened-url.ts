import z from 'zod'
import { api } from '@/libs/axios'
import { slugSchema, unshortenedUrlSchema } from '@/schemas'

export const findUnshortenedUrlParamsSchema = z.object({
  slug: slugSchema,
})

export const findUnshortenedUrlInputSchema = z.object({
  params: findUnshortenedUrlParamsSchema,
})

export const findUnshortenedUrlOutputSchema = z.object({
  unshortenedUrl: unshortenedUrlSchema,
})

export type FindUnshortenedUrlInput = z.input<
  typeof findUnshortenedUrlInputSchema
>

export async function findUnshortenedUrl(input: FindUnshortenedUrlInput) {
  const { params } = findUnshortenedUrlInputSchema.parse(input)
  const { slug } = params

  const response = await api.get(`/urls/${slug}/unshortened`)

  const { unshortenedUrl } = findUnshortenedUrlOutputSchema.parse(response.data)

  return {
    unshortenedUrl,
  }
}
