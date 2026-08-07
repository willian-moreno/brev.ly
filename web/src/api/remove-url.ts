import z from 'zod'
import { api } from '@/libs/axios'
import { slugSchema } from '@/schemas'

export const removeUrlParamsSchema = z.object({
  slug: slugSchema,
})

export const removeUrlInputSchema = z.object({
  params: removeUrlParamsSchema,
})

export type RemoveUrlInput = z.input<typeof removeUrlInputSchema>

export async function removeUrl(input: RemoveUrlInput) {
  const { params } = removeUrlInputSchema.parse(input)
  const { slug } = params

  await api.delete(`/urls/${slug}`)
}
