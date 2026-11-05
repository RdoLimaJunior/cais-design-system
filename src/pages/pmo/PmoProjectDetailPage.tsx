import { useState } from 'react'
import { IconArchive, IconDownload, IconPlayerPlay, IconTrash, IconUpload } from '@tabler/icons-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { HealthBadge } from '../../components/pmo/HealthBadge'
import type { PmoRole } from '../../components/pmo/navigation'
import { PmoPage } from '../../components/pmo/PmoPage'
import { ProjectStatusBadge } from '../../components/pmo/ProjectStatusBadge'
import { PMO_PROJETOS, type ProjetoMock } from '../../mocks/pmo'
import {
  ClosingTab,
  IncurredTab,
  MirrorTab,
  OtherExpensesTab,
  OverviewTab,
  PayrollTab,
  RealizedTab,
  SummaryTab,
  TeamTab,
} from './PmoProjectTabs'

export type ProjectTabKey =
  | 'resumo'
  | 'visao-geral'
  | 'folha-rh'
  | 'espelho-rh'
  | 'demais-rubricas'
  | 'incorridos'
  | 'realizado'
  | 'fechamento'
  | 'equipe'

const TABS: { key: ProjectTabKey; label: string }[] = [
  { key: 'resumo', label: 'Resumo' },
  { key: 'visao-geral', label: 'Visão Geral' },
  { key: 'folha-rh', label: 'Folha RH' },
  { key: 'espelho-rh', label: 'Espelho RH' },
  { key: 'demais-rubricas', label: 'Demais Rubricas' },
  { key: 'incorridos', label: 'Incorridos' },
  { key: 'realizado', label: 'Realizado' },
  { key: 'fechamento', label: 'Fechamento' },
  { key: 'equipe', label: 'Equipe e Parâmetros' },
]

export interface PmoProjectDetailPageProps {
  projeto?: ProjetoMock
  role?: PmoRole
  initialTab?: ProjectTabKey
}

/** Detalhe do projeto: cabeçalho com status e ações, avisos de somente leitura e as nove abas. */
export function PmoProjectDetailPage({
  projeto = PMO_PROJETOS[0],
  role = 'GESTOR',
  initialTab = 'resumo',
}: PmoProjectDetailPageProps) {
  const [tab, setTab] = useState<ProjectTabKey>(initialTab)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const canWrite = role === 'ADMIN' || role === 'GESTOR' || role === 'ANALISTA'
  const canSeeSalaries = role !== 'LEITOR'
  const isReadOnly = projeto.arquivado || !canWrite

  const tabProps = { project: projeto, canSeeSalaries }

  return (
    <PmoPage
      activeHref="/app/projetos"
      breadcrumb={[{ label: 'Projetos', href: '/app/projetos' }, { label: projeto.titulo }]}
      title={projeto.titulo}
      subtitle={`${projeto.instituto} · ${projeto.vigencia} · Gestor: ${projeto.responsavel}`}
      role={role}
      actions={
        canWrite && (
          <>
            <Button variant="outline">
              <IconDownload aria-hidden="true" />
              Exportar aba
            </Button>
            {!projeto.arquivado && (
              <Button variant="outline">
                <IconUpload aria-hidden="true" />
                Importar planilha
              </Button>
            )}
            {!projeto.arquivado && (
              <Button variant="outline" onClick={() => setIsArchiveOpen(true)}>
                <IconArchive aria-hidden="true" />
                Arquivar
              </Button>
            )}
            {role === 'ADMIN' && (
              <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
                <IconTrash aria-hidden="true" />
                Excluir
              </Button>
            )}
          </>
        )
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <ProjectStatusBadge status={projeto.status} archived={projeto.arquivado} />
        <HealthBadge health={projeto.saude} />
        {projeto.status === 'Planejamento' && canWrite && (
          <Button size="sm" className="ml-auto">
            <IconPlayerPlay aria-hidden="true" />
            Aprovar e Iniciar Execução (gera PT v1.0)
          </Button>
        )}
      </div>

      {projeto.arquivado && (
        <Alert variant="warning">
          <AlertTitle>Projeto arquivado</AlertTitle>
          <AlertDescription>Este projeto foi arquivado e é somente leitura.</AlertDescription>
        </Alert>
      )}
      {!projeto.arquivado && !canWrite && (
        <Alert variant="info">
          <AlertTitle>Somente leitura</AlertTitle>
          <AlertDescription>O seu perfil consulta o projeto sem alterar valores.</AlertDescription>
        </Alert>
      )}

      <Tabs value={tab} onValueChange={(value) => setTab(value as ProjectTabKey)}>
        <TabsList variant="line" className="flex-wrap justify-start group-data-[orientation=horizontal]/tabs:h-auto">
          {TABS.map((item) => (
            <TabsTrigger key={item.key} value={item.key}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="resumo" className="pt-2">
          <SummaryTab {...tabProps} />
        </TabsContent>
        <TabsContent value="visao-geral" className="pt-2">
          <OverviewTab {...tabProps} />
        </TabsContent>
        <TabsContent value="folha-rh" className="pt-2">
          <PayrollTab {...tabProps} />
        </TabsContent>
        <TabsContent value="espelho-rh" className="pt-2">
          <MirrorTab {...tabProps} />
        </TabsContent>
        <TabsContent value="demais-rubricas" className="pt-2">
          <OtherExpensesTab />
        </TabsContent>
        <TabsContent value="incorridos" className="pt-2">
          <IncurredTab {...tabProps} />
        </TabsContent>
        <TabsContent value="realizado" className="pt-2">
          <RealizedTab {...tabProps} />
        </TabsContent>
        <TabsContent value="fechamento" className="pt-2">
          <ClosingTab {...tabProps} canSeeSalaries={canSeeSalaries && !isReadOnly} />
        </TabsContent>
        <TabsContent value="equipe" className="pt-2">
          <TeamTab {...tabProps} />
        </TabsContent>
      </Tabs>

      <AlertDialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Arquivar projeto</AlertDialogTitle>
            <AlertDialogDescription>
              O projeto {projeto.titulo} está em {projeto.status}. Depois de arquivado ele fica somente leitura.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction>Arquivar mesmo assim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir projeto</AlertDialogTitle>
            <AlertDialogDescription>
              Ação irreversível: isto apaga permanentemente o projeto {projeto.titulo}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction>Excluir definitivamente</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PmoPage>
  )
}
