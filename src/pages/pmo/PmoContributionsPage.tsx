import { useState } from 'react'
import { IconPlus } from '@tabler/icons-react'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
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
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Textarea } from '../../components/ui/textarea'
import { CurrencyCell } from '../../components/pmo/CurrencyCell'
import { CurrencyInput } from '../../components/pmo/CurrencyInput'
import type { PmoRole } from '../../components/pmo/navigation'
import { PmoPage } from '../../components/pmo/PmoPage'
import { StatCard } from '../../components/pmo/StatCard'
import { formatCurrency } from '../../lib/finance'
import { PMO_APORTES } from '../../mocks/pmoDetails'

/** Percentual do instituto retirado de cada aporte neste exemplo; no sistema vem do instituto ou do projeto. */
const EXAMPLE_FEE_PERCENT = 10

function RegisterContributionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [gross, setGross] = useState(0)
  const net = gross - gross * (EXAMPLE_FEE_PERCENT / 100)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar aporte</DialogTitle>
          <DialogDescription>Entrada de caixa do projeto. A taxa do instituto é retirada do valor bruto.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="contribution-date">Data do aporte</Label>
            <Input id="contribution-date" type="date" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contribution-document">Nº do documento (NF, depósito, extrato)</Label>
            <Input id="contribution-document" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contribution-gross">Aporte bruto</Label>
            <CurrencyInput id="contribution-gross" value={gross} onChange={setGross} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contribution-net">Líquido para o projeto</Label>
            <Input id="contribution-net" readOnly value={formatCurrency(net)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="contribution-justification">Justificativa</Label>
            <Textarea
              id="contribution-justification"
              rows={2}
              placeholder="Ex.: Parcela 2 do convênio, depositada em conta"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="contribution-proof">Comprovante bancário (PDF, JPG ou PNG, opcional)</Label>
            <Input id="contribution-proof" type="file" accept=".pdf,.jpg,.jpeg,.png" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={gross <= 0}>Registrar aporte</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Aportes: entradas de caixa do projeto, com a taxa do instituto retirada de cada uma. */
export function PmoContributionsPage({ role = 'GESTOR' }: { role?: PmoRole }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const totalGross = PMO_APORTES.reduce((sum, item) => sum + item.bruto, 0)
  const totalFee = PMO_APORTES.reduce((sum, item) => sum + item.taxa, 0)

  return (
    <PmoPage
      activeHref="/app/aportes"
      breadcrumb={[{ label: 'Aportes' }]}
      title="Aportes"
      subtitle="Entradas de caixa do projeto. A taxa do instituto é retirada de cada aporte."
      role={role}
      actions={
        <Button onClick={() => setIsDialogOpen(true)}>
          <IconPlus aria-hidden="true" />
          Registrar aporte
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total bruto" value={formatCurrency(totalGross)} />
        <StatCard label="Taxa administrativa" value={formatCurrency(totalFee)} />
        <StatCard label="Total líquido" value={formatCurrency(totalGross - totalFee)} />
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Data</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead className="text-right">Valor bruto</TableHead>
              <TableHead className="text-right">Taxa adm.</TableHead>
              <TableHead className="pr-4 text-right">Líquido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PMO_APORTES.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="pl-4">{item.data}</TableCell>
                <TableCell className="text-muted-foreground">{item.documento}</TableCell>
                <CurrencyCell value={item.bruto} />
                <CurrencyCell value={item.taxa} />
                <CurrencyCell value={item.bruto - item.taxa} strong className="pr-4" />
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="pl-4">
                Total
              </TableCell>
              <CurrencyCell value={totalGross} strong />
              <CurrencyCell value={totalFee} strong />
              <CurrencyCell value={totalGross - totalFee} strong className="pr-4" />
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
      <RegisterContributionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </PmoPage>
  )
}
