import { cn } from 'tailwind-variants'

interface SeparatorProps extends React.ComponentProps<'span'> {}

export function Separator({ className, ...props }: SeparatorProps) {
  return (
    <span
      className={cn('block h-px bg-brand-gray-200', className)}
      {...props}
    />
  )
}
