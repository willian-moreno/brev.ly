import { cn } from 'tailwind-variants'

interface InputProps extends React.ComponentProps<'input'> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-full w-full bg-transparent font-normal text-brand-gray-600 text-brand-md outline-none placeholder:text-brand-gray-300 autofill:bg-transparent',
        className
      )}
      {...props}
    />
  )
}
