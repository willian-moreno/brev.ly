import z from 'zod'

export const unshortenedUrlSchema = z.url({
  error: 'The url contains invalid characters',
})

export const slugSchema = z
  .string()
  .min(3, { error: 'At least 3 characters are required' })
  .regex(/^[a-zA-Z0-9-_]+$/, {
    error:
      'The slug must contain only letters, numbers, hyphens (-), and underscores (_)',
  })

export const urlSchema = z.object({
  id: z.string(),
  unshortenedUrl: z.url(),
  slug: z.string(),
  totalVisits: z.number(),
  createdAt: z.date(),
})

export const urlsSchema = z.array(urlSchema)

export type Url = z.infer<typeof urlSchema>
