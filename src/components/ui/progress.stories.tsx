import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './progress'

const meta = {
  title: 'Componentes/Feedback/Barra de progresso',
  component: Progress,
  parameters: {
    docs: {
      description: {
        component: [
          'Barra que mostra uma proporção de 0 a 100.',
          '',
          '- Tem `role="progressbar"` e `aria-valuenow`; passe `aria-label` para dizer o que ela mede.',
          '- Troque a cor da barra com `className="*:data-[slot=progress-indicator]:bg-warning"` (ou `bg-success`, `bg-destructive`).',
          '- A cor sozinha não basta: escreva o percentual ao lado da barra.',
        ].join('\n'),
      },
    },
  },
  args: { value: 45, 'aria-label': 'Uso do orçamento' },
  decorators: [(Story) => <div className="max-w-md"><Story /></div>],
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}
export const Atencao: Story = { args: { value: 82, className: '*:data-[slot=progress-indicator]:bg-warning' } }
export const Estourado: Story = { args: { value: 100, className: '*:data-[slot=progress-indicator]:bg-destructive' } }
export const Concluido: Story = { args: { value: 100, className: '*:data-[slot=progress-indicator]:bg-success' } }
