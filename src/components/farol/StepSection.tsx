import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type StepState = 'active' | 'upcoming'

export interface StepSectionProps {
  stepNumber: number
  title: string
  /** Parágrafos de apoio sob o título; só o passo ativo costuma tê-los. */
  descriptions?: string[]
  /** Passo futuro que o site desenha com o título dentro de um `div`, sem parágrafos. */
  isTitleWrapped?: boolean
  state: StepState
  children?: ReactNode
}

/** Um passo de um fluxo (assinar termo, enviar documento): ativo, com conteúdo, ou futuro, só o título. */
export function StepSection({ stepNumber, title, descriptions = [], isTitleWrapped = false, state, children }: StepSectionProps) {
  const isActive = state === 'active'
  const [firstDescription, ...otherDescriptions] = descriptions

  return (
    <section className={cn('rounded-xl p-5', isActive ? 'border border-zinc-200' : 'bg-zinc-100')}>
      <div className="flex items-start justify-between gap-4">
        {descriptions.length > 0 ? (
          <div>
            <h2 className="text-lg font-medium">{title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{firstDescription}</p>
            {otherDescriptions.map((description) => (
              <p key={description} className="text-sm text-zinc-500">
                {description}
              </p>
            ))}
          </div>
        ) : isTitleWrapped ? (
          <div>
            <h2 className="text-lg font-medium">{title}</h2>
          </div>
        ) : (
          <h2 className="text-lg font-medium">{title}</h2>
        )}
        <span className={cn('shrink-0 rounded px-2 py-1 text-xs whitespace-nowrap', isActive ? 'bg-zinc-100' : 'bg-white')}>Passo {stepNumber}</span>
      </div>
      {children}
    </section>
  )
}

const STEP_BUTTON_BASE = 'h-8 rounded px-3 text-xs'

export function StepOutlineButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${STEP_BUTTON_BASE} border border-[#0089E2] text-[#0089E2] hover:bg-sky-50`}
    >
      {children}
    </button>
  )
}

export function StepPrimaryButton({
  children,
  disabled,
  onClick,
  type = 'button',
}: {
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 items-center gap-2 rounded bg-[#0089E2] px-3 text-xs text-white hover:bg-[#006bb5] disabled:opacity-50"
    >
      {children}
    </button>
  )
}
