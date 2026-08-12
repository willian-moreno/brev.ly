import logoSvg from '@/assets/logo.svg'
import { CreateShortUrlFormCard } from './create-short-url-form-card'
import { MyUrlsCard } from './my-urls-card'

export function Home() {
  return (
    <div className="flex w-full flex-col py-3">
      <img
        alt="Brev.ly"
        className="mx-auto my-6 h-8 w-fit md:ml-0"
        src={logoSvg}
      />
      <div className="grid grid-cols-12 gap-3">
        <CreateShortUrlFormCard
          cardRoot={{ className: 'col-span-12 md:col-span-5' }}
        />
        <MyUrlsCard cardRoot={{ className: 'col-span-12 md:col-span-7' }} />
      </div>
    </div>
  )
}
