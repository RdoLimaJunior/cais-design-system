import { cn } from '../../lib/utils'
import { Spinner } from '../ui/spinner'

export interface PageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Texto abaixo do indicador (por exemplo, "Carregando projetos..."). */
  label?: string
}

/** Carregamento de uma página ou seção inteira que ainda não tem dados: indicador centralizado e legenda opcional. */
export function PageLoader({ label, className, ...props }: PageLoaderProps) {
  return (
    <div
      data-slot="page-loader"
      role="status"
      aria-live="polite"
      aria-label={label ? undefined : 'Carregando'}
      className={cn('flex min-h-[400px] flex-1 flex-col items-center justify-center gap-3', className)}
      {...props}
    >
      <Spinner className="size-10 text-primary" aria-hidden="true" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  )
}
