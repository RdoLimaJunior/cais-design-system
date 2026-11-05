import { useState } from 'react'
import { IconPencil, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Switch } from '../../components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { CurrencyInput } from '../../components/pmo/CurrencyInput'
import type { PmoRole } from '../../components/pmo/navigation'
import { PercentInput } from '../../components/pmo/PercentInput'
import { PmoPage } from '../../components/pmo/PmoPage'
import {
  PMO_INSTITUTOS,
  PMO_MODELOS_DE_PROJETO,
  PMO_REGRAS_DE_ACESSO,
  PMO_RUBRICAS,
  PMO_USUARIOS,
} from '../../mocks/pmoDetails'

export type SettingsTabKey = 'institutos' | 'modelos' | 'rubricas' | 'usuarios' | 'regras'

const SETTINGS_TABS: { key: SettingsTabKey; label: string }[] = [
  { key: 'institutos', label: 'Institutos' },
  { key: 'modelos', label: 'Modelos de Projeto' },
  { key: 'rubricas', label: 'Rubricas' },
  { key: 'usuarios', label: 'Usuários' },
  { key: 'regras', label: 'Regras de Acesso' },
]

function InstitutesTab({ onOpen }: { onOpen?: (id: number) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button>
          <IconPlus aria-hidden="true" />
          Novo instituto
        </Button>
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Nome</TableHead>
              <TableHead className="text-right">Taxa administrativa</TableHead>
              <TableHead className="pr-4 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PMO_INSTITUTOS.map((institute) => (
              <TableRow key={institute.id} className="cursor-pointer" onClick={() => onOpen?.(institute.id)}>
                <TableCell className="pl-4 font-medium">{institute.nome}</TableCell>
                <TableCell className="text-right tabular-nums">{institute.taxaAdministrativa.toLocaleString('pt-BR')}%</TableCell>
                <TableCell className="pr-4">
                  <span className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label="Editar instituto">
                      <IconPencil aria-hidden="true" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Deletar instituto">
                      <IconTrash aria-hidden="true" />
                    </Button>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function ProjectModelsTab() {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button>
          <IconPlus aria-hidden="true" />
          Novo modelo
        </Button>
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Modelo</TableHead>
              <TableHead>Versão</TableHead>
              <TableHead className="text-right">Abas</TableHead>
              <TableHead className="text-right">Projetos</TableHead>
              <TableHead className="pr-4">Situação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PMO_MODELOS_DE_PROJETO.map((model) => (
              <TableRow key={model.id}>
                <TableCell className="pl-4 font-medium">
                  {model.nome} {model.padrao && <Badge className="ml-2">Padrão</Badge>}
                </TableCell>
                <TableCell>v{model.versao}</TableCell>
                <TableCell className="text-right tabular-nums">{model.abas}</TableCell>
                <TableCell className="text-right tabular-nums">{model.projetos}</TableCell>
                <TableCell className="pr-4">
                  <Badge variant={model.ativo ? 'success' : 'secondary'}>{model.ativo ? 'Ativo' : 'Inativo'}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function RubricsTab() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Rubricas de despesas: categorias de custeio e investimento (Lei de Informática, Lei 8.248/91). As rubricas fixas por lei não são editáveis.
      </p>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="pr-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PMO_RUBRICAS.map((rubric) => (
              <TableRow key={rubric.nome}>
                <TableCell className="pl-4 font-medium">{rubric.nome}</TableCell>
                <TableCell>{rubric.tipo}</TableCell>
                <TableCell className="text-muted-foreground">{rubric.descricao}</TableCell>
                <TableCell className="pr-4">
                  <Badge variant={rubric.ativa ? 'success' : 'secondary'}>{rubric.ativa ? 'Ativa' : 'Inativa'}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function UsersTab() {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button>
          <IconPlus aria-hidden="true" />
          Novo usuário
        </Button>
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead className="pr-4 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PMO_USUARIOS.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="pl-4 font-medium">{user.nome}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.perfil}</Badge>
                </TableCell>
                <TableCell className="pr-4">
                  <span className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label="Editar">
                      <IconPencil aria-hidden="true" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Resetar senha">
                      <IconRefresh aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Excluir"
                      disabled={index === 0}
                      title={index === 0 ? 'Não é possível excluir o próprio usuário logado' : undefined}
                    >
                      <IconTrash aria-hidden="true" />
                    </Button>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function AccessRulesTab() {
  const [rules, setRules] = useState(PMO_REGRAS_DE_ACESSO)
  function toggle(index: number, key: 'gestor' | 'analista') {
    setRules(rules.map((rule, position) => (position === index ? { ...rule, [key]: !rule[key] } : rule)))
  }
  return (
    <div className="space-y-3">
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Permissão</TableHead>
              <TableHead className="text-center">Gestor</TableHead>
              <TableHead className="text-center">Analista</TableHead>
              <TableHead className="pr-4 text-center">Leitor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule, index) => (
              <TableRow key={rule.chave}>
                <TableCell className="pl-4 font-medium">{rule.chave}</TableCell>
                <TableCell className="text-center">
                  <Switch checked={rule.gestor} onCheckedChange={() => toggle(index, 'gestor')} aria-label={`Gestor: ${rule.chave}`} />
                </TableCell>
                <TableCell className="text-center">
                  <Switch checked={rule.analista} onCheckedChange={() => toggle(index, 'analista')} aria-label={`Analista: ${rule.chave}`} />
                </TableCell>
                <TableCell className="pr-4 text-center">
                  <Switch checked={false} disabled aria-label={`Leitor: ${rule.chave}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Alert variant="info">
        <AlertTitle>Como funciona por perfil</AlertTitle>
        <AlertDescription>
          O Administrador sempre passa em todas as regras, independente do que estiver configurado. O Leitor é sempre somente leitura: o seu interruptor não salva nada.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export interface PmoSettingsPageProps {
  role?: PmoRole
  initialTab?: SettingsTabKey
  onOpenInstitute?: (id: number) => void
}

/** Configurações: institutos, modelos de projeto, rubricas, usuários e regras de acesso. Só o Administrador entra. */
export function PmoSettingsPage({ role = 'ADMIN', initialTab = 'institutos', onOpenInstitute }: PmoSettingsPageProps) {
  const [tab, setTab] = useState<SettingsTabKey>(initialTab)
  return (
    <PmoPage
      activeHref="/app/configuracoes"
      breadcrumb={[{ label: 'Configurações' }]}
      title="Configurações"
      subtitle="Institutos, modelos de projeto, rubricas, usuários e regras de acesso do sistema."
      role={role}
    >
      <Tabs value={tab} onValueChange={(value) => setTab(value as SettingsTabKey)}>
        <TabsList variant="line" className="flex-wrap justify-start group-data-[orientation=horizontal]/tabs:h-auto">
          {SETTINGS_TABS.map((item) => (
            <TabsTrigger key={item.key} value={item.key}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="institutos" className="pt-3">
          <InstitutesTab onOpen={onOpenInstitute} />
        </TabsContent>
        <TabsContent value="modelos" className="pt-3">
          <ProjectModelsTab />
        </TabsContent>
        <TabsContent value="rubricas" className="pt-3">
          <RubricsTab />
        </TabsContent>
        <TabsContent value="usuarios" className="pt-3">
          <UsersTab />
        </TabsContent>
        <TabsContent value="regras" className="pt-3">
          <AccessRulesTab />
        </TabsContent>
      </Tabs>
    </PmoPage>
  )
}

/** Instituto: taxa, folha, teto de incorridos e encargos numa página só, com barra de alterações não salvas. */
export function PmoInstitutePage({ role = 'ADMIN', hasUnsavedChanges = false }: { role?: PmoRole; hasUnsavedChanges?: boolean }) {
  const [fee, setFee] = useState(10)
  const [bonusPercent, setBonusPercent] = useState(60)
  const [allowance, setAllowance] = useState(0)
  const [isDirty, setIsDirty] = useState(hasUnsavedChanges)
  const dirty = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setIsDirty(true)
  }
  return (
    <PmoPage
      activeHref="/app/configuracoes"
      breadcrumb={[{ label: 'Configurações', href: '/app/configuracoes' }, { label: 'Institutos' }, { label: 'IDESCO' }]}
      title="IDESCO"
      subtitle="Taxa, folha, teto de incorridos e encargos deste instituto, numa página só."
      role={role}
      actions={
        isDirty && (
          <>
            <Badge variant="warning">Alterações não salvas</Badge>
            <Button variant="outline" onClick={() => setIsDirty(false)}>
              Descartar
            </Button>
            <Button onClick={() => setIsDirty(false)}>Salvar alterações</Button>
          </>
        )
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Geral</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="institute-name">Nome do instituto</Label>
            <Input id="institute-name" value="IDESCO" readOnly />
            <p className="text-xs text-muted-foreground">Nome único; não pode ser alterado depois.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="institute-fee">Taxa administrativa padrão (%) *</Label>
            <PercentInput id="institute-fee" value={fee} onChange={dirty(setFee)} />
            <p className="text-xs text-muted-foreground">Um projeto pode ter a sua própria nos Parâmetros.</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Folha</CardTitle>
          <CardDescription>Bônus natalino e ajuda de custo.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="bonus-percent">Bônus natalino (percentual)</Label>
            <PercentInput id="bonus-percent" value={bonusPercent} onChange={dirty(setBonusPercent)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bonus-month">Mês de pagamento (1 a 12)</Label>
            <Input id="bonus-month" type="number" min={1} max={12} defaultValue={11} onChange={() => setIsDirty(true)} />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="allowance" onCheckedChange={() => setIsDirty(true)} />
            <Label htmlFor="allowance">O instituto dá ajuda de custo por padrão</Label>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="allowance-value">Valor padrão</Label>
            <CurrencyInput id="allowance-value" value={allowance} onChange={dirty(setAllowance)} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Teto de incorridos</CardTitle>
          <CardDescription>Mudar esta regra pede confirmação e fica no histórico.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cap-base">Base do teto</Label>
            <Select defaultValue="projeto" onValueChange={() => setIsDirty(true)}>
              <SelectTrigger className="w-full" id="cap-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="projeto">Projeto inteiro</SelectItem>
                <SelectItem value="mes">Por mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cap-without-contribution">Custo incorrido sem aporte</Label>
            <Select defaultValue="avisar" onValueChange={() => setIsDirty(true)}>
              <SelectTrigger className="w-full" id="cap-without-contribution">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avisar">Só avisar</SelectItem>
                <SelectItem value="bloquear">Bloquear o lançamento</SelectItem>
                <SelectItem value="pt">Medir contra o previsto do PT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </PmoPage>
  )
}
