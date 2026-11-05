import type { ReactNode } from 'react'
import type { BreadcrumbItem } from '../farol/PageBreadcrumb'
import { PageCard } from '../farol/PageCard'
import type { PmoRole } from './navigation'
import { PmoShell } from './PmoShell'

export interface PmoPageProps {
  activeHref: string
  breadcrumb: BreadcrumbItem[]
  title: string
  subtitle?: string
  /** Botões principais da página, à direita do título. */
  actions?: ReactNode
  role?: PmoRole
  userName?: string
  children: ReactNode
}

/** Página padrão do CAIS PMO: casca com menu, breadcrumb e um `PageCard` com título, ações e corpo em colunas. */
export function PmoPage({ activeHref, breadcrumb, title, subtitle, actions, role, userName, children }: PmoPageProps) {
  return (
    <PmoShell activeHref={activeHref} breadcrumb={breadcrumb} role={role} userName={userName}>
      <PageCard
        title={title}
        subtitle={subtitle}
        actions={actions}
        bodyClassName="flex flex-1 flex-col gap-4 px-5 py-4"
      >
        {children}
      </PageCard>
    </PmoShell>
  )
}
