import { z } from 'zod'

export const envSchema = z.object({
  MODE: z.enum(['production', 'development']).default('production'),
  VITE_API_URL: z.url(),
  VITE_ENABLE_API_DELAY: z.string().transform(value => value === 'true'),
})

export const env = envSchema.parse(import.meta.env)
