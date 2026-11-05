import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconInfoCircle } from '@tabler/icons-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

const meta = {
  title: 'Componentes/Feedback/Dica (tooltip)',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component: [
          'Texto curto que explica um ícone ou um termo. Aparece no foco do teclado e ao passar o mouse.',
          '',
          '- Envolva a tela (ou o trecho) em `TooltipProvider` uma vez.',
          '- Nunca coloque informação essencial só na dica: no celular não há "passar o mouse".',
        ].join('\n'),
      },
    },
  },
  decorators: [(Story) => <TooltipProvider><div className="p-16"><Story /></div></TooltipProvider>],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <button type="button" aria-label="O que é o teto de 20%?" className="text-muted-foreground-2">
          <IconInfoCircle size={18} aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent>Custos incorridos não podem passar de 20% do projeto.</TooltipContent>
    </Tooltip>
  ),
}
