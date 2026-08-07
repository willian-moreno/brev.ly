import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { FindUrlsOutput } from '@/api/find-urls'
import { type RemoveUrlInput, removeUrl } from '@/api/remove-url'
import { urlsKeys } from './_keys'

export function useRemoveUrlMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeUrl,

    async onMutate(input: RemoveUrlInput) {
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

          const itemExists = oldData.items.some(
            item => item.slug === input.params.slug
          )

          if (!itemExists) {
            return oldData
          }

          return {
            ...oldData,
            items: [
              ...oldData.items.filter(item => item.slug !== input.params.slug),
            ],
            total: oldData.total - 1,
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
