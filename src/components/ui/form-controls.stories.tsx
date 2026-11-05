import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Switch } from './switch'
import { Textarea } from './textarea'

const meta = {
  title: 'Componentes/Formulários/Interruptor, opções e texto longo',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: [
          'Três controles de formulário:',
          '',
          '| Componente | Quando usar |',
          '| --- | --- |',
          '| `Switch` | Liga ou desliga algo com efeito imediato (`role="switch"`) |',
          '| `RadioGroup` | Escolher uma entre poucas opções, todas visíveis |',
          '| `Textarea` | Texto de várias linhas (justificativa, observação) |',
          '',
          'Todo controle precisa de um nome: use `<label htmlFor>` ou `aria-label`.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

function SwitchComRotulo() {
  const [ativo, setAtivo] = useState(false)
  return (
    <div className="flex items-center gap-3">
      <Switch id="arquivado" checked={ativo} onCheckedChange={setAtivo} />
      <label htmlFor="arquivado" className="text-sm">
        Mostrar projetos arquivados
      </label>
    </div>
  )
}

export const Interruptor: Story = {
  render: () => <SwitchComRotulo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const interruptor = await canvas.findByRole('switch')
    await expect(interruptor).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(interruptor)
    await expect(interruptor).toHaveAttribute('aria-checked', 'true')
  },
}

function GrupoDeOpcoes() {
  const [valor, setValor] = useState('mensal')
  return (
    <RadioGroup value={valor} onValueChange={setValor}>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="mensal" value="mensal" />
        <label htmlFor="mensal" className="text-sm">
          Execução mensal
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="projeto" value="projeto" />
        <label htmlFor="projeto" className="text-sm">
          Execução do projeto
        </label>
      </div>
    </RadioGroup>
  )
}

export const Opcoes: Story = { render: () => <GrupoDeOpcoes /> }

export const TextoLongo: Story = {
  render: () => (
    <div className="max-w-md">
      <label htmlFor="justificativa" className="mb-1 block text-sm font-medium">
        Justificativa
      </label>
      <Textarea id="justificativa" rows={4} placeholder="Explique o motivo do remanejamento" />
    </div>
  ),
}
