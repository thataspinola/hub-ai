import { cn } from '@/lib/utils'

function Empty({
  title,
  description,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { title?: string; description?: string }) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center md:p-12',
        className,
      )}
      {...props}
    >
      {title && (
        <p className="text-lg font-medium tracking-tight">{title}</p>
      )}
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
      {children}
    </div>
  )
}

export { Empty }
