import type { ReactNode } from 'react'
import { PageTitle } from './PageHeading'

export interface PageCardProps {
  title: string
  subtitle?: string
  /** Selos de situação (por exemplo, status do projeto), na linha abaixo do título, antes do subtítulo. */
  badges?: ReactNode
  footer?: ReactNode
  /** Botões principais da página, à direita do título (abaixo dele no celular). */
  actions?: ReactNode
  /** Troca as classes do corpo; os termos e documentos usam uma grade de passos em vez do corpo padrão. */
  bodyClassName?: string
  children: ReactNode
}

/** Card de página inteira: cabeçalho, corpo e rodapé de ações sempre encostado na base da tela. */
const DEFAULT_BODY_CLASSES = 'flex flex-1 flex-col px-5 py-4'

export function PageCard({
  title,
  subtitle,
  badges,
  footer,
  actions,
  bodyClassName = DEFAULT_BODY_CLASSES,
  children,
}: PageCardProps) {
  return (
    <article className="flex min-h-[calc(100dvh-72px)] flex-col overflow-clip rounded bg-white shadow-sm">
      <header className="flex flex-col gap-3 border-b border-zinc-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 sm:flex-1">
          <PageTitle>{title}</PageTitle>
          {(badges || subtitle) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              {badges}
              {subtitle && <p className="text-sm leading-5 font-normal text-zinc-500">{subtitle}</p>}
            </div>
          )}
        </div>
        {actions && <div className="flex flex-col gap-2 max-sm:[&>[data-slot=button]]:h-auto max-sm:[&>[data-slot=button]]:min-h-8 max-sm:[&>[data-slot=button]]:whitespace-normal sm:shrink-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">{actions}</div>}
      </header>
      <div className={bodyClassName}>{children}</div>
      {footer && <footer className="mt-auto flex justify-end border-t border-zinc-100 px-5 py-4">{footer}</footer>}
    </article>
  )
}
