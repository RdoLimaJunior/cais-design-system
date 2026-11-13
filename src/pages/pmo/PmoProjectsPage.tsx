import { useState } from 'react'
import { IconLayoutGrid, IconList, IconPlus } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { SortMenu } from '../../components/ui/sort-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { CurrencyCell } from '../../components/pmo/CurrencyCell'
import {
  ProjectCard,
  ProjectMonths,
  ProjectIncurredCosts,
  ProjectValues,
  type ProjectMonth,
} from '../../components/pmo/ProjectCard'
import { HealthBadge } from '../../components/pmo/HealthBadge'
import type { PmoRole } from '../../components/pmo/navigation'
import { PmoPage } from '../../components/pmo/PmoPage'
import { ProjectStatusBadge } from '../../components/pmo/ProjectStatusBadge'
import { formatPercent } from '../../lib/finance'
import { PMO_PROJETOS, type ProjetoMock } from '../../mocks/pmo'

type ProjectsTab = 'projetos' | 'simulacao' | 'arquivados'
type ViewMode = 'cards' | 'list'
type SortOrder = 'created' | 'name-asc' | 'name-desc' | 'updated' | 'critical'

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'created', label: 'Criação mais recente' },
  { value: 'name-asc', label: 'Nome (A a Z)' },
  { value: 'name-desc', label: 'Nome (Z a A)' },
  { value: 'critical', label: 'Do mais crítico ao mais saudável' },
]

const EXAMPLE_FEE_RATE = 0.1
const INCURRED_LIMIT_PERCENT = 20

function isCritical(project: ProjetoMock): boolean {
  const finalBalance = project.orcamento - project.gasto - project.gasto * EXAMPLE_FEE_RATE
  return finalBalance < 0 || project.incorridosPercent >= INCURRED_LIMIT_PERCENT
}

/** Quanto maior, mais crítico: quem termina no vermelho vem antes de quem só se aproxima do teto. */
function criticalityScore(project: ProjetoMock): number {
  return (isCritical(project) ? 1000 : 0) + project.incorridosPercent
}

