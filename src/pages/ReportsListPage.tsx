import { IconArrowRight, IconDownload } from '@tabler/icons-react'
import { AppLayout, type UserRole } from '../components/farol/AppLayout'
import { PageTitle } from '../components/farol/PageHeading'
import { REPORT_STATUS } from '../components/farol/reportStatus'
import { STATUS_TONE_CLASSES } from '../components/farol/StatusTag'
import { Button } from '../components/ui/button'
import { cn } from '../lib/utils'
import type { MockReport } from '../mocks/scholarship'

const ROW_BUTTON_CLASSES =
  'rounded-lg border-[#0089e2] bg-white text-xs text-[#0089e2] hover:bg-blue-50 hover:text-[#0077c5]'

export interface ReportsListPageProps {
  userName: string
  reports: MockReport[]
  role?: UserRole
  onRoleChange?: (role: UserRole) => void
  onDownload?: (reportId: string) => void
  onLogout?: () => void
}

function ReportActions({ report, onDownload }: { report: MockReport; onDownload?: (reportId: string) => void }) {
  const isCompleted = report.status === 'completed'

  return (
    <div className="flex justify-end gap-2">
      {isCompleted && (
        <Button variant="outline" className={ROW_BUTTON_CLASSES} onClick={() => onDownload?.(report.id)}>
          <IconDownload className="size-3.5" /> Baixar
        </Button>
      )}
      <Button asChild variant="outline" className={ROW_BUTTON_CLASSES}>
        <a href={`/relatorio-mensal/${report.id}`}>
          {isCompleted ? 'Visualizar' : 'Preencher'}
          <IconArrowRight className="size-3.5" />
        </a>
      </Button>
    </div>
  )
}

export function ReportsListPage({ userName, reports, role, onRoleChange, onDownload, onLogout }: ReportsListPageProps) {
  return (
    <AppLayout
      frame="reports-list"
      breadcrumb={[{ label: 'Home', href: '/home' }, { label: 'Meus relatórios' }]}
      activeHref="/meus-relatorios"
      userName={userName}
      role={role}
      onRoleChange={onRoleChange}
      onLogout={onLogout}
    >
      <section className="overflow-hidden rounded bg-white shadow-sm">
        <header className="border-b border-zinc-200 px-5 py-5">
          <PageTitle>Meus relatórios</PageTitle>
          <p className="mt-1 text-sm leading-5 font-normal text-zinc-500">
            Acompanhe seus relatórios mensais e consulte o andamento de cada competência.
          </p>
        </header>
        <div className="p-5">
          <div className="overflow-x-auto rounded border border-zinc-200">
            <table className="w-full min-w-200 border-collapse text-left text-xs">
              <thead className="bg-[#0794dc] text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Competência</th>
                  <th className="px-4 py-3 font-semibold">Projeto</th>
                  <th className="px-4 py-3 font-semibold">Período de envio</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Ação</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-t border-zinc-200 hover:bg-zinc-50">
                    <td className="px-4 py-3 font-semibold">{report.competence}</td>
                    <td className="px-4 py-3 text-zinc-600">{report.projectName}</td>
                    <td className="px-4 py-3 text-zinc-600">{report.submissionPeriod}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                          STATUS_TONE_CLASSES[REPORT_STATUS[report.status].tone],
                        )}
                      >
                        {REPORT_STATUS[report.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <ReportActions report={report} onDownload={onDownload} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}
