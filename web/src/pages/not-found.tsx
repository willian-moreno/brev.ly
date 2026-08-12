import { Helmet } from 'react-helmet-async'
import notFoundSvg from '@/assets/404.svg'
import { Card } from '@/components/card'

export function NotFound() {
  return (
    <>
      <Helmet title="Página não encontrada" />
      <div className="flex min-h-dvh w-full flex-col">
        <Card.Root className="mx-auto my-auto max-w-145">
          <Card.Content className="gap-6 px-5 py-12 md:px-12 md:py-16">
            <img
              alt="404"
              className="mx-auto h-18 w-fit md:h-20"
              src={notFoundSvg}
            />
            <span className="text-center text-brand-xl">
              Link não encontrado
            </span>
            <p className="text-center text-brand-gray-500 text-brand-md">
              O link que você está tentando acessar não existe, foi removido ou
              é uma URL inválida. Saiba mais em{' '}
              <a
                className="text-brand-blue-base"
                href="/"
              >
                brev.ly
              </a>
              .
            </p>
          </Card.Content>
        </Card.Root>
      </div>
    </>
  )
}
