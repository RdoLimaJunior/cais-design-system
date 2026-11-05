import { useState } from 'react'
import { IconPencil } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Progress } from '../../components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { CurrencyCell } from '../../components/pmo/CurrencyCell'
import type { PmoRole } from '../../components/pmo/navigation'
import { PersonAvatar } from '../../components/pmo/PersonAvatar'
import { PmoPage } from '../../components/pmo/PmoPage'
import { PMO_COLABORADORES, type ColaboradorMock } from '../../mocks/pmo'
import { PMO_SALARIOS_HISTORICO } from '../../mocks/pmoDetails'
import { CollaboratorFormDialog } from './PmoCollaboratorsPage'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}

export interface PmoCollaboratorDetailPageProps {
  colaborador?: ColaboradorMock
  role?: PmoRole
}

/** Detalhe do colaborador: contato, vínculo, ocupação nos projetos ativos e histórico de salários. */
export function PmoCollaboratorDetailPage({
  colaborador = PMO_COLABORADORES[0],
  role = 'GESTOR',
}: PmoCollaboratorDetailPageProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const load = colaborador.nome === 'Vaga em aberto' ? 0 : 60 + colaborador.id * 15

  return (
    <PmoPage
      activeHref="/app/colaboradores"
      breadcrumb={[{ label: 'Colaboradores', href: '/app/colaboradores' }, { label: colaborador.nome }]}
      title={colaborador.nome}
      subtitle={`${colaborador.vinculo} · ${colaborador.projeto}`}
      role={role}
      actions={
        <Button variant="outline" onClick={() => setIsFormOpen(true)}>
          <IconPencil aria-hidden="true" />
          Editar
        </Button>
      }
    >
      <Card>
        <CardHeader className="flex-row items-center gap-3">
          <PersonAvatar name={colaborador.nome} className="size-10" />
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Coordenador</Badge>
            <Badge variant="outline">Gestor</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section aria-labelledby="contact-title">
            <h3 id="contact-title" className="mb-3 text-sm font-semibold">
              Contato e identificação
            </h3>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="CPF" value={`***.***.${String(100 + colaborador.id)}-**`} />
              <Field label="Email" value={`pessoa${colaborador.id}@exemplo.org`} />
              <Field label="Email institucional" value={`pessoa${colaborador.id}@instituto.exemplo.org`} />
              <Field label="ID Farol" value={`FAROL-${1000 + colaborador.id}`} />
            </dl>
          </section>
          <section aria-labelledby="bond-title">
            <h3 id="bond-title" className="mb-3 text-sm font-semibold">
              Vínculo institucional
            </h3>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Vínculo" value={colaborador.vinculo} />
              <Field label="Data de admissão" value="01/03/2025" />
              <Field label="Anos de serviço" value="1 ano e 8 meses" />
              {role !== 'LEITOR' && (
                <Field label="Salário base" value={(colaborador.valorHora * colaborador.horasPorMes).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
              )}
            </dl>
          </section>
          <section aria-labelledby="load-title" className="space-y-2">
            <h3 id="load-title" className="text-sm font-semibold">
              Ocupação
            </h3>
            <p className="text-xs text-muted-foreground">Dedicação somada nos projetos ativos.</p>
            <Progress value={Math.min(load, 100)} aria-label="Ocupação nos projetos ativos" />
            <p className="text-sm tabular-nums">{load}%</p>
          </section>
        </CardContent>
      </Card>

      {role !== 'LEITOR' ? (
        <Card className="py-0">
          <CardHeader className="pt-6">
            <CardTitle>Histórico de salários</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 text-right">Salário</TableHead>
                <TableHead>Data de início</TableHead>
                <TableHead>Data de fim</TableHead>
                <TableHead className="pr-6">Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PMO_SALARIOS_HISTORICO.map((entry) => (
                <TableRow key={entry.inicio}>
                  <CurrencyCell value={entry.salario} className="pl-6" />
                  <TableCell>{entry.inicio}</TableCell>
                  <TableCell>{entry.fim}</TableCell>
                  <TableCell className="pr-6">{entry.motivo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Alert variant="warning">
          <AlertTitle>Salários ocultos</AlertTitle>
          <AlertDescription>O seu perfil não vê salários nem encargos.</AlertDescription>
        </Alert>
      )}

      <CollaboratorFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} title="Editar colaborador" />
    </PmoPage>
  )
}
