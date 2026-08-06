import { cn } from 'tailwind-variants'

interface ContentProps extends React.ComponentProps<'div'> {}

export function Content({ className, ...props }: ContentProps) {
  return (
    <div
      className={cn('flex flex-col p-6 md:p-8', className)}
      {...props}
    />
  )
}
