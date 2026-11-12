import type { ReactNode } from 'react'
import { IconArchive, IconPencil } from '@tabler/icons-react'
import { formatCurrency, formatPercent } from '../../lib/finance'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { outcomeOf, type ProjectMoney, type ProjectOutcome } from './projectOutcome'
import { ProjectStatusBadge, type ProjectStatus } from './ProjectStatusBadge'

/**
 * Ordem de leitura do card, de cima para baixo, cada parte separada por uma linha: cabeçalho (título, situação, instituto,
 * gestor e as ações) → Execução (meses) → Valores (os dois saldos que decidem e os que os explicam) → Rubricas (onde a
 * execução foge do plano).
 */

function SectionLabel({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
      <span className="font-medium tracking-wide uppercase">{children}</span>
      {aside && <span className="tabular-nums">{aside}</span>}
    </div>
  )
}

/* ------------------------------------ Dinheiro ------------------------------------ */

function Money({ value, className }: { value: ProjectMoney; className?: string }) {
  if (value === null) return <Skeleton className="h-5 w-28" />
  if (value === undefined) return <span className="text-muted-foreground">—</span>
  return <span className={cn('tabular-nums', className)}>{formatCurrency(value)}</span>
}

/** Frase curta do desfecho ("déficit de 23,12%") e a explicação completa, usada como `title`. */
function describeOutcome(finalBalance: ProjectMoney, contracted: ProjectMoney): { short: string; full: string } | undefined {
  const outcome = outcomeOf(finalBalance)
  if (!outcome || typeof finalBalance !== 'number') return undefined
  const word = outcome === 'positive' ? 'sobra' : 'déficit'
  if (typeof contracted !== 'number' || contracted <= 0) return { short: word, full: word }
  const percent = formatPercent((Math.abs(finalBalance) / contracted) * 100, 2)
  return { short: `${word} de ${percent}`, full: `${word} de ${percent} do aporte contratado` }
}

const OUTCOME_TEXT: Record<ProjectOutcome, string> = { positive: 'text-success', negative: 'text-destructive' }

export interface ProjectValuesProps {
  /** Caixa disponível hoje. */
  cashBalance: ProjectMoney
  /** Como o projeto termina: aporte contratado menos a estimativa ao término. */
  projectedFinalBalance: ProjectMoney
  contractedContribution: ProjectMoney
  /** Realizado sem a taxa do instituto. */
  totalRealized: ProjectMoney
  /** Quanto o realizado representa do previsto, em %. */
  realizedPercent?: number | null
  /** Taxa do instituto já repassada. */
  instituteFee: ProjectMoney
}

function MoneyRow({ label, value, note }: { label: string; value: ProjectMoney; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted-foreground">
        {label}
        {note && <span className="block text-xs">{note}</span>}
      </dt>
      <dd className="shrink-0 text-right font-medium">
        <Money value={value} />
      </dd>
    </div>
  )
}

/**
 * Dinheiro do projeto: primeiro os dois saldos que decidem (como termina e quanto há em caixa hoje), em destaque;
 * abaixo, os valores que os explicam.
 */
export function ProjectValues({ cashBalance, projectedFinalBalance, contractedContribution, totalRealized, realizedPercent, instituteFee }: ProjectValuesProps) {
  const outcome = outcomeOf(projectedFinalBalance)
  const outcomeText = outcome ? OUTCOME_TEXT[outcome] : undefined
  const description = describeOutcome(projectedFinalBalance, contractedContribution)

  return (
    <section data-slot="project-values">
      <SectionLabel>Valores</SectionLabel>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Saldo Final Projetado</p>
            <p className={cn('min-h-4 text-xs', outcomeText)} title={description?.full}>
              {description?.short}
            </p>
          </div>
          <div className="shrink-0 text-xl leading-tight font-semibold">
            <Money value={projectedFinalBalance} className={outcomeText} />
          </div>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Saldo em Conta</p>
            <p className="min-h-4 text-xs text-muted-foreground">caixa disponível hoje</p>
          </div>
          <div className="shrink-0 text-xl leading-tight font-semibold">
            <Money value={cashBalance} />
          </div>
        </div>
      </div>
      <dl className="mt-4 space-y-2 rounded-md bg-muted/40 p-3 text-sm">
        <MoneyRow label="Aporte Contratado" value={contractedContribution} />
        <MoneyRow
          label="Total Realizado"
          value={totalRealized}
          note={typeof realizedPercent === 'number' ? `sem taxa · ${formatPercent(realizedPercent, 1)} do previsto` : 'sem taxa'}
        />
        <MoneyRow label="Taxa Instituto (Repasse)" value={instituteFee} />
      </dl>
    </section>
  )
}

