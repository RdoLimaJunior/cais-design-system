import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { CollapsibleAlertSection } from './CollapsibleAlertSection'

const meta = {
  title: 'Componentes/Dados/Painel de alerta recolhível',
  component: CollapsibleAlertSection,
  decorators: [(Story) => <div className="max-w-[900px] overflow-hidden rounded bg-white shadow-sm"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component: [
          'Faixa que abre e fecha um grupo de alertas (Home: "Relatório do mês (1 alertas)").',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Clica na faixa | O painel abre ou fecha; `aria-expanded` acompanha |',
          '| O painel está aberto | A seta aponta para cima |',
          '| O painel está fechado | A seta gira 180° e o conteúdo some |',
          '| Abre | Aparece a descrição e, abaixo, os cards (`children`) sobre fundo `#f9fafb` |',
        ].join('\n'),
      },
    },
  },
  args: {
    title: 'Relatório do mês (1 alertas)',
    description: 'O envio do relatório é obrigatório e afeta o pagamento da sua bolsa.',
    children: <div className="rounded border border-zinc-200 bg-white p-4 text-sm">Conteúdo do alerta (ex.: um card de relatório)</div>,
  },
} satisfies Meta<typeof CollapsibleAlertSection>

export default meta
type Story = StoryObj<typeof meta>

export const Aberto: Story = {}
export const Fechado: Story = { args: { isInitiallyOpen: false } }

export const AbreEFecha: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByRole('button', { name: /Relatório do mês/ })
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText(/Conteúdo do alerta/)).toBeNull()
  },
}
