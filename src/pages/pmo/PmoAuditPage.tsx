import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { Card } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { CurrencyCell } from '../../components/pmo/CurrencyCell'
import { PmoPage } from '../../components/pmo/PmoPage'
import type { PmoRole } from '../../components/pmo/navigation'
import { StatCard } from '../../components/pmo/StatCard'

type LedgerKind = 'Aporte' | 'Execução' | 'Remanejamento' | 'Ajuste'

interface LedgerEntry {
  id: number
  date: string
  user: string
  kind: LedgerKind
  project: string
  amount: number
}

const LEDGER: LedgerEntry[] = [
  { id: 1, date: '05/11/2026 14:30', user: 'Ana Gestora', kind: 'Execução', project: 'Plataforma de análise de dados (exemplo)', amount: 18_400 },
  { id: 2, date: '05/11/2026 11:02', user: 'Carla Analista', kind: 'Remanejamento', project: 'Laboratório de testes automatizados (exemplo)', amount: 12_000 },
  { id: 3, date: '04/11/2026 16:45', user: 'Ana Gestora', kind: 'Aporte', project: 'Plataforma de análise de dados (exemplo)', amount: 250_000 },
  { id: 4, date: '03/11/2026 09:18', user: 'Gustavo Admin', kind: 'Ajuste', project: 'Gestão de portfólio de inovação (exemplo)', amount: -1_250.5 },
]

const KIND_VARIANT: Record<LedgerKind, 'info' | 'success' | 'warning' | 'outline'> = {
  Aporte: 'success',
  Execução: 'info',
  Remanejamento: 'warning',
  Ajuste: 'outline',
}

/**
 * Auditoria. No PMO atual a tela ainda mostra só dois indicadores e o aviso "em desenvolvimento"; a tabela abaixo
 * dá forma ao livro-razão (append-only: nunca se altera um lançamento, correções entram como "Ajuste").
 */
export function PmoAuditPage({ role = 'GESTOR' }: { role?: PmoRole }) {
  return (
    <PmoPage
      activeHref="/app/auditoria"
      breadcrumb={[{ label: 'Auditoria' }]}
      title="Auditoria"
      subtitle="Trilha das movimentações financeiras do portfólio."
      role={role}
    >
      <Alert variant="info">
        <AlertTitle>Auditoria em desenvolvimento</AlertTitle>
        <AlertDescription>
          No PMO atual esta tela mostra apenas os indicadores. A tabela abaixo é o formato previsto para a trilha.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <StatCard label="Transações auditadas" value="1.247" />
        <StatCard label="Última auditoria" value="Hoje, 14h30" />
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Data</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead className="pr-4 text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LEDGER.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="pl-4 tabular-nums">{entry.date}</TableCell>
                <TableCell>{entry.user}</TableCell>
                <TableCell>
                  <Badge variant={KIND_VARIANT[entry.kind]}>{entry.kind}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{entry.project}</TableCell>
                <CurrencyCell value={entry.amount} redIfNegative className="pr-4" />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PmoPage>
  )
}
