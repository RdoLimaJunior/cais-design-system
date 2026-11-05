import { useState } from 'react'
import { IconEye, IconLayoutColumns, IconPencil, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Checkbox } from '../../components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { CurrencyCell } from '../../components/pmo/CurrencyCell'
import { CurrencyInput } from '../../components/pmo/CurrencyInput'
import type { PmoRole } from '../../components/pmo/navigation'
import { PersonAvatar } from '../../components/pmo/PersonAvatar'
import { PmoPage } from '../../components/pmo/PmoPage'
import { PMO_COLABORADORES, type ColaboradorMock } from '../../mocks/pmo'

const BONDS = ['CLT Direto', 'CLT Indireto', 'RPA', 'Bolsa Estágio', 'Bolsa Inovação', 'Bolsa Outorga']
const INSTITUTES = ['IDESCO', 'IEPRO', 'CAIS']

type ColumnKey = 'cpf' | 'email' | 'vinculo' | 'instituto' | 'admissao' | 'carga' | 'salario'
const COLUMN_LABELS: Record<ColumnKey, string> = {
  cpf: 'CPF',
  email: 'Email',
  vinculo: 'Vínculo',
  instituto: 'Instituto',
  admissao: 'Admissão',
  carga: 'Carga atual',
  salario: 'Salário base',
}

