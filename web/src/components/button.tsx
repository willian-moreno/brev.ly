import { CircleNotchIcon } from '@phosphor-icons/react'
import { cn, tv, type VariantProps } from 'tailwind-variants'

const variants = tv({
  slots: {
    base: 'flex relative overflow-hidden cursor-pointer items-center justify-center rounded-lg transition-all disabled:pointer-events-none disabled:opacity-50 disabled:outline-none!',
    icon: 'animate-spin',
  },

  variants: {
    variant: {
      primary: {
        base: 'bg-brand-blue-base text-white! ring-1 ring-brand-blue-base hover:bg-brand-blue-dark hover:ring-brand-blue-dark focus-visible:bg-brand-blue-dark focus-visible:outline-1 focus-visible:outline-brand-blue-dark focus-visible:outline-offset-2',
        icon: 'text-white!',
      },
      secondary: {
        base: 'bg-brand-gray-200 text-brand-gray-500! hover:ring-1 hover:ring-brand-blue-base focus-visible:outline-1 focus-visible:outline-brand-blue-base focus-visible:outline-offset-2',
        icon: 'text-brand-gray-500!',
      },
      destructive: {
        base: 'bg-brand-danger text-white! ring-1 ring-brand-danger hover:bg-rose-800 hover:ring-rose-800 focus-visible:bg-rose-800 focus-visible:outline-1 focus-visible:outline-rose-800 focus-visible:outline-offset-2',
        icon: 'text-white!',
      },
    },
    density: {
      default: {
        base: 'h-12 gap-3 px-5 text-brand-md',
        icon: 'text-brand-lg',
      },
      compact: {
        base: 'h-8 gap-1.5 px-2 font-semibold! text-brand-sm rounded-sm',
        icon: 'text-brand-md',
      },
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
  icon?: boolean
}

export function Button({
  children,
  className,
  variant,
  density,
  loading,
  icon,
  ...props
}: ButtonProps) {
  const classes = variants({
    variant: icon ? 'secondary' : variant,
    density: icon ? 'compact' : density,
  })

  return (
    <button
      className={cn(classes.base({ variant }), icon && 'w-8')}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <CircleNotchIcon className={classes.icon({ variant })} />
        </div>
      )}
      {children}
    </button>
  )
}
