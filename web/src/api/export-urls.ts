import z from 'zod'
import { api } from '@/libs/axios'

export const exportUrlsQuerySchema = z
  .object({
    search: z.string().optional(),
  })
  .optional()

export const exportUrlsInputSchema = z
  .object({ query: exportUrlsQuerySchema })
  .optional()

export const exportUrlsOutputSchema = z.object({
  reportUrl: z.url(),
})

export type ExportUrlsInput = z.input<typeof exportUrlsInputSchema>

export async function exportUrls(input?: ExportUrlsInput) {
  const parse = exportUrlsInputSchema.parse(input)

  const response = await api.post<{ reportUrl: string }>(
    '/urls/exports',
    {},
    {
      params: {
        search: parse?.query?.search,
      },
    }
  )

  const { reportUrl } = exportUrlsOutputSchema.parse(response.data)

  return {
    reportUrl,
  }
}
