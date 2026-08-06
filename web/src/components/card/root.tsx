import { cn } from 'tailwind-variants'

interface RootProps extends React.ComponentProps<'div'> {}

export function Root({ className, ...props }: RootProps) {
  return (
    <div
      className={cn('h-fit overflow-hidden rounded-lg bg-white', className)}
      {...props}
    />
  )
}
