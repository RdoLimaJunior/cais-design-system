import type { ReactNode } from 'react'

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-[22px] leading-[30px] font-semibold tracking-[-0.005em] text-[#0089E2]">{children}</h1>
  )
}

export function PageSubtitle({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-sm font-normal leading-6 text-zinc-500">{children}</p>
}
