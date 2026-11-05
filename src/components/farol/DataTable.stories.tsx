import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { DataTable, type SortDirection } from './DataTable'
import { RowActionButton } from './RowActionButton'
import { StatusTag } from './StatusTag'

interface ExampleRow {
  id: string
  name: string
  status: 'received' | 'pending'
}

const ROWS: ExampleRow[] = [
  { id: 'cpf', name: 'CPF', status: 'received' },
  { id: 'identity', name: 'Documento de identificação', status: 'received' },
  { id: 'transcript', name: 'Histórico escolar', status: 'pending' },
]

function TableExample({ isSelectable, isSortable }: { isSelectable: boolean; isSortable: boolean }) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [direction, setDirection] = useState<SortDirection>('ascending')
  const rows = isSortable && direction === 'descending' ? [...ROWS].reverse() : ROWS

  return (
    <DataTable
      rows={rows}
      getRowKey={(row) => row.id}
      columns={[
        { id: 'name', header: 'Documento', isSortable, render: (row) => row.name },
        {
          id: 'status',
          header: 'Status',
          render: (row) => (
            <StatusTag tone={row.status === 'received' ? 'received' : 'danger'}>
              {row.status === 'received' ? 'Recebido' : 'Pendente'}
            </StatusTag>
          ),
        },
        {
          id: 'action',
          headerClassName: 'w-28',
          render: (row) => <RowActionButton label={row.status === 'received' ? 'Baixar' : 'Enviar'} ariaLabel={`Ação ${row.name}`} />,
        },
      ]}
      selection={
        isSelectable
          ? {
              selectAllLabel: 'Selecionar todos',
              getRowLabel: (key) => `Selecionar ${ROWS.find((row) => row.id === key)?.name}`,
              isRowSelectable: (key) => ROWS.find((row) => row.id === key)?.status === 'received',
              selectedKeys,
              onSelectionChange: setSelectedKeys,
            }
          : undefined
      }
      sort={isSortable ? { columnId: 'name', direction, onSortChange: () => setDirection((current) => (current === 'ascending' ? 'descending' : 'ascending')) } : undefined}
    />
  )
}

const meta = {
  title: 'Componentes/Dados/Tabela',
  component: TableExample,
  parameters: {
    docs: {
      description: {
        component: [
          'Tabela genérica do FAROL: cabeçalho azul CAIS, linhas de 44px com divisória, bordas arredondadas. As colunas são descritas por dados (`columns`), e a seleção e a ordenação são opcionais.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Clica no cabeçalho de uma coluna ordenável | A lista ordena (ascendente, depois descendente) e o cabeçalho recebe `aria-sort` |',
          '| Marca a caixa de uma linha selecionável | A linha entra em `selectedKeys`; ações em lote ficam habilitadas |',
          '| Marca a caixa do cabeçalho | Seleciona (ou limpa) **só as linhas selecionáveis** |',
          '| A linha não é selecionável (ex.: documento pendente) | A caixa fica desabilitada |',
          '| A tabela é mais larga que a área | A tela rola na horizontal (`minWidthClassName`) |',
        ].join('\n'),
      },
    },
  },
  args: { isSelectable: false, isSortable: false },
} satisfies Meta<typeof TableExample>

export default meta
type Story = StoryObj<typeof meta>

export const Simples: Story = {}
export const ComSelecao: Story = { args: { isSelectable: true } }
export const ComOrdenacao: Story = { args: { isSortable: true } }

export const SelecionaTodosOsRecebidos: Story = {
  args: { isSelectable: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByLabelText('Selecionar todos'))
    await expect(canvas.getByLabelText('Selecionar CPF')).toBeChecked()
    await expect(canvas.getByLabelText('Selecionar Histórico escolar')).toBeDisabled()
  },
}

export const OrdenaPeloCabecalho: Story = {
  args: { isSortable: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const header = (await canvas.findByRole('button', { name: 'Documento' })).closest('th') as HTMLElement
    await expect(header).toHaveAttribute('aria-sort', 'ascending')
    await userEvent.click(canvas.getByRole('button', { name: 'Documento' }))
    await expect(header).toHaveAttribute('aria-sort', 'descending')
  },
}
