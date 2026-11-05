export function StatusPill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-[#0089e2] px-2 py-0.5 text-[10px] leading-4 font-semibold whitespace-nowrap text-[#0089e2]">
      {children}
    </span>
  )
}
