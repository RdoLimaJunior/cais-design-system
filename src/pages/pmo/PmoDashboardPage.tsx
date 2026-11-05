import { IconInfoCircle } from '@tabler/icons-react'
import { PageCard } from '../../components/farol/PageCard'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { CurrencyCell } from '../../components/pmo/CurrencyCell'
import { HelpTip } from '../../components/pmo/HelpTip'
import { StatCard } from '../../components/pmo/StatCard'
import { PmoShell } from '../../components/pmo/PmoShell'
import type { PmoRole } from '../../components/pmo/navigation'
import { formatCurrency, formatPercent } from '../../lib/finance'
import {
  PMO_PROJETOS,
  PMO_REMANEJAMENTOS,
  type HealthScore,
  type ProjetoMock,
  type RemanejamentoMock,
} from '../../mocks/pmo'

export interface PmoDashboardPageProps {
  projetos?: ProjetoMock[]
  remanejamentos?: RemanejamentoMock[]
  role?: PmoRole
  userName?: string
  onOpenProject?: (projectId: number) => void
}

const HEALTH: Record<HealthScore, { bar: string; label: string }> = {
  red: { bar: 'bg-destructive', label: 'Em risco' },
  yellow: { bar: 'bg-warning', label: 'Em atenção' },
  green: { bar: 'bg-success', label: 'Saudáveis' },
}

/** Só projetos em execução e não arquivados entram nas somas do portfólio (evita inflar saldo e orçamento). */
function isActive(project: ProjetoMock): boolean {
  return project.status === 'Execução' && !project.arquivado
}

function SpendDonut({ total, spent }: { total: number; spent: number }) {
  const percent = total > 0 ? Math.max(0, Math.min((spent / total) * 100, 100)) : 0
  const radius = 60
  const circumference = 2 * Math.PI * radius
  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 140 140" width={160} height={160} role="img" aria-label={`${formatPercent(percent, 0)} do orçamento gasto`}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--muted)" strokeWidth="16" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="16"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="68" textAnchor="middle" style={{ fill: 'var(--foreground)' }} className="text-3xl font-bold">
          {formatPercent(percent, 0)}
        </text>
        <text x="70" y="84" textAnchor="middle" fontSize={9} style={{ fill: 'var(--muted-foreground)' }}>
          gasto do orçamento
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
          Gasto: {formatCurrency(spent)}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-muted" aria-hidden="true" />
          Saldo: {formatCurrency(Math.max(total - spent, 0))}
        </span>
      </div>
    </div>
  )
}

