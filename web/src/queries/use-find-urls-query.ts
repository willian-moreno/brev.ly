import { useQuery } from '@tanstack/react-query'
import { findUrls } from '@/api/find-urls'
import { urlsKeys } from './_keys'

export function useFindUrlsQuery() {
  return useQuery({
    queryKey: urlsKeys.list(),
    queryFn: () => findUrls(),
  })
}
