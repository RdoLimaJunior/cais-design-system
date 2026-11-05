import { useState, type ReactNode } from 'react'
import { IconCheck, IconCircleCheck, IconDownload, IconPlus, IconTrash } from '@tabler/icons-react'
import { AppLayout, type UserRole } from '../components/farol/AppLayout'
import { Button } from '../components/ui/button'
import { cn } from '../lib/utils'

/**
 * `draft` e `completed` foram vistos no site. `under-review` (relatório enviado, aguardando o gestor) NÃO foi
 * capturado: o desenho abaixo segue o padrão dos outros passos e deve ser conferido com o produto.
 */
export type MonthlyReportStatus = 'draft' | 'under-review' | 'completed'

const MINIMUM_ACTIVITIES = 3
const ACTIVITY_PLACEHOLDERS = ['primeira', 'segunda', 'terceira']
// A mensagem de validação não foi capturada do site; texto provisório.
const MINIMUM_ACTIVITIES_MESSAGE = `Descreva pelo menos ${MINIMUM_ACTIVITIES} atividades.`

const TEXT_INPUT_CLASSES =
  'ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-[#0A0A0A] placeholder:text-[#9CA3AF] focus:border-[#0089E2] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
const REMOVE_BUTTON_CLASSES =
  'flex size-9 shrink-0 items-center justify-center rounded-md border border-red-300 bg-white text-red-500 hover:border-red-400 hover:bg-red-50 hover:text-red-600'
const OUTLINE_BUTTON_CLASSES =
  'inline-flex h-8 items-center gap-1.5 rounded-md border border-[#0089E2] bg-white px-4 text-sm font-medium text-[#0089E2] hover:bg-[#e8f5ff] disabled:cursor-not-allowed disabled:opacity-50'

type StepTone = 'active' | 'muted'

function StepCard({
  stepNumber,
  title,
  description,
  tone,
  isDone = false,
  children,
}: {
  stepNumber: number
  title: string
  description: ReactNode
  tone: StepTone
  isDone?: boolean
  children?: ReactNode
}) {
  const isActive = tone === 'active'

  return (
    <div className={cn('rounded-xl border p-6 border-[#E5E7EB]', isActive ? 'bg-white' : 'bg-[#F3F4F6]')}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xl font-normal text-black">{title}</p>
          <p className="mt-1 text-sm text-[#6B7280]">{description}</p>
        </div>
        <span
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium text-[#0A0A0A]',
            isActive ? 'bg-[#E5E7EB]' : 'bg-white',
          )}
        >
          {isDone && <IconCircleCheck className="size-3.5 text-[#0089E2]" />}
          Passo {stepNumber}
        </span>
      </div>
      {children}
    </div>
  )
}

