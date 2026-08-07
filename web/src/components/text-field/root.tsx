import { WarningIcon } from '@phosphor-icons/react'

interface RootProps extends React.ComponentProps<'div'> {
  error?: string
}

export function Root({ children, error }: RootProps) {
  return (
    <div
      className="group flex flex-col gap-2"
      data-error-active={!!error}
    >
      {children}
      {error && (
        <div className="flex gap-2">
          <WarningIcon className="min-w-fit text-brand-danger text-brand-lg" />
          <span className="text-brand-sm">{error}</span>
        </div>
      )}
    </div>
  )
}
