import z from 'zod'
import { api } from '@/libs/axios'
import { slugSchema } from '@/schemas'

export const increaseUrlVisitParamsSchema = z.object({
  slug: slugSchema,
})

export const increaseUrlVisitInputSchema = z.object({
  params: increaseUrlVisitParamsSchema,
})

export type IncreaseUrlVisitInput = z.input<typeof increaseUrlVisitInputSchema>

export async function increaseUrlVisit(input: IncreaseUrlVisitInput) {
  const { params } = increaseUrlVisitInputSchema.parse(input)
  const { slug } = params

  await api.patch(`/urls/${slug}/access`)
}
