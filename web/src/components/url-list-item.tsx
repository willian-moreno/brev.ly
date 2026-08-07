import { CopyIcon, TrashIcon } from '@phosphor-icons/react'
import type { MutationOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { RemoveUrlInput } from '@/api/remove-url'
import { useRemoveUrlMutation } from '@/queries/use-remove-url-mutation'
import type { Url } from '@/schemas'
import { Button } from './button'
import { Toast } from './toast'

interface URLListItemProps {
  url: Url
}

export function URLListItem({ url }: URLListItemProps) {
  const redirectUrl = `${location.origin}/${url.slug}`

  const { mutate: removeUrlFn, isPending: isRemoveUrlPending } =
    useRemoveUrlMutation()

  async function handleRemoveUrl() {
    const variables: RemoveUrlInput = {
      params: {
        slug: url.slug,
      },
    }

    const options: MutationOptions<void, Error, RemoveUrlInput> = {
      onSuccess() {
        toast.custom(id => (
          <Toast
            id={id}
            title="Link removido com sucesso."
            type="success"
          />
        ))
      },
      onError() {
        toast.custom(id => (
          <Toast
            id={id}
            title="Não foi possível remover o link."
            type="error"
          />
        ))
      },
    }

    removeUrlFn(variables, options)
  }

  async function handleCopyToClipboard() {
    await navigator.clipboard.writeText(redirectUrl)

    toast.custom(id => (
      <Toast
        id={id}
        title="Link copiado para a área de transferência."
        type="success"
      />
    ))
  }

  return (
    <li className="flex list-none items-center gap-4 md:gap-5">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <a
          className="block truncate text-brand-blue-base text-brand-md transition-all hover:text-brand-blue-dark focus-visible:outline-1 focus-visible:outline-brand-blue-base focus-visible:outline-offset-2"
          href={redirectUrl}
          rel="noopener"
          target="_blank"
        >
          {location.host}/{url.slug}
        </a>
        <span className="block truncate text-brand-gray-500 text-brand-sm">
          {url.unshortenedUrl}
        </span>
      </div>
      {url.totalVisits > 0 && (
        <span className="text-brand-gray-500 text-brand-sm">
          {url.totalVisits > 1 ? `${url.totalVisits} acessos` : '1 acesso'}
        </span>
      )}
      <div className="flex gap-1">
        <Button
          icon
          onClick={handleCopyToClipboard}
        >
          <CopyIcon className="text-brand-gray-600 text-brand-lg" />
        </Button>
        <Button
          disabled={isRemoveUrlPending}
          icon
          loading={isRemoveUrlPending}
          onClick={handleRemoveUrl}
        >
          <TrashIcon className="text-brand-gray-600 text-brand-lg" />
        </Button>
      </div>
    </li>
  )
}
