import { useState } from 'react'
import { IconPlus } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle } from '../../components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { CurrencyCell } from '../../components/pmo/CurrencyCell'
import { CurrencyInput } from '../../components/pmo/CurrencyInput'
import type { PmoRole } from '../../components/pmo/navigation'
import { PmoPage } from '../../components/pmo/PmoPage'
import { RubricBadge } from '../../components/pmo/RubricBadge'
import { PMO_PROJETOS, type ProjetoMock } from '../../mocks/pmo'

const WORK_PLAN_MONTHS = ['06/2026', '07/2026', '08/2026', '09/2026', '10/2026', '11/2026']

interface ForecastRow {
  rubric: string
  month: string
  amount: number
  version: string
}

function forecastsOf(project: ProjetoMock): ForecastRow[] {
  return project.rubricas.flatMap((rubric) =>
    WORK_PLAN_MONTHS.map((month) => ({ rubric: rubric.nome, month, amount: rubric.previsto / 12, version: 'v1.0' })),
  )
}

function NewForecastDialog({
  open,
  onOpenChange,
  rubrics,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  rubrics: string[]
}) {
  const [monthly, setMonthly] = useState([{ month: '', amount: 0 }])

  function update(index: number, change: Partial<{ month: string; amount: number }>) {
    setMonthly(monthly.map((row, position) => (position === index ? { ...row, ...change } : row)))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova previsão de rubrica</DialogTitle>
          <DialogDescription>Informe a rubrica e o valor previsto em cada mês.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="forecast-rubric">Rubrica</Label>
            <Select>
              <SelectTrigger className="w-full" id="forecast-rubric">
                <SelectValue placeholder="Escolha uma rubrica" />
              </SelectTrigger>
              <SelectContent>
                {rubrics.map((rubric) => (
                  <SelectItem key={rubric} value={rubric}>
                    {rubric}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <fieldset className="space-y-2">
            <legend className="mb-1 text-sm font-medium">Previsões mensais</legend>
            {monthly.map((row, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Input
                  aria-label={`Mês ${index + 1}`}
                  type="month"
                  value={row.month}
                  onChange={(event) => update(index, { month: event.target.value })}
                />
                <CurrencyInput
                  aria-label={`Valor do mês ${index + 1}`}
                  value={row.amount}
                  onChange={(amount) => update(index, { amount })}
                />
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={() => setMonthly([...monthly, { month: '', amount: 0 }])}>
              <IconPlus aria-hidden="true" />
              Adicionar mês
            </Button>
          </fieldset>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button>Salvar previsões</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Plano de Trabalho previsto: previsões de custo por rubrica e mês de um projeto, com atalho para a timeline. */
export function PmoWorkPlanPage({ role = 'GESTOR', hasProject = true }: { role?: PmoRole; hasProject?: boolean }) {
  const [projectId, setProjectId] = useState(hasProject ? '1' : '')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const project = PMO_PROJETOS.find((item) => String(item.id) === projectId)
  const forecasts = project ? forecastsOf(project) : []

  return (
    <PmoPage
      activeHref="/app/orcamento"
      breadcrumb={[{ label: 'Plano de Trabalho' }]}
      title="Plano de Trabalho Previsto"
      subtitle="Defina as previsões de custo por rubrica e mês."
      role={role}
      actions={
        <>
          <Button variant="outline">Timeline</Button>
          <Button disabled={!project} onClick={() => setIsDialogOpen(true)}>
            <IconPlus aria-hidden="true" />
            Nova previsão
          </Button>
        </>
      }
    >
      <div className="space-y-1.5 sm:max-w-sm">
        <Label htmlFor="work-plan-project">Selecionar projeto</Label>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="w-full" id="work-plan-project">
            <SelectValue placeholder="Escolha um projeto" />
          </SelectTrigger>
          <SelectContent>
            {PMO_PROJETOS.filter((item) => !item.arquivado).map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.titulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {!project ? (
        <Alert variant="info">
          <AlertTitle>Sem projeto</AlertTitle>
          <AlertDescription>Escolha um projeto para ver as previsões.</AlertDescription>
        </Alert>
      ) : (
        <Card className="py-0">
          <CardHeader className="pt-6">
            <CardTitle>Previsões do projeto</CardTitle>
          </CardHeader>
          <Table containerClassName="max-h-[28rem]">
            <TableHeader sticky>
              <TableRow>
                <TableHead className="pl-6">Rubrica</TableHead>
                <TableHead>Mês</TableHead>
                <TableHead className="text-right">Valor previsto</TableHead>
                <TableHead className="pr-6 text-right">Versão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forecasts.map((row) => (
                <TableRow key={`${row.rubric}-${row.month}`}>
                  <TableCell className="pl-6">
                    <RubricBadge rubric={row.rubric} />
                  </TableCell>
                  <TableCell>{row.month}</TableCell>
                  <CurrencyCell value={row.amount} />
                  <TableCell className="pr-6 text-right text-muted-foreground">{row.version}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      <NewForecastDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        rubrics={project?.rubricas.map((rubric) => rubric.nome) ?? []}
      />
    </PmoPage>
  )
}
