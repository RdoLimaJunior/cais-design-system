import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { RowActionButton } from './RowActionButton'

const meta = {
  title: 'Componentes/Dados/Ação de linha',
  component: RowActionButton,
  parameters: {
    docs: {
      description: {
        component: [
          'Botão de 96px dentro de uma linha de tabela ("Enviar", "Baixar"). Vira **link** quando recebe `href` e **botão** quando recebe `onClick`.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Recebe `href` | Renderiza `<a>` e navega ao clicar (ex.: enviar documento) |',
          '| Recebe `onClick` | Renderiza `<button>` e dispara a ação (ex.: baixar arquivo) |',
          '| Passa o mouse | Fundo cinza muito claro (`zinc-50`) |',
          '',
          '`ariaLabel` deve dizer o que a ação faz ("Enviar CPF"), já que o texto visível é curto.',
        ].join('\n'),
      },
    },
  },
  args: { label: 'Baixar', ariaLabel: 'Baixar CPF', onClick: fn() },
} satisfies Meta<typeof RowActionButton>

export default meta
type Story = StoryObj<typeof meta>

export const Botao: Story = {}
export const Link: Story = { args: { label: 'Enviar', ariaLabel: 'Enviar histórico escolar', href: '/documentos/academic-transcript', onClick: undefined } }

export const DisparaAAcao: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(await within(canvasElement).findByRole('button', { name: 'Baixar CPF' }))
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}
