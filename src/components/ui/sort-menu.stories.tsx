import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { SortMenu, type SortMenuOption } from './sort-menu'

type ProjectSort = 'created' | 'name-asc' | 'name-desc' | 'critical'

const OPTIONS: SortMenuOption<ProjectSort>[] = [
  { value: 'created', label: 'Criação mais recente' },
  { value: 'name-asc', label: 'Nome (A a Z)' },
  { value: 'name-desc', label: 'Nome (Z a A)' },
  { value: 'critical', label: 'Do mais crítico ao mais saudável' },
]

const meta = {
  title: 'Componentes/Navegação/Ordenar por',
  component: SortMenu,
  parameters: {
    docs: {
      description: {
        component: [
          'Botão que mostra o critério de ordenação atual e abre uma lista para trocá-lo. Use no topo de listas e tabelas.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Clica no botão | O menu abre com o critério atual marcado |',
          '| Escolhe uma opção | O menu fecha e `onValueChange` recebe o valor escolhido |',
          '| Usa o teclado | Setas movem, Enter escolhe e Esc fecha (menu suspenso do Radix) |',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof SortMenu<ProjectSort>>

export default meta
type Story = StoryObj<typeof meta>

function Example() {
  const [value, setValue] = useState<ProjectSort>('created')
  return (
    <div className="flex justify-end p-6">
      <SortMenu options={OPTIONS} value={value} onValueChange={setValue} />
    </div>
  )
}

export const Padrao: Story = {
  args: { options: OPTIONS, value: 'created', onValueChange: () => {} },
  render: () => <Example />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Ordenar por: Criação mais recente/ }))
    await userEvent.click(await within(document.body).findByRole('menuitemradio', { name: 'Nome (A a Z)' }))
    await waitFor(() => expect(canvas.getByRole('button', { name: /Ordenar por: Nome \(A a Z\)/ })).toBeInTheDocument())
  },
}
