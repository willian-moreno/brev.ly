import z from 'zod'

export const unshortenedUrlSchema = z
  .url({
    error: 'O link informado é inválido',
  })
  .pipe(
    z.string().refine(
      value => {
        const url = new URL(value)
        return url.origin !== location.origin
      },
      {
        error: 'O link informado não pode ser o mesmo do site atual',
      }
    )
  )

export const slugSchema = z
  .string()
  .min(3, { error: 'São necessários pelo menos 3 caracteres' })
  .regex(/^[a-zA-Z0-9-_]+$/, {
    error:
      'O link encurtado deve conter apenas letras, números, hífens (-) e sublinhados (_)',
  })

export const urlSchema = z.object({
  id: z.string(),
  unshortenedUrl: z.url(),
  slug: z.string(),
  totalVisits: z.number(),
  createdAt: z.string(),
})

export const urlsSchema = z.array(urlSchema)

export type Url = z.infer<typeof urlSchema>
