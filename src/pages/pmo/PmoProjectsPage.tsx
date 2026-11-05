import { useState } from 'react'
import { IconArchive, IconLayoutGrid, IconList, IconPencil, IconPlus } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Progress } from '../../components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { CurrencyCell } from '../../components/pmo/CurrencyCell'
import { HealthBadge } from '../../components/pmo/HealthBadge'
import type { PmoRole } from '../../components/pmo/navigation'
import { PmoPage } from '../../components/pmo/PmoPage'
import { ProjectStatusBadge } from '../../components/pmo/ProjectStatusBadge'
import { formatCurrency, formatPercent } from '../../lib/finance'
import { PMO_PROJETOS, type ProjetoMock } from '../../mocks/pmo'

type ProjectsTab = 'projetos' | 'simulacao' | 'arquivados'
type ViewMode = 'cards' | 'list'

export interface PmoProjectsPageProps {
  projetos?: ProjetoMock[]
  role?: PmoRole
  initialTab?: ProjectsTab
  initialView?: ViewMode
  onOpenProject?: (projectId: number) => void
  onNewProject?: () => void
}

const EMPTY_TEXT: Record<ProjectsTab, string> = {
  projetos: 'Crie um projeto ou confira as abas Simulação e Arquivados.',
  simulacao: 'Nenhum projeto em planejamento.',
  arquivados: 'Nenhum projeto arquivado.',
}

function progressOf(project: ProjetoMock): number {
  return project.orcamento > 0 ? Math.min((project.gasto / project.orcamento) * 100, 100) : 0
}

function ProjectCard({ project, onOpen }: { project: ProjetoMock; onOpen?: () => void }) {
  return (
    <Card className="gap-4">
      <CardHeader className="gap-2">
        <CardTitle className="leading-snug">
          <button type="button" onClick={onOpen} className="text-left hover:underline">
            {project.titulo}
          </button>
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <ProjectStatusBadge status={project.status} archived={project.arquivado} />
          <Badge variant="outline">{project.instituto}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          Gestor: <span className="text-foreground">{project.responsavel}</span>
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span className="tabular-nums">{formatPercent(progressOf(project), 0)}</span>
          </div>
          <Progress value={progressOf(project)} aria-label={`Progresso de ${project.titulo}`} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Vigência</span>
          <span>{project.vigencia}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Saúde do projeto</span>
          <HealthBadge health={project.saude} />
        </div>
        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-muted-foreground">Orçamento total</span>
          <span className="font-semibold tabular-nums">{formatCurrency(project.orcamento)}</span>
        </div>
        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={onOpen}>
            <IconPencil aria-hidden="true" />
            Editar projeto
          </Button>
          {!project.arquivado && (
            <Button variant="ghost" size="sm">
              <IconArchive aria-hidden="true" />
              Arquivar projeto
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
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

/** Lista de projetos: abas Projetos (em execução), Simulação (em planejamento) e Arquivados, em cartões ou em lista. */
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
  const inExecution = projetos.filter((project) => project.status === 'Execução' && !project.arquivado)
  const inPlanning = projetos.filter((project) => project.status === 'Planejamento' && !project.arquivado)
  const archived = projetos.filter((project) => project.arquivado)
  const byTab: Record<ProjectsTab, ProjetoMock[]> = { projetos: inExecution, simulacao: inPlanning, arquivados: archived }
  const visible = byTab[tab]
  const canCreate = role !== 'LEITOR'

  return (
    <PmoPage
      activeHref="/app/projetos"
      breadcrumb={[{ label: 'Projetos' }]}
      title="Projetos"
      subtitle="Projetos em execução, em simulação e arquivados."
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
              Projetos <Badge variant="secondary">{inExecution.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="simulacao">
              Simulação <Badge variant="secondary">{inPlanning.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="arquivados">
              Arquivados <Badge variant="secondary">{archived.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
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

      {visible.length === 0 ? (
        <Alert variant="info">
          <AlertTitle>Nenhum projeto</AlertTitle>
          <AlertDescription>{EMPTY_TEXT[tab]}</AlertDescription>
        </Alert>
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={() => onOpenProject?.(project.id)} />
          ))}
        </div>
      ) : (
        <ProjectsTable projects={visible} onOpen={onOpenProject} />
      )}
    </PmoPage>
  )
}
