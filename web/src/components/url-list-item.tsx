import { CopyIcon, TrashIcon } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
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
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button icon>
              <TrashIcon className="text-brand-gray-600 text-brand-lg" />
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/15 backdrop-blur-xs transition-all" />
            <Dialog.Content className="fixed top-1/2 left-1/2 flex h-fit w-120 max-w-[95dvw] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg bg-white p-6 shadow-brand-gray-600/5 shadow-xl ring-1 ring-brand-gray-200 transition-all md:p-8">
              <Dialog.Title className="mb-3 text-brand-xl">
                Remover link?
              </Dialog.Title>
              <Dialog.Description className="mb-6 text-brand-gray-500 text-brand-md">
                Tem certeza de que deseja remover este link? Essa ação não
                poderá ser desfeita.
              </Dialog.Description>
              <div className="flex items-center justify-between gap-4">
                <Dialog.Close asChild>
                  <Button
                    density="compact"
                    variant="secondary"
                  >
                    Cancelar
                  </Button>
                </Dialog.Close>
                <Button
                  density="compact"
                  disabled={isRemoveUrlPending}
                  loading={isRemoveUrlPending}
                  onClick={handleRemoveUrl}
                  variant="destructive"
                >
                  Remover
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </li>
  )
}
