import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { FindUrlsOutput } from '@/api/find-urls'
import { increaseUrlVisit } from '@/api/increase-url-visit'
import type { IncreaseUrlVisitInput } from '../api/increase-url-visit'
import { urlsKeys } from './_keys'

export function useIncreaseUrlVisitMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: increaseUrlVisit,

    async onMutate(input: IncreaseUrlVisitInput) {
      await queryClient.cancelQueries({
        queryKey: urlsKeys.lists(),
      })

      const previousUrls = queryClient.getQueriesData<FindUrlsOutput>({
        queryKey: urlsKeys.lists(),
      })

      queryClient.setQueriesData<FindUrlsOutput>(
        { queryKey: urlsKeys.lists() },
        oldData => {
          if (!oldData) {
            return oldData
          }

          return {
            ...oldData,
            items: oldData.items.map(item => {
              if (item.slug === input.params.slug) {
                return {
                  ...item,
                  totalVisits: item.totalVisits + 1,
                }
              }

              return item
            }),
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
