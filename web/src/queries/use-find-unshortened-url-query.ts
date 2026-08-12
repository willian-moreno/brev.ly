import { useQuery } from '@tanstack/react-query'
import {
  type FindUnshortenedUrlInput,
  findUnshortenedUrl,
} from '@/api/find-unshortened-url'
import { urlsKeys } from './_keys'

export function useFindUnshortenedUrlQuery(input: FindUnshortenedUrlInput) {
  return useQuery({
    queryKey: urlsKeys.unshortenedUrl(input.params),
    queryFn: () => findUnshortenedUrl(input),
    enabled: Boolean(input.params.slug),
  })
}
