import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

const meta = {
  title: 'Componentes/Formulários/Seleção',
  component: Select,
  parameters: {
    docs: {
      description: {
        component: [
          'Lista suspensa para escolher uma opção entre várias. Usa o `Select` do Radix: funciona com teclado e leitor de tela.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| O usuário clica ou usa `Enter` | A lista abre, com a largura do campo |',
          '| Escolhe uma opção | A lista fecha e o valor aparece no campo |',
          '| Há poucas opções (2 a 4) | Prefira `RadioGroup`, que mostra tudo de uma vez |',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

function InstitutoSelect() {
  const [valor, setValor] = useState('')
  return (
    <div className="w-72">
      <label htmlFor="instituto" className="mb-1 block text-sm font-medium">
        Instituto
      </label>
      <Select value={valor} onValueChange={setValor}>
        <SelectTrigger id="instituto">
          <SelectValue placeholder="Escolha um instituto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="idesco">IDESCO</SelectItem>
          <SelectItem value="iepro">IEPRO</SelectItem>
          <SelectItem value="cais">CAIS</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export const Padrao: Story = {
  render: () => <InstitutoSelect />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(await canvas.findByRole('combobox', { name: 'Instituto' }))
    await userEvent.click(await body.findByRole('option', { name: 'IEPRO' }))
    // Enquanto a lista fecha, o restante da página fica oculto para leitores de tela.
    await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Instituto' })).toHaveTextContent('IEPRO'))
  },
}
