import { Fragment } from 'react'
import { IconChevronRight } from '@tabler/icons-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

/** O FAROL monta o breadcrumb de um jeito diferente em cada família de telas; cada variante copia uma delas. */
export type BreadcrumbVariant =
  | 'plain'
  | 'profile'
  | 'edit'
  | 'edit-compact'
  | 'document'
  | 'reports-list'
  | 'report-detail'

interface VariantStyle {
  navClassName: string
  linkClassName: string
  separator: 'chevron-text' | 'chevron-text-spaced' | 'chevron-text-muted' | 'chevron-icon'
  currentHasAriaCurrent: boolean
}

const VARIANT_STYLES: Record<Exclude<BreadcrumbVariant, 'plain'>, VariantStyle> = {
  profile: {
    navClassName: 'mb-3 flex items-center gap-2 text-sm leading-5 font-normal tracking-normal text-black',
    linkClassName: 'hover:text-[#0089e2]',
    separator: 'chevron-text',
    currentHasAriaCurrent: false,
  },
  edit: {
    navClassName: 'mb-3 text-sm leading-5 text-black',
    linkClassName: 'rounded-sm hover:text-[#0089E2] focus-visible:outline-2',
    separator: 'chevron-text-spaced',
    currentHasAriaCurrent: false,
  },
  'edit-compact': {
    navClassName: 'mb-4 flex items-center gap-2 text-xs',
    linkClassName: 'hover:text-[#0089e2]',
    separator: 'chevron-text',
    currentHasAriaCurrent: false,
  },
  document: {
    navClassName: 'mb-3 flex items-center gap-2 text-sm text-black',
    linkClassName: 'hover:text-[#0089E2]',
    separator: 'chevron-icon',
    currentHasAriaCurrent: true,
  },
  'reports-list': {
    navClassName: 'mb-3 flex items-center gap-2 text-sm leading-5 text-black',
    linkClassName: 'hover:text-[#0089e2]',
    separator: 'chevron-text',
    currentHasAriaCurrent: true,
  },
  'report-detail': {
    navClassName: 'flex items-center gap-1.5 text-sm text-[#0A0A0A]',
    linkClassName: 'hover:underline',
    separator: 'chevron-text-muted',
    currentHasAriaCurrent: true,
  },
}

function Separator({ kind }: { kind: VariantStyle['separator'] }) {
  if (kind === 'chevron-icon') return <IconChevronRight className="size-3.5" />
  if (kind === 'chevron-text-spaced') {
    return (
      <span className="mx-2" aria-hidden="true">
        ›
      </span>
    )
  }
  if (kind === 'chevron-text-muted') return <span className="text-zinc-400">›</span>
  return <span aria-hidden="true">›</span>
}

export interface PageBreadcrumbProps {
  items: BreadcrumbItem[]
  variant?: BreadcrumbVariant
}

export function PageBreadcrumb({ items, variant = 'profile' }: PageBreadcrumbProps) {
  if (variant === 'plain' || items.length === 1) {
    return <p className="mb-3 text-sm leading-5 font-normal tracking-normal text-black">{items[0].label}</p>
  }

  const style = VARIANT_STYLES[variant]
  const lastIndex = items.length - 1

  return (
    <nav aria-label="Breadcrumb" className={style.navClassName}>
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 && <Separator kind={style.separator} />}
          {item.href ? (
            <a className={style.linkClassName} href={item.href}>
              {item.label}
            </a>
          ) : (
            <span aria-current={index === lastIndex && style.currentHasAriaCurrent ? 'page' : undefined}>
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
