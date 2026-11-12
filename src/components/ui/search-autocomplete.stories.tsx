import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconBriefcase, IconUser } from '@tabler/icons-react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { SearchAutocomplete, type SearchSuggestion } from './search-autocomplete'

const SUGGESTIONS: SearchSuggestion[] = [
  { id: 'p1', group: 'Projetos', label: 'Enterprise Space 2026', description: 'Em execução · CAIS', icon: <IconBriefcase /> },
  { id: 'p2', group: 'Projetos', label: 'Carrier Management', description: 'Em planejamento · IDESCO', icon: <IconBriefcase /> },
  { id: 'c1', group: 'Colaboradores', label: 'Ana Souza', description: 'Analista de dados · CLT', searchText: 'CLT', icon: <IconUser /> },
  { id: 'c2', group: 'Colaboradores', label: 'Érica Barbosa', description: 'Gerente de projeto · RPA', searchText: 'RPA', icon: <IconUser /> },
  { id: 'c3', group: 'Colaboradores', label: 'Bruno Lima', description: 'Bolsista · IEPRO', searchText: 'Bolsista', icon: <IconUser /> },
]

const meta = {
  title: 'Componentes/Formulários/Busca com sugestões',
  component: SearchAutocomplete,
  parameters: {
    docs: {
      description: {
        component: [
          'Campo de busca que sugere resultados enquanto o usuário digita. Use para achar uma pessoa, um projeto ou um documento sem sair da tela. Para escolher um valor de um formulário, use a *Seleção com busca*.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Digita um trecho | A lista filtra na hora, sem diferenciar maiúscula nem acento, e destaca o trecho encontrado |',
          '| `↑` `↓` | Move o destaque pelas sugestões, na ordem em que aparecem |',
          '| `Enter` sobre uma sugestão | Escolhe a sugestão (`onSelect`) |',
          '| `Enter` sem sugestão destacada | Busca pelo texto digitado (`onSearch`) |',
          '| `Esc` | Fecha a lista; com a lista fechada, limpa o campo |',
          '| `/` em qualquer lugar da tela | Leva o foco ao campo (`shortcutKey`) |',
          '| Sugestões vêm do servidor | Passe `filterLocally={false}` e `loading` enquanto espera |',
          '| Nada bate | Mostra a mensagem `emptyMessage` |',
        ].join('\n'),
      },
    },
  },
  args: {
    value: '',
    onValueChange: fn(),
    suggestions: SUGGESTIONS,
    onSelect: fn(),
    'aria-label': 'Buscar no sistema',
  },
} satisfies Meta<typeof SearchAutocomplete>

export default meta
type Story = StoryObj<typeof meta>

function Demo({ suggestions = SUGGESTIONS, loading = false, initialValue = '' }: { suggestions?: SearchSuggestion[]; loading?: boolean; initialValue?: string }) {
  const [value, setValue] = useState(initialValue)
  const [result, setResult] = useState('Nada escolhido ainda')
  return (
    <div className="w-[28rem] space-y-3">
      <SearchAutocomplete
        aria-label="Buscar no sistema"
        placeholder="Buscar projetos e colaboradores…"
        value={value}
        onValueChange={setValue}
        suggestions={suggestions}
        loading={loading}
        onSelect={(suggestion) => {
          setValue(suggestion.label)
          setResult(`Escolhido: ${suggestion.label}`)
        }}
        onSearch={(text) => setResult(`Busca por: ${text}`)}
      />
      <p className="text-sm text-muted-foreground">{result}</p>
    </div>
  )
}

export const Padrao: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByRole('combobox', { name: 'Buscar no sistema' }), 'ana s')
    await expect(await canvas.findAllByRole('option')).toHaveLength(1)
    await expect(canvas.getByRole('option', { name: /Ana Souza/ })).toBeInTheDocument()
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect(await canvas.findByText('Escolhido: Ana Souza')).toBeInTheDocument()
  },
}

export const BuscaPorGrupoSemAcento: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByRole('combobox'), 'erica')
    await expect(await canvas.findByRole('option', { name: /Érica Barbosa/ })).toBeInTheDocument()
    await expect(canvas.getByRole('group', { name: 'Colaboradores' })).toBeInTheDocument()
  },
}

export const BuscaPeloTextoExtra: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByRole('combobox'), 'bolsista')
    await expect(await canvas.findAllByRole('option')).toHaveLength(1)
  },
}

export const EnterSemSugestaoBuscaOTexto: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByRole('combobox'), 'zzz{Enter}')
    await expect(await canvas.findByText('Busca por: zzz')).toBeInTheDocument()
  },
}

export const LimparComEsc: Story = {
  render: () => <Demo initialValue="carrier" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = await canvas.findByRole('combobox')
    await userEvent.click(input)
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(input).toHaveValue('')
  },
}

export const BotaoLimpar: Story = {
  render: () => <Demo initialValue="ana" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Limpar busca' }))
    await expect(canvas.getByRole('combobox')).toHaveValue('')
  },
}

export const SemResultado: Story = {
  render: () => <Demo initialValue="xyz" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('combobox'))
    await expect(await canvas.findByText('Nada encontrado')).toBeInTheDocument()
  },
}

export const Carregando: Story = {
  render: () => <Demo suggestions={[]} loading initialValue="ana" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('combobox'))
    await expect(await canvas.findByText('Buscando…')).toBeInTheDocument()
  },
}
