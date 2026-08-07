import { useQuery } from '@tanstack/react-query'
import { exportUrls } from '@/api/export-urls'
import { urlsKeys } from './_keys'

export function useExportUrlsQuery() {
  return useQuery({
    queryKey: urlsKeys.exports(),
    queryFn: () => exportUrls(),
    enabled: false,
  })
}