function ActivitiesForm({ onEvaluate }: { onEvaluate?: (activities: string[]) => void }) {
  const [activities, setActivities] = useState(['', '', ''])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const filledActivities = activities.map((text) => text.trim()).filter(Boolean)
  const needsMoreActivities = hasSubmitted && filledActivities.length < MINIMUM_ACTIVITIES

  function updateActivity(index: number, text: string) {
    setActivities((current) => current.map((value, position) => (position === index ? text : value)))
  }

  function evaluate() {
    setHasSubmitted(true)
    if (filledActivities.length >= MINIMUM_ACTIVITIES) onEvaluate?.(filledActivities)
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          {activities.map((text, index) => (
            <div key={index} className="flex flex-col gap-1">
              <label data-slot="label" className="text-sm font-medium text-[#0A0A0A]" htmlFor={`activity-${index + 1}`}>
                Atividade {index + 1}
              </label>
              <div className="flex items-center gap-2">
                <input
                  data-slot="input"
                  id={`activity-${index + 1}`}
                  className={TEXT_INPUT_CLASSES}
                  placeholder={`Insira aqui sua ${ACTIVITY_PLACEHOLDERS[index] ?? `${index + 1}ª`} atividade.`}
                  value={text}
                  onChange={(event) => updateActivity(index, event.target.value)}
                />
                <button
                  type="button"
                  aria-label={`Remover atividade ${index + 1}`}
                  className={REMOVE_BUTTON_CLASSES}
                  onClick={() => setActivities((current) => current.filter((_, position) => position !== index))}
                >
                  <IconTrash className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {needsMoreActivities && <p className="text-sm font-medium text-red-600">{MINIMUM_ACTIVITIES_MESSAGE}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" className={OUTLINE_BUTTON_CLASSES} onClick={() => setActivities((current) => [...current, ''])}>
            <IconPlus className="size-4" />
            Adicionar atividade
          </button>
          <Button
            type="button"
            onClick={evaluate}
            className="h-8 gap-2 rounded-md border-transparent bg-[#0089E2] px-4 text-sm font-medium text-white hover:bg-[#007bcf]"
          >
            Avalie minhas atividades
            <IconCheck className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function SignedByBothBox({ onDownload }: { onDownload?: () => void }) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4 rounded-md border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-3">
          <IconCircleCheck className="size-4 shrink-0 text-green-600" />
          <p className="text-sm font-medium text-green-700">
            Relatório assinado por ambas as partes. Nenhuma ação necessária.
          </p>
        </div>
        <button type="button" className={`${OUTLINE_BUTTON_CLASSES} shrink-0`} onClick={onDownload}>
          <IconDownload className="size-4" /> Baixar relatório assinado
        </button>
      </div>
    </div>
  )
}

const ACTIVITIES_STEP = {
  title: 'Descreva suas atividades',
  description:
    'Você deve listar no mínimo 3 atividades que realizou ao longo deste mês. Não inclua reuniões ou atividades do mês anterior. Não cite o nome dos projetos nas atividades.',
}
const REVIEW_STEP = {
  title: 'Aguarde a revisão do seu gestor',
  description: (
    <>
      Seu relatório foi enviado e está em análise.
      <br />
      Caso o gerente identifique alguma inconsistência, o relatório será devolvido para correção, você receberá uma
      notificação e deverá acessar o sistema para realizar os ajustes necessários.
    </>
  ),
}

function ReportSteps({
  status,
  onEvaluate,
  onDownloadSigned,
}: Pick<MonthlyReportPageProps, 'status' | 'onEvaluate' | 'onDownloadSigned'>) {
  if (status === 'completed') {
    return (
      <>
        <StepCard stepNumber={1} tone="muted" isDone {...ACTIVITIES_STEP} />
        <StepCard stepNumber={2} tone="muted" isDone {...REVIEW_STEP} />
        <StepCard
          stepNumber={3}
          tone="active"
          isDone
          title="Trâmite concluído"
          description="Seu relatório foi assinado por ambas as partes. O trâmite está encerrado."
        >
          <SignedByBothBox onDownload={onDownloadSigned} />
        </StepCard>
      </>
    )
  }

  if (status === 'under-review') {
    return (
      <>
        <StepCard stepNumber={1} tone="muted" isDone {...ACTIVITIES_STEP} />
        <StepCard stepNumber={2} tone="active" {...REVIEW_STEP} />
        <StepCard
          stepNumber={3}
          tone="muted"
          title="Assine seu relatório"
          description="Após o gestor assinar, você receberá o documento para assinar também."
        />
      </>
    )
  }

  return (
    <>
      <StepCard stepNumber={1} tone="active" {...ACTIVITIES_STEP}>
        <ActivitiesForm onEvaluate={onEvaluate} />
      </StepCard>
      <StepCard stepNumber={2} tone="muted" {...REVIEW_STEP} />
      <StepCard
        stepNumber={3}
        tone="muted"
        title="Assine seu relatório"
        description="Após o gestor assinar, você receberá o documento para assinar também."
      />
    </>
  )
}

export interface MonthlyReportPageProps {
  userName: string
  status: MonthlyReportStatus
  monthName: string
  projectName: string
  submissionPeriod: string
  role?: UserRole
  onRoleChange?: (role: UserRole) => void
  onEvaluate?: (activities: string[]) => void
  onDownloadSigned?: () => void
  onLogout?: () => void
}

export function MonthlyReportPage({
  userName,
  status,
  monthName,
  projectName,
  submissionPeriod,
  role,
  onRoleChange,
  onEvaluate,
  onDownloadSigned,
  onLogout,
}: MonthlyReportPageProps) {
  return (
    <AppLayout
      frame="report-detail"
      breadcrumb={[
        { label: 'Home', href: '/home' },
        { label: 'Meus relatórios', href: '/meus-relatorios' },
        { label: `Relatório do mês de ${monthName} • ${projectName}` },
      ]}
      activeHref=""
      userName={userName}
      role={role}
      onRoleChange={onRoleChange}
      onLogout={onLogout}
    >
      <div className="overflow-hidden rounded-md border border-[#E5E5E5] bg-white shadow-sm">
        <div className="border-b border-[#E5E5E5] px-6 py-6">
          <h1 className="text-xl font-semibold text-[#0089E2]">Relatório mensal de atividades</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Relatório vinculado ao projeto <strong className="font-semibold text-[#0A0A0A]">{projectName}</strong>.
          </p>
          <p className="mt-1 text-sm text-[#6B7280]">
            O envio do relatório é obrigatório e afeta o pagamento da sua bolsa. Preencha as atividades e envie para
            revisão do seu gestor. Após a aprovação, você receberá o documento para assinar.{' '}
            <strong className="text-[#0A0A0A]">Período de envio:</strong> {submissionPeriod}.
          </p>
        </div>
        <div className="flex flex-col gap-3 px-6 pt-6 pb-6">
          <ReportSteps status={status} onEvaluate={onEvaluate} onDownloadSigned={onDownloadSigned} />
        </div>
      </div>
    </AppLayout>
  )
}
