import { useState } from 'react'
import { IconCircleCheck, IconDownload, IconUpload } from '@tabler/icons-react'
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
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import type { PmoRole } from '../../components/pmo/navigation'
import { PercentInput } from '../../components/pmo/PercentInput'
import { PmoPage } from '../../components/pmo/PmoPage'
import { PMO_INSTITUTOS, PMO_MODELOS_DE_PROJETO } from '../../mocks/pmoDetails'

export interface PmoNewProjectPageProps {
  role?: PmoRole
  /** Mostra a tela com o Plano de Trabalho já importado, pronta para concluir. */
  workPlanSaved?: boolean
  onFinish?: () => void
  onCancel?: () => void
}

function UploadCard({
  title,
  description,
  isSaved,
  isOptional,
}: {
  title: string
  description: string
  isSaved: boolean
  isOptional?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          {isSaved && <IconCircleCheck className="size-4 text-success" aria-label="Importado" />}
        </CardTitle>
        <CardDescription>
          {description}
          {isOptional && ' (opcional)'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button variant="outline">
          <IconDownload aria-hidden="true" />
          Baixar planilha modelo
        </Button>
        <Button variant={isSaved ? 'outline' : 'default'}>
          <IconUpload aria-hidden="true" />
          Importar planilha do projeto
        </Button>
      </CardContent>
    </Card>
  )
}

/** Novo projeto: cadastro e parâmetros financeiros, importação do Plano de Trabalho e da Folha RH (opcional). */
export function PmoNewProjectPage({ role = 'GESTOR', workPlanSaved = false, onFinish, onCancel }: PmoNewProjectPageProps) {
  const [adminFee, setAdminFee] = useState(10)
  const [isCancelOpen, setIsCancelOpen] = useState(false)

  return (
    <PmoPage
      activeHref="/app/projetos"
      breadcrumb={[{ label: 'Projetos', href: '/app/projetos' }, { label: 'Novo Projeto' }]}
      title="Novo Projeto"
      subtitle="Cadastro e parâmetros financeiros"
      role={role}
      actions={
        <>
          <Button variant="outline" onClick={() => setIsCancelOpen(true)}>
            Cancelar e excluir rascunho
          </Button>
          <Button disabled={!workPlanSaved} onClick={onFinish}>
            Concluir cadastro
          </Button>
        </>
      }
    >
      {!workPlanSaved && (
        <Alert variant="info">
          <AlertDescription>Para concluir, salve o Plano de Trabalho (a Folha RH é opcional).</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Cadastro e parâmetros financeiros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="project-name">Nome do projeto *</Label>
            <Input id="project-name" placeholder="Ex.: Plataforma de análise de dados" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="project-institute">Instituto *</Label>
            <Select>
              <SelectTrigger className="w-full" id="project-institute">
                <SelectValue placeholder="Escolha um instituto" />
              </SelectTrigger>
              <SelectContent>
                {PMO_INSTITUTOS.map((institute) => (
                  <SelectItem key={institute.id} value={String(institute.id)}>
                    {institute.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="project-model">Modelo do projeto</Label>
            <Select defaultValue="1">
              <SelectTrigger className="w-full" id="project-model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PMO_MODELOS_DE_PROJETO.filter((model) => model.ativo).map((model) => (
                  <SelectItem key={model.id} value={String(model.id)}>
                    {model.nome} (v{model.versao})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="project-start">Início da vigência *</Label>
            <Input id="project-start" type="month" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="project-end">Fim da vigência *</Label>
            <Input id="project-end" type="month" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="project-fee">Taxa administrativa (%)</Label>
            <PercentInput id="project-fee" value={adminFee} onChange={setAdminFee} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <UploadCard title="Plano de Trabalho" description="Previsões de custo por rubrica e mês." isSaved={workPlanSaved} />
        <UploadCard title="Folha RH" description="Colaboradores e custos de pessoal." isSaved={false} isOptional />
      </div>

      <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar o cadastro do projeto?</AlertDialogTitle>
            <AlertDialogDescription>Você está cancelando o rascunho. O que foi preenchido será perdido.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Manter rascunho</AlertDialogCancel>
            <AlertDialogAction onClick={onCancel}>Cancelar e excluir rascunho</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PmoPage>
  )
}
