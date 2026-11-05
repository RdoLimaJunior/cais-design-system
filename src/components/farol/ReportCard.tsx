import { Button } from '../ui/button'
import { StatusPill } from './StatusPill'

export interface ReportCardProps {
  title: string
  projectName: string
  periodDescription: string
  status: string
  actionLabel: string
  actionHref: string
}

export function ReportCard({
  title,
  projectName,
  periodDescription,
  status,
  actionLabel,
  actionHref,
}: ReportCardProps) {
  return (
    <div className="flex h-full flex-col rounded border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl leading-7 font-semibold tracking-[-0.005em] text-zinc-950">{title}</h3>
          <p className="mt-1 text-xs leading-5 font-semibold text-[#0089e2]">{projectName}</p>
          <p className="mt-3 text-sm leading-6 font-normal text-[#6B7280]">{periodDescription}</p>
        </div>
        <StatusPill>{status}</StatusPill>
      </div>
      <div className="mt-auto">
        <Button
          asChild
          variant="outline"
          className="mt-3 h-6 w-full gap-1.5 rounded border-[#0089e2] bg-transparent text-xs leading-5 font-semibold text-[#0089e2] hover:bg-[#e8f5ff] hover:text-[#0077c5]"
        >
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      </div>
    </div>
  )
}
