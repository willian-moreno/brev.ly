import { cn } from 'tailwind-variants'

interface InputProps extends React.ComponentProps<'input'> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <div className="h-12 overflow-hidden rounded-lg bg-white px-4 ring-1 ring-brand-gray-300 ring-inset focus-within:ring-brand-blue-base group-data-[error-active=true]:ring-brand-danger!">
      <input
        className={cn(
          'h-full w-full bg-transparent text-brand-gray-600 outline-none placeholder:text-brand-gray-400',
          className
        )}
        {...props}
      />
    </div>
  )
}
