import { cn } from 'tailwind-variants'

interface FieldProps extends React.ComponentProps<'div'> {}

export function Field({ className, ...props }: FieldProps) {
  return (
    <div
      className={cn(
        'flex h-12 items-center overflow-hidden rounded-lg bg-white px-4 ring-1 ring-brand-gray-300 transition-all focus-within:ring-brand-blue-base group-data-[error-active=true]:ring-brand-danger!',
        className
      )}
      {...props}
    />
  )
}
