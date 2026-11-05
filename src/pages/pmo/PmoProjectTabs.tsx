import { useState } from 'react'
import { IconLock, IconPlus } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Progress } from '../../components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Switch } from '../../components/ui/switch'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { CurrencyCell } from '../../components/pmo/CurrencyCell'
import { CurrencyInput } from '../../components/pmo/CurrencyInput'
import { HelpTip } from '../../components/pmo/HelpTip'
import { IncurredCostsCap } from '../../components/pmo/IncurredCostsCap'
import { PercentInput } from '../../components/pmo/PercentInput'
import { PersonAvatar } from '../../components/pmo/PersonAvatar'
import { RubricBadge } from '../../components/pmo/RubricBadge'
import { StatCard } from '../../components/pmo/StatCard'
import { formatCurrency, formatPercent } from '../../lib/finance'
import type { ProjetoMock } from '../../mocks/pmo'
import {
  PMO_APORTES,
  PMO_ESPELHO_RH,
  PMO_FECHAMENTOS,
  PMO_GASTOS,
  PMO_INCORRIDOS,
  PMO_SERIE_MENSAL,
} from '../../mocks/pmoDetails'
import { PMO_COLABORADORES } from '../../mocks/pmo'

const MONTHS_IN_MIRROR = ['01/26', '02/26', '03/26', '04/26', '05/26', '06/26']

interface TabProps {
  project: ProjetoMock
  canSeeSalaries: boolean
}