/* ------------------------------------ Meses ------------------------------------ */

export type ProjectMonthState = 'closed' | 'current' | 'open'

export interface ProjectMonth {
  /** Posição do mês no projeto: 1 vira "M1". */
  number: number
  /** Mês e ano por extenso curto, por exemplo "nov/26". */
  label: string
  /** `closed`: mês com fechamento feito; `current`: mês de hoje ainda aberto; `open`: os demais. */
  state: ProjectMonthState
  /** Complemento do tooltip, por exemplo "Fechado em 05/12/2026". */
  detail?: string
}

export interface ProjectMonthsProps {
  months: ProjectMonth[]
  /** Enquanto os fechamentos não chegaram: mostra o mesmo desenho em cinza, com a quantidade certa de meses. */
  loading?: boolean
  /** A consulta falhou: mostra "indisponível" no lugar da contagem. */
  unavailable?: boolean
}

const MONTHS_GRID = 'flex flex-wrap gap-0.5'

const MONTH_STYLES: Record<ProjectMonthState, string> = {
  closed: 'border-primary bg-primary text-primary-foreground',
  current: 'border-primary bg-background text-primary ring-2 ring-primary/30',
  open: 'border-border bg-background text-muted-foreground',
}

const MONTH_DEFAULT_DETAIL: Record<ProjectMonthState, string> = {
  closed: 'Fechado',
  current: 'Mês atual, ainda não fechado',
  open: 'Não fechado',
}

