import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { CurrencyCell } from '../../components/pmo/CurrencyCell'
import { CurrencyInput } from '../../components/pmo/CurrencyInput'
import type { PmoRole } from '../../components/pmo/navigation'
import { PercentInput } from '../../components/pmo/PercentInput'
import { PmoPage } from '../../components/pmo/PmoPage'
import { formatCurrency } from '../../lib/finance'
import { PMO_PROJETOS } from '../../mocks/pmo'

const SIMULATOR_MODES = [
  { key: 'liquido', label: 'Valor líquido' },
  { key: 'bruto', label: 'Valor bruto' },
] as const
type SimulatorMode = (typeof SIMULATOR_MODES)[number]['key']

interface RpaResult {
  gross: number
  inss: number
  iss: number
  irrf: number
  net: number
  employerInss: number
  totalCost: number
}

/**
 * Cálculo ilustrativo do Storybook. O cálculo real (INSS, ISS e IRRF) é feito pelo servidor; este só dá forma ao resultado.
 * As alíquotas abaixo são de exemplo e não devem ser usadas para nenhuma decisão.
 */
function simulateRpaExample(mode: SimulatorMode, amount: number, issPercent: number): RpaResult {
  const gross = mode === 'bruto' ? amount : amount / 0.85
  const inss = gross * 0.11
  const iss = gross * (issPercent / 100)
  const irrf = gross * 0.05
  const net = gross - inss - iss - irrf
  const employerInss = gross * 0.2
  return { gross, inss, iss, irrf, net, employerInss, totalCost: gross + employerInss }
}

