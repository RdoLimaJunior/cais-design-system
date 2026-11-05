import { cn } from '../../lib/utils'

export interface SegmentedTabsProps {
  tabs: string[]
  activeTab: string
  onChange: (tab: string) => void
}

export function SegmentedTabs({ tabs, activeTab, onChange }: SegmentedTabsProps) {
  return (
    <nav className="mb-5 flex w-fit max-w-full overflow-x-auto rounded-lg bg-zinc-100 p-0.5 text-base leading-6 font-medium text-[#0A0A0A]">
      {tabs.map((tab) => {
        const isActive = tab === activeTab
        return (
          <button
            key={tab}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange(tab)}
            className={cn('h-8 rounded-md px-3 whitespace-nowrap', isActive && 'bg-white shadow-sm')}
          >
            {tab}
          </button>
        )
      })}
    </nav>
  )
}
