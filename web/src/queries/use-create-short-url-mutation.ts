import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  type CreateShortUrlInput,
  createShortUrl,
} from '@/api/create-short-url'
import type { FindUrlsOutput } from '@/api/find-urls'
import type { Url } from '@/schemas'
import { urlsKeys } from './_keys'

export function useCreateShortUrlMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createShortUrl,

    async onMutate(input: CreateShortUrlInput) {
      await queryClient.cancelQueries({
        queryKey: urlsKeys.lists(),
      })

      const previousUrls = queryClient.getQueriesData<FindUrlsOutput>({
        queryKey: urlsKeys.lists(),
      })

      const optimisticUrl: Url = {
        id: crypto.randomUUID(),
        slug: input.body.slug,
        unshortenedUrl: input.body.unshortenedUrl,
        totalVisits: 0,
        createdAt: new Date().toISOString(),
      }

      queryClient.setQueriesData<FindUrlsOutput>(
        { queryKey: urlsKeys.lists() },
        oldData => {
          if (!oldData) {
            return oldData
          }

          return {
            ...oldData,
            items: [optimisticUrl, ...oldData.items],
            total: oldData.total + 1,
          }
        }
      )

      return {
        previousUrls,
      }
    },

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: urlsKeys.lists(),
      })
    },

    onError(_, __, context) {
      context?.previousUrls.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
  })
}
