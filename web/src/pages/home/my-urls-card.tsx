import { DownloadSimpleIcon, LinkIcon } from '@phosphor-icons/react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Separator } from '@/components/separator'
import { Toast } from '@/components/toast'
import { URLListItem } from '@/components/url-list-item'
import { URLListItemSkeleton } from '@/components/url-list-item-skeleton'
import { useExportUrlsQuery } from '@/queries/use-export-urls-query'
import { useFindUrlsQuery } from '@/queries/use-find-urls-query'
import { downloadUrl } from '@/utils/download-url'

interface MyUrlsCardProps {
  cardRoot: React.ComponentProps<'div'>
}

export function MyUrlsCard({ cardRoot }: MyUrlsCardProps) {
  const { data: urls, isLoading: isUrlsLoading } = useFindUrlsQuery()

  const { isFetching: isExportUrlsFetching, refetch } = useExportUrlsQuery()

  const isExportUrlsDisabled = !urls || urls.total === 0 || isExportUrlsFetching

  async function handleExportUrls() {
    const { data } = await refetch()

    if (!data) {
      toast.custom(id => (
        <Toast
          id={id}
          title="Não foi possível exportar os links."
          type="error"
        />
      ))

      return
    }

    const { reportUrl } = data
    const url = new URL(reportUrl)
    const fileName = url.pathname.split('/').at(-1) as string

    downloadUrl(reportUrl, fileName)
  }

  return (
    <Card.Root className={cardRoot.className}>
      <Card.Content>
        <div className="mb-4 flex items-center justify-between gap-4 md:mb-5">
          <span className="text-brand-lg">Meus links</span>
          <Button
            density="compact"
            disabled={isExportUrlsDisabled}
            loading={isExportUrlsFetching}
            onClick={handleExportUrls}
            variant="secondary"
          >
            <DownloadSimpleIcon className="text-brand-gray-600 text-brand-lg" />
            Baixar CSV
          </Button>
        </div>
        <Separator />
        <ScrollArea.Root
          className="-mx-2.5 mt-3 overflow-hidden px-2.5 md:mt-4"
          type="hover"
        >
          <ScrollArea.Viewport className="[&>div]:block! max-h-100">
            {isUrlsLoading ? (
              <div className="space-y-3 md:space-y-4">
                <URLListItemSkeleton />
                <Separator />
                <URLListItemSkeleton />
                <Separator />
                <URLListItemSkeleton />
              </div>
            ) : urls && urls.total > 0 ? (
              <ul className="space-y-3 md:space-y-4">
                {urls.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 && <Separator />}
                    <URLListItem url={item} />
                  </React.Fragment>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center gap-3 pt-4 pb-6">
                <LinkIcon className="text-brand-gray-400 text-brand-xl" />
                <span className="text-brand-gray-500 text-brand-xs uppercase">
                  Ainda não existem links cadastrados
                </span>
              </div>
            )}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex touch-none select-none bg-white p-0.5 transition-colors duration-160 ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="relative flex-1 cursor-pointer rounded-[10px] bg-brand-gray-200 before:absolute before:top-1/2 before:left-1/2 before:size-full before:min-h-11 before:-translate-x-1/2 before:-translate-y-1/2" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Card.Content>
    </Card.Root>
  )
}
