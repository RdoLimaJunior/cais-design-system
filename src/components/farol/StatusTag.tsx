import { cn } from '../../lib/utils'

export type StatusTagTone = 'info' | 'success' | 'received' | 'danger' | 'neutral' | 'warning'

export const STATUS_TONE_CLASSES: Record<StatusTagTone, string> = {
  info: 'border-[#0089e2] text-[#0089e2]',
  success: 'border-emerald-600 text-emerald-700',
  received: 'border-emerald-500 text-emerald-700',
  danger: 'border-red-500 text-red-600',
  neutral: 'border-zinc-400 text-zinc-600',
  warning: 'border-amber-500 text-amber-700',
}

export interface StatusTagProps {
  tone: StatusTagTone
  children: string
}

/** Selo de status usado dentro de tabelas (maior que o selo dos cards da Home). */
export function StatusTag({ tone, children }: StatusTagProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full border px-2.5 text-xs whitespace-nowrap',
        STATUS_TONE_CLASSES[tone],
      )}
    >
      {children}
    </span>
  )
}
