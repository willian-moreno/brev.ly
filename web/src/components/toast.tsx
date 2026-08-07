import { XIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { tv, type VariantProps } from 'tailwind-variants'

const variants = tv({
  slots: {
    base: 'relative flex min-h-14 select-none flex-col justify-center gap-0.5 rounded-lg bg-white px-6 py-4 shadow-brand-gray-600/5 shadow-xl ring-1 ring-brand-gray-200 transition-all',
    closeBtn:
      'group absolute top-1 right-1 flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm border-none bg-transparent focus-visible:outline-1 focus-visible:outline-brand-gray-500 focus-visible:outline-offset-2',
    closeIcon:
      'text-brand-gray-300 text-brand-md transition-all group-hover:text-brand-gray-600 group-focus-visible:text-brand-gray-600',
    title: 'text-brand-gray-500 text-brand-md',
    description: 'font-normal! text-brand-gray-400 text-brand-md',
  },

  variants: {
    type: {
      success: {
        base: 'bg-emerald-50 ring-emerald-200',
        closeBtn: 'focus-visible:outline-emerald-500',
        closeIcon:
          'text-emerald-300 group-hover:text-emerald-500 group-focus-visible:text-emerald-500',
        title: 'text-emerald-600!',
        description: 'text-emerald-600!',
      },
      error: {
        base: 'bg-rose-50 ring-rose-200',
        closeBtn: 'focus-visible:outline-rose-500',
        closeIcon:
          'text-rose-300 group-hover:text-rose-500 group-focus-visible:text-rose-500',
        title: 'text-rose-600!',
        description: 'text-rose-600!',
      },
      warning: {
        base: 'bg-amber-50 ring-amber-200',
        closeBtn: 'focus-visible:outline-amber-500',
        closeIcon:
          'text-amber-300 group-hover:text-amber-500 group-focus-visible:text-amber-500',
        title: 'text-amber-600!',
        description: 'text-amber-600!',
      },
      info: {
        base: 'bg-sky-50 ring-sky-200',
        closeBtn: 'focus-visible:outline-sky-500',
        closeIcon:
          'text-sky-300 group-hover:text-sky-500 group-focus-visible:text-sky-500',
        title: 'text-sky-600!',
        description: 'text-sky-600!',
      },
    },
  },
})

interface ToastProps extends VariantProps<typeof variants> {
  id: string | number
  title?: string
  description?: string
}

export function Toast({ id, title, description, type }: ToastProps) {
  const classes = variants({ type })

  function handleDismiss() {
    toast.dismiss(id)
  }

  return (
    <div className={classes.base({ type })}>
      <button
        className={classes.closeBtn({ type })}
        onClick={handleDismiss}
        type="button"
      >
        <XIcon className={classes.closeIcon({ type })} />
      </button>

      {title && <span className={classes.title({ type })}>{title}</span>}
      {description && (
        <span className={classes.description({ type })}>{description}</span>
      )}
    </div>
  )
}
