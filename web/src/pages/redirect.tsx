import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import logoIconSvg from '@/assets/logo-icon.svg'
import { Card } from '@/components/card'
import { useFindUnshortenedUrlQuery } from '@/queries/use-find-unshortened-url-query'
import { useIncreaseUrlVisitMutation } from '@/queries/use-increase-url-visit-mutation'

export function Redirect() {
  const navigate = useNavigate()

  const { slug = '' } = useParams<{ slug: string }>()

  const { data, isError, isSuccess } = useFindUnshortenedUrlQuery({
    params: { slug },
  })

  const { mutate: increaseUrlVisitMutationFn } = useIncreaseUrlVisitMutation()

  useEffect(() => {
    if (isError) {
      navigate('/not-found', { replace: true })
      return
    }

    if (!isSuccess || !data) {
      return
    }

    increaseUrlVisitMutationFn({ params: { slug } })

    window.location.replace(data.unshortenedUrl)
  }, [slug, data, isError, isSuccess, navigate, increaseUrlVisitMutationFn])

  return (
    <>
      <Helmet title="Redirecionando..." />
      <div className="flex min-h-dvh w-full flex-col">
        <Card.Root className="mx-auto my-auto w-full max-w-145">
          <Card.Content className="gap-6 px-5 py-12 md:px-12 md:py-16">
            <img
              alt="Brev.ly"
              className="mx-auto h-12 w-fit"
              src={logoIconSvg}
            />
            <span className="text-center text-brand-xl">Redirecionando...</span>
            <div>
              <p className="text-center text-brand-gray-500 text-brand-md">
                O link será aberto automaticamente em alguns instantes.
              </p>
              <p className="text-center text-brand-gray-500 text-brand-md">
                Não foi redirecionado?{' '}
                <a
                  className="text-brand-blue-base underline"
                  href="/"
                >
                  Acesse aqui
                </a>
                .
              </p>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </>
  )
}
