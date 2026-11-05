import type { ReactNode } from 'react'

const ROW_ACTION_CLASSES =
  'inline-flex h-8 w-24 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-950 shadow-sm hover:bg-zinc-50'

export interface RowActionButtonProps {
  label: string
  ariaLabel: string
  href?: string
  onClick?: () => void
}

/** Botão de ação de linha de tabela ("Enviar", "Baixar"); vira link quando recebe `href`. */
export function RowActionButton({ label, ariaLabel, href, onClick }: RowActionButtonProps): ReactNode {
  if (href) {
    return (
      <a aria-label={ariaLabel} className={ROW_ACTION_CLASSES} href={href}>
        {label}
      </a>
    )
  }
  return (
    <button type="button" aria-label={ariaLabel} className={ROW_ACTION_CLASSES} onClick={onClick}>
      {label}
    </button>
  )
}