function PortfolioHealth({ projects }: { projects: ProjetoMock[] }) {
  const counts: Record<HealthScore, number> = { red: 0, yellow: 0, green: 0 }
  projects.forEach((project) => (counts[project.saude] += 1))
  const total = counts.red + counts.yellow + counts.green || 1
  const order: HealthScore[] = ['red', 'yellow', 'green']

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          Saúde do Portfólio
          <HelpTip text="Saldo negativo, prazo vencido ou mais de 80% executado = em risco. Menos de 30 dias de prazo ou 60% a 80% executado = em atenção." />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
          {order.map((key) =>
            counts[key] > 0 ? (
              <div
                key={key}
                className={`${HEALTH[key].bar} h-full border-r-2 border-card last:border-r-0`}
                style={{ width: `${(counts[key] / total) * 100}%` }}
                title={`${HEALTH[key].label}: ${counts[key]}`}
              />
            ) : null,
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {order.map((key) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${HEALTH[key].bar}`} aria-hidden="true" />
              {HEALTH[key].label} <span className="font-semibold text-foreground tabular-nums">{counts[key]}</span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DeviationDot({ deviation }: { deviation: number }) {
  const absolute = Math.abs(deviation)
  const tone = absolute < 5 ? 'bg-success' : absolute <= 10 ? 'bg-warning' : 'bg-destructive'
  return <span className={`inline-block size-2 rounded-full ${tone}`} aria-hidden="true" />
}

/** Dashboard do CAIS PMO na versão nova: o portfólio em execução, com saldo, saúde e últimas movimentações. */
export function PmoDashboardPage({
  projetos = PMO_PROJETOS,
  remanejamentos = PMO_REMANEJAMENTOS,
  role = 'GESTOR',
  userName = 'Ana Gestora',
  onOpenProject,
}: PmoDashboardPageProps) {
  const active = projetos.filter(isActive)
  const budget = active.reduce((sum, project) => sum + project.orcamento, 0)
  const spent = active.reduce((sum, project) => sum + project.gasto, 0)

  return (
    <PmoShell activeHref="/app/dashboard" breadcrumb={[{ label: 'Dashboard' }]} role={role} userName={userName}>
      <PageCard
        title={`Bom dia, ${userName.split(' ')[0]}`}
        subtitle="Resumo dos projetos em execução."
        actions={
          <Button variant="outline" onClick={() => onOpenProject?.(0)}>
            Ver todos os projetos
          </Button>
        }
        bodyClassName="flex flex-1 flex-col gap-4 px-5 py-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Orçamento total" value={formatCurrency(budget)} help="Soma do orçamento dos projetos em execução (arquivados e em planejamento ficam de fora)." />
          <StatCard label="Gasto" value={formatCurrency(spent)} help="Soma do executado nos projetos em execução." />
          <StatCard label="Saldo" value={formatCurrency(budget - spent)} help="Orçamento total menos o gasto." />
          <StatCard label="Projetos em execução" value={String(active.length)} help="Projetos com status Execução e não arquivados." />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5">
                Saldo Financeiro
                <HelpTip text="Compara o quanto do orçamento já foi gasto com o que ainda resta disponível." />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpendDonut total={budget} spent={spent} />
            </CardContent>
          </Card>
          <div className="lg:col-span-3">
            <PortfolioHealth projects={active} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              Projetos
              <HelpTip text="Desvio entre o previsto e o executado no mês. Verde até 5 pontos, âmbar até 10, vermelho acima." />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {active.length === 0 ? (
              <Alert variant="info" className="mx-6 w-auto">
                <IconInfoCircle aria-hidden="true" />
                <AlertTitle>Nenhum projeto</AlertTitle>
                <AlertDescription>Cadastre o primeiro projeto para começar.</AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Projeto</TableHead>
                    <TableHead>Desvio</TableHead>
                    <TableHead className="pr-6 text-right">Saldo atual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {active.map((project) => (
                    <TableRow key={project.id} className="cursor-pointer" onClick={() => onOpenProject?.(project.id)}>
                      <TableCell className="pl-6 font-medium">{project.titulo}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-2 tabular-nums">
                          <DeviationDot deviation={project.desvio} />
                          {formatPercent(project.desvio, 1)}
                        </span>
                      </TableCell>
                      <CurrencyCell value={project.orcamento - project.gasto} redIfNegative zeroAsDash={false} className="pr-6" />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos remanejamentos</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {remanejamentos.length === 0 ? (
              <Alert variant="info" className="mx-6 w-auto">
                <IconInfoCircle aria-hidden="true" />
                <AlertTitle>Nenhum remanejamento</AlertTitle>
                <AlertDescription>Nenhuma movimentação entre rubricas registrada ainda.</AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Projeto</TableHead>
                    <TableHead>De → Para</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="pr-6">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {remanejamentos.map((move) => (
                    <TableRow key={move.id} className="cursor-pointer" onClick={() => onOpenProject?.(move.projetoId)}>
                      <TableCell className="pl-6 font-medium">
                        {projetos.find((project) => project.id === move.projetoId)?.titulo ?? `Projeto #${move.projetoId}`}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {move.de} → {move.para}
                      </TableCell>
                      <CurrencyCell value={move.valor} />
                      <TableCell className="pr-6 text-muted-foreground">{move.data}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </PageCard>
    </PmoShell>
  )
}