function ResultRow({ label, value, strong }: { label: string; value: number | null; strong?: boolean }) {
  return (
    <div className={`flex justify-between py-1.5 text-sm ${strong ? 'border-t pt-2.5 font-semibold' : ''}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value === null ? '—' : formatCurrency(value)}</span>
    </div>
  )
}

/** Simulador RPA: calcula o bruto a partir do líquido (ou o inverso), com as retenções discriminadas e o custo total. */
export function PmoRpaSimulatorPage({ role = 'GESTOR' }: { role?: PmoRole }) {
  const [mode, setMode] = useState<SimulatorMode>('liquido')
  const [amount, setAmount] = useState(0)
  const [issPercent, setIssPercent] = useState(5)
  const [result, setResult] = useState<RpaResult | null>(null)

  return (
    <PmoPage
      activeHref="/app/simulador-rpa"
      breadcrumb={[{ label: 'Simulador RPA' }]}
      title="Simulador RPA"
      subtitle="Calcule o valor bruto a partir do líquido acordado (ou o inverso), com as retenções discriminadas e o custo total."
      role={role}
    >
      <Alert variant="warning">
        <AlertTitle>Valores ilustrativos</AlertTitle>
        <AlertDescription>No Storybook o cálculo é de exemplo. O cálculo oficial é feito pelo servidor.</AlertDescription>
      </Alert>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>O que você já sabe?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2" role="group" aria-label="O que você já sabe">
              {SIMULATOR_MODES.map((option) => (
                <Button
                  key={option.key}
                  variant={mode === option.key ? 'default' : 'outline'}
                  aria-pressed={mode === option.key}
                  onClick={() => {
                    setMode(option.key)
                    setResult(null)
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {mode === 'liquido'
                ? 'Informe quanto o prestador deve receber: o sistema calcula o bruto necessário.'
                : 'Informe o valor bruto do RPA: o sistema calcula as retenções e o líquido.'}
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="rpa-amount">{mode === 'liquido' ? 'Valor líquido desejado' : 'Valor bruto'}</Label>
              <CurrencyInput id="rpa-amount" value={amount} onChange={setAmount} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rpa-iss">ISS (%)</Label>
              <PercentInput id="rpa-iss" value={issPercent} onChange={setIssPercent} />
            </div>
            <Button className="w-full" disabled={amount <= 0} onClick={() => setResult(simulateRpaExample(mode, amount, issPercent))}>
              Simular
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <p className="text-sm text-muted-foreground">Preencha o valor ao lado e clique em Simular.</p>
            ) : (
              <div>
                <ResultRow label="Valor bruto" value={result.gross} strong />
                <ResultRow label="(−) INSS" value={result.inss} />
                <ResultRow label="(−) ISS" value={result.iss} />
                <ResultRow label="(−) IRRF" value={result.irrf} />
                <ResultRow label="Valor líquido" value={result.net} strong />
                <ResultRow label="(+) INSS patronal" value={result.employerInss} />
                <ResultRow label="Custo total do projeto" value={result.totalCost} strong />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PmoPage>
  )
}

const WORK_PLAN_MONTHS = ['06/2026', '07/2026', '08/2026', '09/2026', '10/2026', '11/2026']

/** Timeline do Plano de Trabalho: meses planejados e resumo por rubrica. */
export function PmoWorkPlanTimelinePage({ role = 'GESTOR' }: { role?: PmoRole }) {
  const project = PMO_PROJETOS[0]
  return (
    <PmoPage
      activeHref="/app/orcamento"
      breadcrumb={[{ label: 'Plano de Trabalho', href: '/app/orcamento' }, { label: 'Timeline' }]}
      title="Plano de Trabalho - Timeline"
      subtitle="Meses planejados e resumo por rubrica."
      role={role}
    >
      <Card className="py-0">
        <CardHeader className="pt-6">
          <CardTitle>Resumo por rubrica</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Rubrica</TableHead>
              {WORK_PLAN_MONTHS.map((month) => (
                <TableHead key={month} className="text-right">
                  {month}
                </TableHead>
              ))}
              <TableHead className="pr-6 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {project.rubricas.map((rubric) => (
              <TableRow key={rubric.nome}>
                <TableCell className="pl-6">{rubric.nome}</TableCell>
                {WORK_PLAN_MONTHS.map((month) => (
                  <CurrencyCell key={month} value={rubric.previsto / 12} />
                ))}
                <CurrencyCell value={(rubric.previsto / 12) * WORK_PLAN_MONTHS.length} strong className="pr-6" />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PmoPage>
  )
}

/** Folha RH: porta de entrada que lista os projetos com o saldo disponível de cada um. */
export function PmoPayrollHubPage({ role = 'GESTOR' }: { role?: PmoRole }) {
  return (
    <PmoPage
      activeHref="/app/folha-rh"
      breadcrumb={[{ label: 'Folha RH' }]}
      title="Folha RH — Gestão de Pessoal"
      subtitle="Planejamento mensal de custos RH, rubricas e validação de compliance financeira."
      role={role}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PMO_PROJETOS.filter((project) => !project.arquivado).map((project) => (
          <Card key={project.id} className="gap-3">
            <CardHeader>
              <CardTitle className="leading-snug">{project.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Saldo disponível</span>
                <span className="font-semibold tabular-nums">{formatCurrency(project.orcamento - project.gasto)}</span>
              </div>
              <Button variant="outline" className="w-full">
                Acessar Folha RH
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PmoPage>
  )
}

/** Matriz de RH: o usuário escolhe um projeto para visualizar o Espelho de RH. */
export function PmoHrMatrixPage({ role = 'GESTOR' }: { role?: PmoRole }) {
  return (
    <PmoPage
      activeHref="/app/rh"
      breadcrumb={[{ label: 'RH Matrix' }]}
      title="RH Matrix"
      subtitle="Selecione um projeto para visualizar o Espelho de RH."
      role={role}
    >
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Projeto</TableHead>
              <TableHead>Instituto</TableHead>
              <TableHead className="pr-4 text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PMO_PROJETOS.filter((project) => !project.arquivado).map((project) => (
              <TableRow key={project.id}>
                <TableCell className="pl-4 font-medium">{project.titulo}</TableCell>
                <TableCell>{project.instituto}</TableCell>
                <TableCell className="pr-4 text-right">
                  <Button variant="outline" size="sm">
                    Visualizar RH
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PmoPage>
  )
}

/** Perfil do usuário: dados da conta, troca de senha e saída. */
export function PmoProfilePage({ role = 'GESTOR', userName = 'Ana Gestora' }: { role?: PmoRole; userName?: string }) {
  return (
    <PmoPage
      activeHref="/app/config"
      breadcrumb={[{ label: 'Meu perfil' }]}
      title="Meu perfil"
      subtitle="Dados da conta e senha."
      role={role}
      userName={userName}
      actions={<Button variant="outline">Sair da Conta</Button>}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dados da conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Nome</Label>
              <Input id="profile-name" value={userName} readOnly />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" value="gestora@exemplo.org" readOnly />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-role">Permissão</Label>
              <Input id="profile-role" value={role} readOnly />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trocar senha</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="profile-current">Senha atual *</Label>
              <Input id="profile-current" type="password" autoComplete="current-password" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-new">Nova senha *</Label>
              <Input id="profile-new" type="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-confirm">Confirmar nova senha *</Label>
              <Input id="profile-confirm" type="password" autoComplete="new-password" />
            </div>
            <Button>Salvar nova senha</Button>
          </CardContent>
        </Card>
      </div>
    </PmoPage>
  )
}
