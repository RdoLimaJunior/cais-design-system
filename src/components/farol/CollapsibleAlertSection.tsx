import { useState, type ReactNode } from 'react'
import { IconChevronUp } from '@tabler/icons-react'
import { cn } from '../../lib/utils'

export interface CollapsibleAlertSectionProps {
  title: string
  description: string
  children: ReactNode
  isInitiallyOpen?: boolean
}

export function CollapsibleAlertSection({
  title,
  description,
  children,
  isInitiallyOpen = true,
}: CollapsibleAlertSectionProps) {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen)

  return (
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between border-t border-zinc-100 px-4 py-3 text-left text-sm leading-6 font-normal text-zinc-950"
      >
        <span>{title}</span>
        <IconChevronUp className={cn('size-3.5 stroke-[1.8] transition-transform', !isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div className="border-t border-zinc-100 bg-[#f9fafb] px-4 pt-3 pb-4">
          <p className="text-sm leading-6 font-normal text-[#6B7280]">{description}</p>
          <div className="mt-4">{children}</div>
        </div>
      )}
    </>
  )
}
