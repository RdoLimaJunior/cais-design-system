import type { ReactNode } from 'react'
import { PageTitle } from './PageHeading'

export interface PageCardProps {
  title: string
  subtitle?: string
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
  footer,
  actions,
  bodyClassName = DEFAULT_BODY_CLASSES,
  children,
}: PageCardProps) {
  return (
    <article className="flex min-h-[calc(100dvh-72px)] flex-col overflow-hidden rounded bg-white shadow-sm">
      <header className="flex flex-col gap-3 border-b border-zinc-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <PageTitle>{title}</PageTitle>
          {subtitle && <p className="mt-1 text-sm leading-5 font-normal text-zinc-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-col gap-2 sm:flex-row">{actions}</div>}
      </header>
      <div className={bodyClassName}>{children}</div>
      {footer && <footer className="mt-auto flex justify-end border-t border-zinc-100 px-5 py-4">{footer}</footer>}
    </article>
  )
}
