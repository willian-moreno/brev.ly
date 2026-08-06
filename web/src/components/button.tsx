import { CircleNotchIcon } from '@phosphor-icons/react'
import { tv, type VariantProps } from 'tailwind-variants'

const variants = tv({
  base: 'flex cursor-pointer items-center justify-center rounded-lg disabled:pointer-events-none disabled:opacity-50 disabled:outline-none!',
  variants: {
    variant: {
      primary:
        'bg-brand-blue-base text-white! hover:bg-brand-blue-dark focus-visible:bg-brand-blue-dark focus-visible:outline-1 focus-visible:outline-brand-blue-dark focus-visible:outline-offset-2',
      secondary:
        'bg-brand-gray-200 text-brand-gray-500! hover:ring-1 hover:ring-brand-blue-base hover:ring-inset focus-visible:outline-1 focus-visible:outline-brand-blue-base focus-visible:outline-offset-2',
    },
    density: {
      default: 'h-12 gap-3 px-5 text-brand-md',
      compact: 'h-8 gap-1.5 px-2 font-semibold! text-brand-sm rounded-sm',
    },
  },
  defaultVariants: {
    variant: 'primary',
    density: 'default',
  },
})

interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof variants> {
  loading?: boolean
}

export function Button({
  children,
  className,
  variant,
  density,
  loading,
  ...props
}: ButtonProps) {
  return (
    <button
      className={variants({ className, variant, density })}
      {...props}
    >
      {loading ? (
        <CircleNotchIcon className="animate-spin text-brand-md" />
      ) : (
        children
      )}
    </button>
  )
}