const SORT_COMPARATORS: Record<Exclude<SortOrder, 'created' | 'updated'>, (a: ProjetoMock, b: ProjetoMock) => number> = {
  'name-asc': (a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'),
  'name-desc': (a, b) => b.titulo.localeCompare(a.titulo, 'pt-BR'),
  critical: (a, b) => criticalityScore(b) - criticalityScore(a),
}

/** "Criação mais recente" mantém a ordem recebida (a lista já chega da mais nova para a mais antiga). */
function sortProjects(projects: ProjetoMock[], order: SortOrder): ProjetoMock[] {
  if (order === 'created' || order === 'updated') return projects
  return [...projects].sort(SORT_COMPARATORS[order])
}

export interface PmoProjectsPageProps {
  projetos?: ProjetoMock[]
  role?: PmoRole
  initialTab?: ProjectsTab
  initialView?: ViewMode
  onOpenProject?: (projectId: number) => void
  onNewProject?: () => void
}

const EMPTY_TEXT: Record<ProjectsTab, string> = {
  projetos: 'Crie um projeto ou confira as abas Em Planejamento e Arquivados.',
  simulacao: 'Nenhum projeto em planejamento.',
  arquivados: 'Nenhum projeto arquivado.',
}

function progressOf(project: ProjetoMock): number {
  return project.orcamento > 0 ? Math.min((project.gasto / project.orcamento) * 100, 100) : 0
}

const MONTH_ABBREVIATIONS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** "01/2026 a 12/2026" vira os meses do projeto; os primeiros, na proporção do que já foi gasto, aparecem como fechados. */
function monthsOf(project: ProjetoMock): ProjectMonth[] {
  const [start, end] = project.vigencia.split(' a ').map((part) => part.split('/').map(Number))
  const total = (end[1] - start[1]) * 12 + (end[0] - start[0]) + 1
  const closed = project.arquivado ? total : Math.floor((progressOf(project) / 100) * total)
  return Array.from({ length: total }, (_, index) => {
    const monthIndex = (start[0] - 1 + index) % 12
    const year = start[1] + Math.floor((start[0] - 1 + index) / 12)
    const state = index < closed ? 'closed' : index === closed && !project.arquivado ? 'current' : 'open'
    return { number: index + 1, label: `${MONTH_ABBREVIATIONS[monthIndex]}/${String(year).slice(2)}`, state }
  })
}

function ProjectCardExample({ project, onOpen }: { project: ProjetoMock; onOpen?: () => void }) {
  const fee = project.gasto * EXAMPLE_FEE_RATE
  const finalBalance = project.orcamento - project.gasto - fee
  return (
    <ProjectCard
      title={project.titulo}
      status={project.arquivado ? project.status : undefined}
      archived={project.arquivado}
      critical={isCritical(project)}
      institute={project.instituto}
      manager={project.responsavel}
      onOpen={() => onOpen?.()}
      onArchive={() => {}}
    >
      <ProjectMonths months={monthsOf(project)} />
      <ProjectValues
        projectedFinalBalance={finalBalance}
        contractedContribution={project.orcamento}
        instituteFee={fee}
      />
      <ProjectIncurredCosts
        percent={project.incorridosPercent}
        amount={(project.orcamento * project.incorridosPercent) / 100}
        limitAmount={project.orcamento * 0.2}
      />
    </ProjectCard>
  )
}

function ProjectsTable({ projects, onOpen }: { projects: ProjetoMock[]; onOpen?: (id: number) => void }) {
  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Nome</TableHead>
            <TableHead>Gestor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead>Saúde</TableHead>
            <TableHead className="pr-4 text-right">Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="cursor-pointer" onClick={() => onOpen?.(project.id)}>
              <TableCell className="pl-4 font-medium">{project.titulo}</TableCell>
              <TableCell className="text-muted-foreground">{project.responsavel}</TableCell>
              <TableCell>
                <ProjectStatusBadge status={project.status} archived={project.arquivado} />
              </TableCell>
              <TableCell className="tabular-nums">{formatPercent(progressOf(project), 0)}</TableCell>
              <TableCell>
                <HealthBadge health={project.saude} />
              </TableCell>
              <CurrencyCell value={project.orcamento - project.gasto} redIfNegative zeroAsDash={false} className="pr-4" />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

/** Lista de projetos: abas Em Execução, Em Planejamento e Arquivados, em cartões ou em lista. */
export function PmoProjectsPage({
  projetos = PMO_PROJETOS,
  role = 'GESTOR',
  initialTab = 'projetos',
  initialView = 'cards',
  onOpenProject,
  onNewProject,
}: PmoProjectsPageProps) {
  const [tab, setTab] = useState<ProjectsTab>(initialTab)
  const [view, setView] = useState<ViewMode>(initialView)
  const [sortOrder, setSortOrder] = useState<SortOrder>('created')
  const inExecution = projetos.filter((project) => project.status === 'Execução' && !project.arquivado)
  const inPlanning = projetos.filter((project) => project.status === 'Planejamento' && !project.arquivado)
  const archived = projetos.filter((project) => project.arquivado)
  const byTab: Record<ProjectsTab, ProjetoMock[]> = { projetos: inExecution, simulacao: inPlanning, arquivados: archived }
  const visible = sortProjects(byTab[tab], sortOrder)
  const canCreate = role !== 'LEITOR'

  return (
    <PmoPage
      activeHref="/app/projetos"
      breadcrumb={[{ label: 'Projetos' }]}
      title="Projetos"
      subtitle="Projetos em execução, em planejamento e arquivados."
      role={role}
      actions={
        canCreate && (
          <Button size="lg" onClick={onNewProject}>
            <IconPlus aria-hidden="true" />
            Novo projeto
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(value) => setTab(value as ProjectsTab)}>
          <TabsList variant="line" className="flex-wrap group-data-[orientation=horizontal]/tabs:h-auto">
            <TabsTrigger value="projetos">
              Em Execução <Badge variant="secondary">{inExecution.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="simulacao">
              Em Planejamento <Badge variant="secondary">{inPlanning.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="arquivados">
              Arquivados <Badge variant="secondary">{archived.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
        <SortMenu options={SORT_OPTIONS} value={sortOrder} onValueChange={setSortOrder} />
        <div className="flex gap-1" role="group" aria-label="Modo de visualização">
          <Button
            variant={view === 'cards' ? 'secondary' : 'ghost'}
            size="icon"
            aria-label="Ver em cards"
            aria-pressed={view === 'cards'}
            onClick={() => setView('cards')}
          >
            <IconLayoutGrid aria-hidden="true" />
          </Button>
          <Button
            variant={view === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            aria-label="Ver em lista"
            aria-pressed={view === 'list'}
            onClick={() => setView('list')}
          >
            <IconList aria-hidden="true" />
          </Button>
        </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <Alert variant="info">
          <AlertTitle>Nenhum projeto</AlertTitle>
          <AlertDescription>{EMPTY_TEXT[tab]}</AlertDescription>
        </Alert>
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => (
            <ProjectCardExample key={project.id} project={project} onOpen={() => onOpenProject?.(project.id)} />
          ))}
        </div>
      ) : (
        <ProjectsTable projects={visible} onOpen={onOpenProject} />
      )}
    </PmoPage>
  )
}
