import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Combobox, type ComboboxOption } from './combobox'

const PEOPLE: ComboboxOption[] = [
  { value: '1', label: 'Ana Souza (CLT)', searchText: 'CLT' },
  { value: '2', label: 'Bruno Lima (Bolsista)', searchText: 'Bolsista', description: 'já alocado(a) até dez/2026' },
  { value: '3', label: 'Érica Barbosa (RPA)', searchText: 'RPA' },
  { value: '4', label: 'Joana Pereira (CLT)', searchText: 'CLT', disabled: true },
]

const meta = {
  title: 'Componentes/Formulários/Seleção com busca',
  component: Combobox,
  parameters: {
    docs: {
      description: {
        component: [
          'Lista suspensa com campo de busca, para listas longas (colaboradores, projetos). Usa só teclado e leitor de tela: o botão é um `combobox` e a lista, um `listbox`.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Clica no campo | A lista abre e o foco vai para a busca |',
          '| Digita um trecho | A lista filtra na hora, sem diferenciar maiúscula nem acento; o texto extra (`searchText`) também entra na busca |',
          '| `↑` `↓` e `Enter` | Move o destaque e escolhe a opção destacada |',
          '| `Esc` ou clica fora | Fecha sem mudar o valor; `Esc` devolve o foco ao campo |',
          '| Nenhuma opção bate | Mostra a mensagem `emptyMessage` |',
          '| A lista tem poucas opções (até 7) | Prefira o `Select` simples |',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

function PersonCombobox() {
  const [value, setValue] = useState<string | null>(null)
  return (
    <div className="w-80">
      <label htmlFor="person" className="mb-1 block text-sm font-medium">
        Colaborador
      </label>
      <Combobox
        id="person"
        options={PEOPLE}
        value={value}
        onValueChange={setValue}
        placeholder="Buscar colaborador pelo nome…"
        emptyMessage="Nenhum colaborador encontrado"
      />
    </div>
  )
}

export const Padrao: Story = {
  args: { options: PEOPLE, value: null, onValueChange: () => {} },
  render: () => <PersonCombobox />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('combobox', { name: 'Colaborador' }))
    await userEvent.type(await canvas.findByRole('searchbox'), 'erica')
    await expect(canvas.queryByRole('option', { name: /Ana Souza/ })).not.toBeInTheDocument()
    await userEvent.click(await canvas.findByRole('option', { name: /Érica Barbosa/ }))
    await expect(canvas.getByRole('combobox', { name: 'Colaborador' })).toHaveTextContent('Érica Barbosa (RPA)')
  },
}

export const BuscaPeloTextoExtra: Story = {
  args: { options: PEOPLE, value: null, onValueChange: () => {} },
  render: () => <PersonCombobox />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('combobox', { name: 'Colaborador' }))
    await userEvent.type(await canvas.findByRole('searchbox'), 'bolsista')
    await expect(await canvas.findAllByRole('option')).toHaveLength(1)
  },
}

export const SemResultado: Story = {
  args: { options: PEOPLE, value: null, onValueChange: () => {} },
  render: () => <PersonCombobox />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('combobox', { name: 'Colaborador' }))
    await userEvent.type(await canvas.findByRole('searchbox'), 'zzz')
    await expect(await canvas.findByText('Nenhum colaborador encontrado')).toBeInTheDocument()
  },
}

export const Teclado: Story = {
  args: { options: PEOPLE, value: null, onValueChange: () => {} },
  render: () => <PersonCombobox />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('combobox', { name: 'Colaborador' }))
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect(canvas.getByRole('combobox', { name: 'Colaborador' })).toHaveTextContent('Bruno Lima (Bolsista)')
    await userEvent.click(canvas.getByRole('combobox', { name: 'Colaborador' }))
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
    await expect(canvas.getByRole('combobox', { name: 'Colaborador' })).toHaveFocus()
  },
}

export const Carregando: Story = {
  args: { options: [], value: null, onValueChange: () => {}, loading: true },
}

export const TabFechaALista: Story = {
  args: { options: PEOPLE, value: null, onValueChange: () => {} },
  render: () => <PersonCombobox />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('combobox', { name: 'Colaborador' }))
    await userEvent.type(await canvas.findByRole('searchbox'), 'an{Tab}')
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
  },
}

export const SetasPulamOpcaoDesabilitada: Story = {
  args: { options: PEOPLE, value: null, onValueChange: () => {} },
  render: () => <PersonCombobox />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('combobox', { name: 'Colaborador' }))
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{Enter}')
    await expect(canvas.getByRole('combobox', { name: 'Colaborador' })).toHaveTextContent('Érica Barbosa (RPA)')
  },
}

export const AbreNaOpcaoSelecionada: Story = {
  args: { options: PEOPLE, value: '3', onValueChange: () => {} },
  render: () => (
    <div className="w-80">
      <Combobox id="person" aria-label="Colaborador" options={PEOPLE} value="3" onValueChange={() => {}} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('combobox', { name: 'Colaborador' }))
    await expect(await canvas.findByRole('option', { name: /Érica Barbosa/ })).toHaveClass('bg-accent')
  },
}

