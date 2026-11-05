import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

const meta = {
  title: 'Componentes/Dados/Tabela (primitivos)',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: [
          'Primitivos de tabela (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`) para tabelas financeiras e de cadastro.',
          'Para listas simples com ordenação e seleção, prefira o `DataTable`.',
          '',
          '| Propriedade | O que faz |',
          '| --- | --- |',
          '| `TableHeader sticky` | O cabeçalho gruda no topo ao rolar. Exige altura limitada em `containerClassName` |',
          '| `Table containerClassName` | Classes do contêiner que rola (altura máxima, por exemplo `max-h-72`) |',
          '| Linhas | Zebradas e com destaque ao passar o mouse |',
          '| Valores | Alinhe à direita e use `tabular-nums` para os dígitos alinharem |',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const RUBRICAS = [
  { nome: 'Recursos humanos', previsto: 'R$ 480.000,00', executado: 'R$ 212.340,00', estado: 'No prazo' },
  { nome: 'Serviços de terceiros', previsto: 'R$ 120.000,00', executado: 'R$ 111.900,00', estado: 'Perto do limite' },
  { nome: 'Equipamentos', previsto: 'R$ 90.000,00', executado: 'R$ 0,00', estado: 'Sem execução' },
  { nome: 'Material de consumo', previsto: 'R$ 30.000,00', executado: 'R$ 8.120,00', estado: 'No prazo' },
]

export const Rubricas: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rubrica</TableHead>
          <TableHead className="text-right">Previsto</TableHead>
          <TableHead className="text-right">Executado</TableHead>
          <TableHead>Situação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {RUBRICAS.map((rubrica) => (
          <TableRow key={rubrica.nome}>
            <TableCell className="font-medium">{rubrica.nome}</TableCell>
            <TableCell className="text-right tabular-nums">{rubrica.previsto}</TableCell>
            <TableCell className="text-right tabular-nums">{rubrica.executado}</TableCell>
            <TableCell>
              <Badge variant={rubrica.estado === 'Perto do limite' ? 'warning' : 'info'}>{rubrica.estado}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const CabecalhoFixo: Story = {
  render: () => (
    <Table containerClassName="max-h-48 rounded-lg border border-border">
      <TableHeader sticky>
        <TableRow>
          <TableHead>Mês</TableHead>
          <TableHead className="text-right">Previsto</TableHead>
          <TableHead className="text-right">Executado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 12 }, (_, indice) => (
          <TableRow key={indice}>
            <TableCell>{`${String(indice + 1).padStart(2, '0')}/2026`}</TableCell>
            <TableCell className="text-right tabular-nums">R$ 40.000,00</TableCell>
            <TableCell className="text-right tabular-nums">R$ {(35000 + indice * 900).toLocaleString('pt-BR')},00</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