/** Resumo: indicadores de contrato e de saldo, e as rubricas por grupo. */
export function SummaryTab({ project }: TabProps) {
  const contracted = project.orcamento
  const realized = project.gasto
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Aporte contratado" value={formatCurrency(contracted)} />
        <StatCard label="Total realizado (sem taxa)" value={formatCurrency(realized)} />
        <StatCard label="Saldo final projetado" value={formatCurrency(contracted - realized)} />
        <StatCard label="Taxa do instituto (repasse)" value={formatCurrency(contracted * 0.1)} />
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Rubrica</TableHead>
              <TableHead className="text-right">Previsto</TableHead>
              <TableHead className="text-right">Executado</TableHead>
              <TableHead className="pr-4 text-right">Saldo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {project.rubricas.map((rubric) => (
              <TableRow key={rubric.nome}>
                <TableCell className="pl-4">
                  <RubricBadge rubric={rubric.nome} />
                </TableCell>
                <CurrencyCell value={rubric.previsto} />
                <CurrencyCell value={rubric.executado} />
                <CurrencyCell value={rubric.previsto - rubric.executado} redIfNegative className="pr-4" />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

/** Visão geral: pessoal, financeiro, limites e aportes. */
export function OverviewTab({ project }: TabProps) {
  const received = PMO_APORTES.reduce((sum, contribution) => sum + contribution.bruto, 0)
  const fee = PMO_APORTES.reduce((sum, contribution) => sum + contribution.taxa, 0)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Aportes recebidos" value={formatCurrency(received)} />
        <StatCard label="Taxa adm. (CAIS)" value={formatCurrency(fee)} />
        <StatCard label="Despesas executadas" value={formatCurrency(project.gasto)} />
        <StatCard label="Saldo livre" value={formatCurrency(received - fee - project.gasto)} />
      </div>
      <IncurredCostsCap
        percent={project.incorridosPercent}
        help={<HelpTip text="(taxa administrativa + fundo de reserva + custos administrativos) ÷ base de aportes não pode passar de 20%." />}
      />
      <Card>
        <CardHeader>
          <CardTitle>Execução por área — planejado × executado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.rubricas.map((rubric) => (
            <div key={rubric.nome} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>{rubric.nome}</span>
                <span className="text-muted-foreground tabular-nums">
                  {formatCurrency(rubric.executado)} de {formatCurrency(rubric.previsto)}
                </span>
              </div>
              <Progress
                value={rubric.previsto > 0 ? (rubric.executado / rubric.previsto) * 100 : 0}
                aria-label={`Execução de ${rubric.nome}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>
      <Alert variant="info">
        <AlertTitle>Burn rate e runway</AlertTitle>
        <AlertDescription>Indisponível: requer aportes e execução registrados.</AlertDescription>
      </Alert>
    </div>
  )
}

/** Folha RH: planejado × realizado por mês. */
export function PayrollTab({ canSeeSalaries }: TabProps) {
  if (!canSeeSalaries) {
    return (
      <Alert variant="warning">
        <AlertTitle>Sem acesso aos valores de folha</AlertTitle>
        <AlertDescription>O seu perfil não vê salários nem encargos.</AlertDescription>
      </Alert>
    )
  }
  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Mês</TableHead>
            <TableHead className="text-right">Planejado</TableHead>
            <TableHead className="text-right">Realizado</TableHead>
            <TableHead className="pr-4 text-right">Desvio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PMO_SERIE_MENSAL.map((month) => (
            <TableRow key={month.mes}>
              <TableCell className="pl-4">{month.mes}</TableCell>
              <CurrencyCell value={month.planejado} />
              <CurrencyCell value={month.executado} />
              <CurrencyCell value={month.executado - month.planejado} redIfNegative className="pr-4" />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

/** Espelho RH: colaborador por mês, somente leitura, para conferir o executado. */
export function MirrorTab({ canSeeSalaries }: TabProps) {
  const [search, setSearch] = useState('')
  const [bond, setBond] = useState('all')
  if (!canSeeSalaries) {
    return (
      <Alert variant="warning">
        <AlertTitle>Sem acesso aos valores de folha</AlertTitle>
        <AlertDescription>O seu perfil não vê salários nem encargos.</AlertDescription>
      </Alert>
    )
  }
  const rows = PMO_ESPELHO_RH.filter(
    (row) =>
      row.colaborador.toLowerCase().includes(search.toLowerCase()) && (bond === 'all' || row.vinculo === bond),
  )
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Espelho RH (somente leitura): colaborador × mês, para conferência do executado.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          aria-label="Buscar colaborador"
          placeholder="Buscar colaborador…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={bond} onValueChange={setBond}>
          <SelectTrigger aria-label="Filtrar por vínculo" className="sm:w-48">
            <SelectValue placeholder="Vínculo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os vínculos</SelectItem>
            <SelectItem value="CLT">CLT</SelectItem>
            <SelectItem value="RPA">RPA</SelectItem>
            <SelectItem value="Bolsista">Bolsista</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {rows.length === 0 ? (
        <Alert variant="info">
          <AlertTitle>Nenhum colaborador encontrado com esse filtro.</AlertTitle>
        </Alert>
      ) : (
        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Colaborador</TableHead>
                <TableHead>Seção</TableHead>
                <TableHead>Vínculo</TableHead>
                {MONTHS_IN_MIRROR.map((month) => (
                  <TableHead key={month} className="text-right">
                    {month}
                  </TableHead>
                ))}
                <TableHead className="pr-4 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.colaborador}>
                  <TableCell className="pl-4 font-medium">
                    {row.colaborador}
                    {row.colaborador === 'Vaga em aberto' && (
                      <Badge variant="outline" className="ml-2">
                        vaga
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.secao}</TableCell>
                  <TableCell>{row.vinculo}</TableCell>
                  {row.meses.map((value, index) => (
                    <CurrencyCell key={index} value={value} />
                  ))}
                  <CurrencyCell value={row.meses.reduce((sum, value) => sum + value, 0)} strong className="pr-4" />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}

/** Demais rubricas: gastos com nota fiscal. */
export function OtherExpensesTab() {
  const subtotal = PMO_GASTOS.reduce((sum, expense) => sum + expense.valor, 0)
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Demais rubricas — gastos com nota fiscal</h3>
        <Button>
          <IconPlus aria-hidden="true" />
          Novo gasto
        </Button>
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="pr-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PMO_GASTOS.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="pl-4">{expense.data}</TableCell>
                <TableCell>{expense.descricao}</TableCell>
                <TableCell className="text-muted-foreground">{expense.fornecedor}</TableCell>
                <CurrencyCell value={expense.valor} />
                <TableCell className="pr-4">
                  <Badge variant={expense.status === 'Confirmado' ? 'success' : 'outline'}>{expense.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="pl-4">
                Subtotal
              </TableCell>
              <CurrencyCell value={subtotal} strong />
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </div>
  )
}

/** Incorridos: teto de 20%, custos importados da planilha e lançamentos manuais. */
export function IncurredTab({ project }: TabProps) {
  const [amount, setAmount] = useState(0)
  const [description, setDescription] = useState('')
  return (
    <div className="space-y-4">
      <IncurredCostsCap
        percent={project.incorridosPercent}
        help={<HelpTip text="Regra RN-EX03: acima do teto, novos lançamentos de incorridos são bloqueados." />}
      />
      <Card>
        <CardHeader>
          <CardTitle>Custos incorridos (importados da planilha)</CardTitle>
          <CardDescription>Peça a um Administrador, Gestor ou Analista para editar os valores.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Item</TableHead>
                <TableHead>Rubrica</TableHead>
                {MONTHS_IN_MIRROR.map((month) => (
                  <TableHead key={month} className="text-right">
                    {month}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PMO_INCORRIDOS.map((item) => (
                <TableRow key={item.item}>
                  <TableCell className="pl-6 font-medium">{item.item}</TableCell>
                  <TableCell>
                    <RubricBadge rubric={item.rubrica} />
                  </TableCell>
                  {item.meses.map((value, index) => (
                    <CurrencyCell key={index} value={value} />
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Lançamentos manuais (execução)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="incurred-description">Descrição</Label>
            <Input
              id="incurred-description"
              placeholder="Ex.: Tarifas bancárias"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="incurred-amount">Valor</Label>
            <CurrencyInput id="incurred-amount" value={amount} onChange={setAmount} />
          </div>
          <div className="sm:col-span-3">
            <Button disabled={!description || amount === 0}>
              <IconPlus aria-hidden="true" />
              Adicionar incorrido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/** Realizado: planejado × executado mês a mês e por rubrica, e os remanejamentos. */
export function RealizedTab({ project }: TabProps) {
  const planned = project.rubricas.reduce((sum, rubric) => sum + rubric.previsto, 0)
  const executed = project.rubricas.reduce((sum, rubric) => sum + rubric.executado, 0)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Planejado" value={formatCurrency(planned)} />
        <StatCard label="Executado" value={formatCurrency(executed)} />
        <StatCard label="Saldo" value={formatCurrency(planned - executed)} />
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Mês</TableHead>
              <TableHead className="text-right">Planejado</TableHead>
              <TableHead className="text-right">Executado</TableHead>
              <TableHead className="pr-4 text-right">Execução</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PMO_SERIE_MENSAL.map((month) => (
              <TableRow key={month.mes}>
                <TableCell className="pl-4">{month.mes}</TableCell>
                <CurrencyCell value={month.planejado} />
                <CurrencyCell value={month.executado} />
                <TableCell className="pr-4 text-right tabular-nums">
                  {month.executado === 0 ? '—' : formatPercent((month.executado / month.planejado) * 100, 1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Alert variant="info">
        <AlertTitle>Remanejamentos</AlertTitle>
        <AlertDescription>Nenhum remanejamento registrado para este projeto.</AlertDescription>
      </Alert>
    </div>
  )
}

/** Fechamento mensal: fechar e reabrir meses. Só Administrador e Gestor reabrem. */
export function ClosingTab({ canSeeSalaries }: TabProps) {
  const canReopen = canSeeSalaries
  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Mês do projeto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Quem / quando</TableHead>
            <TableHead className="pr-4 text-right">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PMO_FECHAMENTOS.map((closing) => (
            <TableRow key={closing.mes}>
              <TableCell className="pl-4 font-medium">{closing.mes}</TableCell>
              <TableCell>
                <Badge variant={closing.status === 'Fechado' ? 'success' : closing.status === 'Reaberto' ? 'warning' : 'outline'}>
                  {closing.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{closing.quem}</TableCell>
              <TableCell className="pr-4 text-right">
                <Button variant="outline" size="sm" disabled={closing.status !== 'Aberto' && !canReopen}>
                  {closing.status === 'Aberto' ? 'Fechar mês' : 'Reabrir'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

/** Equipe e parâmetros: gerente, analistas, colaboradores alocados e parâmetros financeiros do projeto. */
export function TeamTab({ project, canSeeSalaries }: TabProps) {
  const [adminFee, setAdminFee] = useState(10)
  const [christmasBonus, setChristmasBonus] = useState(true)
  const team = PMO_COLABORADORES.filter((person) => person.projeto === project.titulo)
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Gerente do projeto</CardTitle>
          <CardDescription>Responsável principal, exibido na listagem de projetos.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <PersonAvatar name={project.responsavel} />
          <span>{project.responsavel}</span>
        </CardContent>
      </Card>
      <Card className="py-0">
        <CardHeader className="pt-6">
          <CardTitle>Colaboradores do projeto</CardTitle>
          <CardDescription>Pessoas alocadas neste projeto na Folha RH (RH direto e indireto).</CardDescription>
        </CardHeader>
        {team.length === 0 ? (
          <Alert variant="info" className="mx-6 mb-6 w-auto">
            <AlertTitle>Nenhum colaborador alocado a este projeto na Folha RH ainda.</AlertTitle>
          </Alert>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Colaborador</TableHead>
                <TableHead>Vínculo</TableHead>
                <TableHead>Dedicação</TableHead>
                {canSeeSalaries && <TableHead className="pr-6 text-right">Valor/hora</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="pl-6">
                    <span className="flex items-center gap-2">
                      <PersonAvatar name={person.nome} className="size-7" />
                      {person.nome}
                    </span>
                  </TableCell>
                  <TableCell>{person.vinculo}</TableCell>
                  <TableCell className="tabular-nums">{person.horasPorMes} h/mês</TableCell>
                  {canSeeSalaries && <CurrencyCell value={person.valorHora} className="pr-6" />}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros do projeto</CardTitle>
          <CardDescription>Modelo do projeto e regras financeiras próprias.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="admin-fee">Taxa administrativa (%)</Label>
            <PercentInput id="admin-fee" value={adminFee} onChange={setAdminFee} />
          </div>
          <div className="flex items-center gap-3 self-end">
            <Switch id="christmas-bonus" checked={christmasBonus} onCheckedChange={setChristmasBonus} />
            <Label htmlFor="christmas-bonus">Reaplicar bônus natalino</Label>
          </div>
        </CardContent>
      </Card>
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <IconLock size={12} aria-hidden="true" />
        Só Administrador e Gestor podem alterar a equipe e os parâmetros.
      </p>
    </div>
  )
}