/** Execução em meses: um quadradinho por mês do projeto (M1, M2...), cheio quando o mês já teve fechamento. */
export function ProjectMonths({ months, loading = false, unavailable = false }: ProjectMonthsProps) {
  const closedCount = months.filter((month) => month.state === 'closed').length
  const summary = loading ? '…' : unavailable ? 'indisponível' : `${closedCount} de ${months.length} meses fechados`

  return (
    <section data-slot="project-months">
      <SectionLabel aside={summary}>Execução</SectionLabel>
      {loading ? (
        <div className={MONTHS_GRID} aria-hidden="true">
          {months.map((month) => (
            <Skeleton key={month.number} className="h-6 w-7 rounded" />
          ))}
        </div>
      ) : (
        <ol className={MONTHS_GRID} aria-label={`Meses do projeto: ${closedCount} de ${months.length} fechados`}>
          {months.map((month) => {
            const detail = month.detail ?? MONTH_DEFAULT_DETAIL[month.state]
            return (
              <Tooltip key={month.number}>
                <TooltipTrigger asChild>
                  <li
                    aria-label={`M${month.number}, ${month.label}: ${detail}`}
                    className={cn(
                      'flex h-6 min-w-7 cursor-default items-center justify-center rounded border px-0.5 text-xs font-medium tabular-nums select-none',
                      MONTH_STYLES[month.state]
                    )}
                  >
                    M{month.number}
                  </li>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs font-medium">
                    M{month.number} · {month.label}
                  </p>
                  <p className="text-xs">{detail}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </ol>
      )}
    </section>
  )
}

/* ------------------------------------ Rubricas ------------------------------------ */

export type RubricTone = 'success' | 'destructive' | 'neutral'

export interface RubricGroup {
  key: string
  /** Texto depois da contagem: "com sobra", "estouradas", "sem movimento". */
  label: string
  tone: RubricTone
  /** Rubricas do grupo com o valor que o grupo soma, mostradas no tooltip. */
  rubrics: { name: string; value: number }[]
  /** Soma do grupo e como chamá-la no tooltip: "sobra", "estouro", "previsto". */
  total: number
  totalLabel: string
}

export interface ProjectRubricsProps {
  groups: RubricGroup[]
  loading?: boolean
  unavailable?: boolean
}

const RUBRIC_TONE_TEXT: Record<RubricTone, string> = { success: 'text-success', destructive: 'text-destructive', neutral: 'text-foreground' }

function RubricGroupDetail({ group }: { group: RubricGroup }) {
  if (group.rubrics.length === 0) return <p className="text-xs">Nenhuma rubrica neste grupo.</p>
  return (
    <ul className="space-y-1 text-xs">
      {group.rubrics.map((rubric) => (
        <li key={rubric.name} className="flex items-baseline justify-between gap-6">
          <span>{rubric.name}</span>
          <span className="font-semibold tabular-nums">{formatCurrency(rubric.value)}</span>
        </li>
      ))}
      <li className="flex justify-between gap-6 border-t border-border pt-1 text-muted-foreground">
        <span>Total ({group.totalLabel})</span>
        <span className="font-semibold tabular-nums">{formatCurrency(group.total)}</span>
      </li>
    </ul>
  )
}

/**
 * Rubricas com sobra, estouradas e sem movimento em três blocos de mesma largura; o detalhe de cada grupo aparece ao passar o mouse ou focar.
 * Os três blocos ficam sempre nos mesmos lugares (mesmo com zero) para os cartões poderem ser comparados.
 */
export function ProjectRubrics({ groups, loading = false, unavailable = false }: ProjectRubricsProps) {
  return (
    <section data-slot="project-rubrics">
      <SectionLabel>Rubricas</SectionLabel>
      {loading ? (
        <div className="flex flex-wrap gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-5 w-20 rounded-full" />
          ))}
        </div>
      ) : unavailable ? (
        <p className="text-xs text-muted-foreground">Não foi possível carregar as rubricas.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {groups.map((group) => {
            const isEmpty = group.rubrics.length === 0
            return (
              <Tooltip key={group.key}>
                <TooltipTrigger asChild>
                  <div
                    tabIndex={0}
                    aria-label={`${group.rubrics.length} ${group.label}. Passe o mouse ou foque para ver as rubricas.`}
                    className="cursor-default rounded-md border px-2 py-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <p className={cn('text-base leading-tight font-semibold tabular-nums', isEmpty ? 'text-muted-foreground' : RUBRIC_TONE_TEXT[group.tone])}>
                      {group.rubrics.length}
                    </p>
                    <p className="text-xs leading-tight text-muted-foreground">{group.label}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-sm">
                  <RubricGroupDetail group={group} />
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      )}
    </section>
  )
}

/* ------------------------------------- Cartão ------------------------------------- */

export interface ProjectCardProps {
  title: string
  status: ProjectStatus
  /** Projeto arquivado é somente leitura (RN-EX04). */
  archived?: boolean
  institute: string
  /** Gestor responsável; `null` mostra "Sem gestor". */
  manager?: string | null
  /** Período do projeto já formatado, por exemplo "jan/25 – dez/26". */
  period?: string
  /** Quantidade de colaboradores alocados. */
  collaborators?: number
  /** Última atualização já formatada, por exemplo "10/11/2026". */
  updatedAt?: string
  onOpen: () => void
  /** Omitido quando o usuário não pode arquivar (ou o projeto já está arquivado): o botão some. */
  onArchive?: () => void
  archiving?: boolean
  /** Seções do card, na ordem em que devem aparecer: `ProjectMonths`, `ProjectValues` e `ProjectRubrics`. */
  children?: ReactNode
  className?: string
}

/** Um dado do cabeçalho: rótulo pequeno em cima, valor embaixo. Sem valor, mostra o texto alternativo ou some. */
function HeaderFact({ label, value, fallback }: { label: string; value?: string; fallback?: string }) {
  const text = value ?? fallback
  if (!text) return null
  return (
    <div className="min-w-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('truncate text-sm', value ? 'font-medium text-foreground' : 'text-muted-foreground')} title={text}>
        {text}
      </dd>
    </div>
  )
}

function IconAction({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={label} onClick={onClick} disabled={disabled}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  )
}

/**
 * Cartão de projeto da lista. A moldura cuida da identificação e das ações (ícones no canto; o título também abre o projeto);
 * o miolo vem das seções.
 */
export function ProjectCard({
  title,
  status,
  archived = false,
  institute,
  manager,
  period,
  collaborators,
  updatedAt,
  onOpen,
  onArchive,
  archiving = false,
  children,
  className,
}: ProjectCardProps) {
  return (
    <Card data-slot="project-card" className={cn('gap-4', archived && 'bg-muted/40', className)}>
      <CardHeader className="gap-1.5 border-b pb-4">
        <CardTitle className="leading-snug">
          <button type="button" onClick={onOpen} className="line-clamp-2 text-left text-primary hover:underline">
            {title}
          </button>
        </CardTitle>
        <CardAction className="flex items-center">
          <IconAction label="Editar projeto" onClick={onOpen}>
            <IconPencil aria-hidden="true" />
          </IconAction>
          {onArchive && !archived && (
            <IconAction label="Arquivar projeto" onClick={onArchive} disabled={archiving}>
              <IconArchive aria-hidden="true" />
            </IconAction>
          )}
        </CardAction>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <ProjectStatusBadge status={status} archived={archived} />
          <span>{institute}</span>
        </div>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <HeaderFact label="Gestor" value={manager || undefined} fallback="Sem gestor" />
          <HeaderFact label="Período" value={period} />
          <HeaderFact label="Colaboradores" value={typeof collaborators === 'number' ? String(collaborators) : undefined} />
          <HeaderFact label="Atualizado em" value={updatedAt} />
        </dl>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col divide-y text-sm [&>*]:py-4 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
        {children}
      </CardContent>
    </Card>
  )
}