/** Janela de cadastro e edição de colaborador. Cadastrar a pessoa não a aloca: a alocação é na aba Equipe do projeto. */
export function CollaboratorFormDialog({
  open,
  onOpenChange,
  title = 'Novo colaborador',
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
}) {
  const [salary, setSalary] = useState(0)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Isso cadastra a pessoa. Para alocá-la a um projeto, use a aba Equipe do projeto.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="collab-name">Nome completo *</Label>
            <Input id="collab-name" placeholder="Ex.: Maria da Silva" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="collab-social-name">Nome social</Label>
            <Input id="collab-social-name" placeholder="Como a pessoa prefere ser chamada" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="collab-cpf">CPF *</Label>
            <Input id="collab-cpf" placeholder="000.000.000-00" inputMode="numeric" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="collab-email">Email *</Label>
            <Input id="collab-email" type="email" placeholder="pessoa@exemplo.org" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="collab-bond">Vínculo *</Label>
            <Select>
              <SelectTrigger className="w-full" id="collab-bond">
                <SelectValue placeholder="Escolha o vínculo" />
              </SelectTrigger>
              <SelectContent>
                {BONDS.map((bond) => (
                  <SelectItem key={bond} value={bond}>
                    {bond}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="collab-salary">Salário base *</Label>
            <CurrencyInput id="collab-salary" value={salary} onChange={setSalary} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="collab-admission">Data de admissão *</Label>
            <Input id="collab-admission" type="date" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="collab-format">Formato da jornada</Label>
            <Select defaultValue="presencial">
              <SelectTrigger className="w-full" id="collab-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="home">Home Office</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="collab-coordinator" />
            <Label htmlFor="collab-coordinator" className="font-normal">
              Coordenador de projeto
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="collab-manager" />
            <Label htmlFor="collab-manager" className="font-normal">
              Gestor de projeto
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export interface PmoCollaboratorsPageProps {
  colaboradores?: ColaboradorMock[]
  role?: PmoRole
  onOpenCollaborator?: (id: number) => void
}

/** Lista de colaboradores: busca, filtros, colunas visíveis e ações por linha. O Leitor não acessa esta tela. */
export function PmoCollaboratorsPage({
  colaboradores = PMO_COLABORADORES,
  role = 'GESTOR',
  onOpenCollaborator,
}: PmoCollaboratorsPageProps) {
  const [search, setSearch] = useState('')
  const [bond, setBond] = useState('all')
  const [institute, setInstitute] = useState('all')
  const [columns, setColumns] = useState<Record<ColumnKey, boolean>>({
    cpf: true,
    email: false,
    vinculo: true,
    instituto: true,
    admissao: false,
    carga: true,
    salario: true,
  })
  const [isFormOpen, setIsFormOpen] = useState(false)

  const rows = colaboradores.filter(
    (person) =>
      person.nome.toLowerCase().includes(search.toLowerCase()) &&
      (bond === 'all' || person.vinculo === bond) &&
      (institute === 'all' || INSTITUTES[person.id % INSTITUTES.length] === institute),
  )

  return (
    <PmoPage
      activeHref="/app/colaboradores"
      breadcrumb={[{ label: 'Colaboradores' }]}
      title="Colaboradores"
      subtitle="Pessoas cadastradas, com vínculo, instituto e carga nos projetos."
      role={role}
      actions={
        <Button size="lg" onClick={() => setIsFormOpen(true)}>
          <IconPlus aria-hidden="true" />
          Novo colaborador
        </Button>
      }
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative lg:max-w-sm lg:flex-1">
          <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            aria-label="Buscar por nome ou CPF"
            placeholder="Buscar por nome ou CPF..."
            className="pl-8"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select value={bond} onValueChange={setBond}>
          <SelectTrigger aria-label="Vínculo" className="lg:w-44">
            <SelectValue placeholder="Vínculo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os vínculos</SelectItem>
            {['CLT', 'RPA', 'Bolsista'].map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={institute} onValueChange={setInstitute}>
          <SelectTrigger aria-label="Instituto" className="lg:w-44">
            <SelectValue placeholder="Instituto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os institutos</SelectItem>
            {INSTITUTES.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="lg:ml-auto">
              <IconLayoutColumns aria-hidden="true" />
              Colunas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Colunas visíveis</DropdownMenuLabel>
            {(Object.keys(COLUMN_LABELS) as ColumnKey[]).map((key) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={columns[key]}
                onCheckedChange={(checked) => setColumns({ ...columns, [key]: Boolean(checked) })}
                onSelect={(event) => event.preventDefault()}
              >
                {COLUMN_LABELS[key]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {rows.length === 0 ? (
        <Alert variant="info">
          <AlertTitle>Nenhum colaborador encontrado</AlertTitle>
          <AlertDescription>Ajuste a busca ou os filtros.</AlertDescription>
        </Alert>
      ) : (
        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Colaborador</TableHead>
                {columns.cpf && <TableHead>CPF</TableHead>}
                {columns.email && <TableHead>Email</TableHead>}
                {columns.vinculo && <TableHead>Vínculo</TableHead>}
                {columns.instituto && <TableHead>Instituto</TableHead>}
                {columns.admissao && <TableHead>Admissão</TableHead>}
                {columns.carga && <TableHead>Carga atual</TableHead>}
                {columns.salario && role !== 'LEITOR' && <TableHead className="text-right">Salário base</TableHead>}
                <TableHead className="pr-4 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((person) => {
                const load = person.nome === 'Vaga em aberto' ? 0 : 60 + person.id * 15
                return (
                  <TableRow key={person.id}>
                    <TableCell className="pl-4">
                      <span className="flex items-center gap-2 font-medium">
                        <PersonAvatar name={person.nome} className="size-7" />
                        {person.nome}
                        {person.nome === 'Vaga em aberto' && <Badge variant="outline">vaga</Badge>}
                      </span>
                    </TableCell>
                    {columns.cpf && <TableCell className="text-muted-foreground tabular-nums">***.***.{String(100 + person.id)}-**</TableCell>}
                    {columns.email && <TableCell className="text-muted-foreground">pessoa{person.id}@exemplo.org</TableCell>}
                    {columns.vinculo && <TableCell>{person.vinculo}</TableCell>}
                    {columns.instituto && <TableCell>{INSTITUTES[person.id % INSTITUTES.length]}</TableCell>}
                    {columns.admissao && <TableCell>01/03/2025</TableCell>}
                    {columns.carga && (
                      <TableCell>
                        <Badge variant={load > 100 ? 'destructive' : load > 85 ? 'warning' : 'success'}>{load}%</Badge>
                      </TableCell>
                    )}
                    {columns.salario && role !== 'LEITOR' && (
                      <CurrencyCell value={person.valorHora * person.horasPorMes} />
                    )}
                    <TableCell className="pr-4">
                      <span className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="Visualizar colaborador" onClick={() => onOpenCollaborator?.(person.id)}>
                          <IconEye aria-hidden="true" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Editar colaborador" onClick={() => setIsFormOpen(true)}>
                          <IconPencil aria-hidden="true" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Excluir colaborador">
                          <IconTrash aria-hidden="true" />
                        </Button>
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
      <p className="text-xs text-muted-foreground">
        Carga atual: até 85% é dedicação normal; acima de 85% é atenção; acima de 100% está sobrealocado.
      </p>
      <CollaboratorFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />
    </PmoPage>
  )
}
