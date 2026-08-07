import type z from 'zod'
import type { findUrlsQuerySchema } from '@/api/find-urls'

export const urlsKeys = {
  all: ['urls'] as const,

  lists: () => [...urlsKeys.all, 'list'] as const,

  list: (filters?: z.infer<typeof findUrlsQuerySchema>) =>
    [...urlsKeys.lists(), filters] as const,

  exports: () => [...urlsKeys.all, 'export'] as const,
}
