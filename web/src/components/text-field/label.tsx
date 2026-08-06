import { cn } from 'tailwind-variants'

interface LabelProps extends React.ComponentProps<'label'> {
  text: string
}

export function Label({ children, text, ...props }: LabelProps) {
  return (
    <label {...props}>
      <span
        className={cn(
          'mb-2 block text-brand-xs uppercase group-focus-within:font-semibold group-focus-within:text-brand-blue-base group-data-[error-active=true]:text-brand-danger!'
        )}
      >
        {text}
      </span>
      {children}
    </label>
  )
}
