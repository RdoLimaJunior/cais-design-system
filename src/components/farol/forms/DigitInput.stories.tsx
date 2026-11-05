import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { DigitInput } from './DigitInput'

function ControlledDigitInput(props: { name: string; groups: number[]; initialValue: string; inputMode?: 'numeric' | 'tel'; isDisabled?: boolean; hasError?: boolean }) {
  const { initialValue, ...rest } = props
  const [value, setValue] = useState(initialValue)
  return (
    <div>
      <DigitInput {...rest} value={value} onChange={setValue} />
      <p className="mt-2 text-xs text-zinc-500">Valor: {value || '(vazio)'}</p>
    </div>
  )
}

const meta = {
  title: 'Componentes/Formulários/Campo de dígitos',
  component: ControlledDigitInput,
  parameters: {
    docs: {
      description: {
        component: [
          'Uma caixa por dígito, usada em **CPF** (11), **telefone** (2 + 9, com hífen), **CEP** (8), **número do endereço** (6) e **código do banco** (3, somente leitura).',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Digita um dígito | O foco avança para a próxima caixa; letras são ignoradas |',
          '| Aperta Backspace numa caixa vazia | Apaga o dígito anterior e o foco volta |',
          '| Usa as setas esquerda e direita | O foco anda entre as caixas |',
          '| Cola um número | Os dígitos preenchem as caixas a partir da atual |',
          '| Está desabilitado | Fundo cinza e opacidade 70% (código do banco) |',
          '',
          'Cada caixa tem `aria-label` no formato "cpf dígito 3", para leitores de tela.',
        ].join('\n'),
      },
    },
  },
  args: { name: 'cpf', groups: [11], initialValue: '12345678909' },
} satisfies Meta<typeof ControlledDigitInput>

export default meta
type Story = StoryObj<typeof meta>

export const Cpf: Story = {}
export const Telefone: Story = { args: { name: 'phone', groups: [2, 9], inputMode: 'tel', initialValue: '85999990000' } }
export const Cep: Story = { args: { name: 'zip-code', groups: [8], initialValue: '60000000' } }
export const CodigoDoBancoSomenteLeitura: Story = { args: { name: 'bank-code', groups: [3], initialValue: '001', isDisabled: true } }
export const ComErro: Story = { args: { hasError: true, initialValue: '123' } }
export const Vazio: Story = { args: { initialValue: '' } }

export const AvancaEApaga: Story = {
  args: { initialValue: '' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByLabelText('cpf dígito 1'))
    await userEvent.keyboard('123')
    await expect(canvas.getByLabelText('cpf dígito 4')).toHaveFocus()
    await userEvent.keyboard('{Backspace}')
    await expect(canvas.getByLabelText('cpf dígito 3')).toHaveValue('')
  },
}

export const IgnoraLetras: Story = {
  args: { initialValue: '' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByLabelText('cpf dígito 1'), 'a')
    await expect(canvas.getByLabelText('cpf dígito 1')).toHaveValue('')
  },
}
