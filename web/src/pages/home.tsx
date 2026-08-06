import { DownloadSimpleIcon, LinkIcon } from '@phosphor-icons/react'
import logoSvg from '@/assets/logo.svg'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Separator } from '@/components/separator'
import { TextField } from '@/components/text-field'

export function Home() {
  return (
    <>
      <img
        alt="Brev.ly"
        className="mx-auto my-6 h-8 w-fit md:ml-0"
        src={logoSvg}
      />
      <div className="grid grid-cols-12 gap-3">
        <Card.Root className="col-span-12 md:col-span-5">
          <Card.Content className="gap-5 md:gap-6">
            <span className="text-brand-lg">Novo Link</span>
            <div className="space-y-4">
              <TextField.Root>
                <TextField.Label text="Link original">
                  <TextField.Input />
                </TextField.Label>
              </TextField.Root>
              <TextField.Root>
                <TextField.Label text="Link encurtado">
                  <TextField.Input />
                </TextField.Label>
              </TextField.Root>
            </div>
            <Button
              disabled
              type="submit"
            >
              Salvar link
            </Button>
          </Card.Content>
        </Card.Root>
        <Card.Root className="col-span-12 md:col-span-7">
          <Card.Content className="gap-5 md:gap-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-brand-lg">Meus links</span>
              <Button
                density="compact"
                disabled
                variant="secondary"
              >
                <DownloadSimpleIcon className="text-brand-gray-600 text-brand-lg" />
                Baixar CSV
              </Button>
            </div>
            <Separator />
            <div className="flex flex-col items-center gap-3 pt-4 pb-6">
              <LinkIcon className="text-brand-gray-400 text-brand-xl" />
              <span className="text-brand-gray-500 text-brand-xs uppercase">
                Ainda não existem links cadastrados
              </span>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </>
  )
}
