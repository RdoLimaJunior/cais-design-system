import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusPill } from './StatusPill'
import { StatusTag } from './StatusTag'

const meta = {
  title: 'Componentes/Dados/Selos de status',
  component: StatusTag,
  parameters: {
    docs: {
      description: {
        component: [
          'Dois selos, ambos em contorno e arredondados:',
          '',
          '- **`StatusTag`**: dentro de tabelas (24px de altura, texto de 12px). Tem seis tons, todos do CAIS master.',
          '- **`StatusPill`**: nos cards da Home (texto de 10px, contorno azul).',
          '',
          '| `tone` | Cor | Usos |',
          '| --- | --- | --- |',
          '| `info` | Azul CAIS | Não iniciado |',
          '| `success` | Verde (borda 600) | Concluído |',
          '| `received` | Verde (borda 500, mais clara) | Recebido (documentos) |',
          '| `danger` | Vermelho | Pendente |',
          '| `neutral` | Cinza | Opcional |',
          '| `warning` | Âmbar | Precisa de ajuste ou atenção |',
          '',
          'A cor nunca é o único sinal: o texto do selo diz o estado.',
        ].join('\n'),
      },
    },
  },
  args: { tone: 'info', children: 'Não iniciado' },
} satisfies Meta<typeof StatusTag>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {}
export const Concluido: Story = { args: { tone: 'success', children: 'Concluído' } }
export const Recebido: Story = { args: { tone: 'received', children: 'Recebido' } }
export const Pendente: Story = { args: { tone: 'danger', children: 'Pendente' } }
export const Opcional: Story = { args: { tone: 'neutral', children: 'Opcional' } }

export const Atencao: Story = { args: { tone: 'warning', children: 'Ajustar solicitação' } }

export const TodosOsSelos: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <StatusTag tone="info">Não iniciado</StatusTag>
      <StatusTag tone="success">Concluído</StatusTag>
      <StatusTag tone="received">Recebido</StatusTag>
      <StatusTag tone="danger">Pendente</StatusTag>
      <StatusTag tone="neutral">Opcional</StatusTag>
      <StatusTag tone="warning">Ajustar solicitação</StatusTag>
      <StatusPill>Não iniciado</StatusPill>
    </div>
  ),
}
