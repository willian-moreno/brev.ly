export function URLListItemSkeleton() {
  return (
    <div className="flex list-none items-center gap-4 md:gap-5">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="block w-fit animate-pulse truncate bg-brand-gray-200 text-brand-md text-transparent!">
          {'a'.repeat(15)}
        </span>
        <span className="block w-fit animate-pulse truncate bg-brand-gray-200 text-brand-sm text-transparent!">
          {'a'.repeat(45)}
        </span>
      </div>
      <span className="animate-pulse bg-brand-gray-200 text-brand-sm text-transparent!">
        {'a'.repeat(9)}
      </span>
      <div className="flex gap-1">
        <div className="h-8 w-8 animate-pulse rounded-sm bg-brand-gray-200" />
        <div className="h-8 w-8 animate-pulse rounded-sm bg-brand-gray-200" />
      </div>
    </div>
  )
}
