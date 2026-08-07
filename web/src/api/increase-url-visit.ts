import z from 'zod'
import { api } from '@/libs/axios'
import { slugSchema } from '@/schemas'

export const increaseUrlParamsSchema = z.object({
  slug: slugSchema,
})

export const increaseUrlInputSchema = z.object({
  params: increaseUrlParamsSchema,
})

export type IncreaseUrlInput = z.input<typeof increaseUrlInputSchema>

export async function increaseUrl(input: IncreaseUrlInput) {
  const { params } = increaseUrlInputSchema.parse(input)
  const { slug } = params

  await api.patch(`/urls/${slug}/access`)
}
