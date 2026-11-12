import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  ProjectCard,
  ProjectMonths,
  ProjectRubrics,
  ProjectValues,
  type ProjectMonth,
  type RubricGroup,
} from './ProjectCard'

const MONTH_LABELS = ['abr/26', 'mai/26', 'jun/26', 'jul/26', 'ago/26', 'set/26', 'out/26', 'nov/26', 'dez/26', 'jan/27', 'fev/27', 'mar/27']

const MONTHS: ProjectMonth[] = MONTH_LABELS.map((label, index) => {
  const number = index + 1
  const state = number <= 2 ? 'closed' : number === 8 ? 'current' : 'open'
  return { number, label, state, detail: state === 'closed' ? `Fechado em 05/${String(number + 4).padStart(2, '0')}/2026` : undefined }
})

const GROUPS: RubricGroup[] = [
  {
    key: 'surplus',
    label: 'com sobra',
    tone: 'success',
    rubrics: [
      { name: 'RH Direto', value: 68_885.06 },
      { name: 'Custos Incorridos pela Instituição', value: 675.84 },
    ],
    total: 69_560.9,
    totalLabel: 'sobra',
  },
  {
    key: 'overrun',
    label: 'estouradas',
    tone: 'destructive',
    rubrics: [
      { name: 'Viagens e Diárias', value: 80_000 },
      { name: 'Equipamentos e Software', value: 6_235.82 },
    ],
    total: 86_235.82,
    totalLabel: 'estouro',
  },
  {
    key: 'idle',
    label: 'paradas',
    tone: 'neutral',
    rubrics: [{ name: 'Serviços de Terceiros', value: 60_000 }],
    total: 60_000,
    totalLabel: 'previsto',
  },
]

const DESCRIPTION = [
  'Cartão de projeto da lista de Projetos. A moldura (`ProjectCard`) mostra quem é o projeto e as ações; o miolo é composto pelas seções `ProjectMonths`, `ProjectValues` e `ProjectRubrics`, que recebem os dados já prontos.',
  '',
  '**Ordem de leitura (cada parte separada por uma linha):** cabeçalho (título em azul, situação, instituto, gestor, editar e arquivar) → Execução (meses) → Valores (saldo final projetado e saldo em conta em destaque, depois os valores que os explicam) → Rubricas.',
  '',
  '| Elemento | Regra |',
  '| --- | --- |',
  '| Saldo Final Projetado | É o número principal do cartão; a legenda diz o percentual do aporte contratado |',
  '| Quadradinho de mês | Cheio: mês com fechamento feito. Contorno azul: mês atual ainda aberto. Vazio: os demais |',
  '| Valor `null` | Ainda carregando: mostra um espaço cinza do tamanho do valor |',
  '| Valor `undefined` | Indisponível (consulta falhou ou o perfil não acessa): mostra "—" |',
  '| Selos de rubricas | Ficam sempre nos mesmos lugares, mesmo com zero; o tooltip lista as rubricas do grupo |',
  '| Editar e Arquivar | Ícones no canto, com tooltip. O título também abre o projeto. Sem `onArchive`, o ícone de arquivar some |',
].join('\n')

const meta = {
  title: 'Sistemas/PMO/Cartão de projeto',
  component: ProjectCard,
  parameters: { docs: { description: { component: DESCRIPTION } } },
  args: {
    title: 'Projeto Enterprise Space 2026',
    status: 'Execução',
    institute: 'CAIS',
    manager: 'Ana Gestora',
    period: 'jan/25 – dez/25',
    collaborators: 12,
    updatedAt: '10/11/2026',
    onOpen: fn(),
    onArchive: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[26rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectCard>

export default meta
type Story = StoryObj<typeof meta>

function Sections({ loading = false, deficit = true }: { loading?: boolean; deficit?: boolean }) {
  const finalBalance = loading ? null : deficit ? -101_562.94 : 54_320.1
  const contracted = loading ? null : 439_326.58
  return (
    <>
      <ProjectMonths months={MONTHS} loading={loading} />
      <ProjectValues
        cashBalance={loading ? null : 385_282.88}
        projectedFinalBalance={finalBalance}
        contractedContribution={contracted}
        totalRealized={loading ? null : 379_488.32}
        realizedPercent={98.4}
        instituteFee={loading ? null : 42_809.21}
      />
      <ProjectRubrics groups={GROUPS} loading={loading} />
    </>
  )
}

export const Padrao: Story = {
  render: (args) => (
    <ProjectCard {...args}>
      <Sections />
    </ProjectCard>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('2 de 12 meses fechados')).toBeInTheDocument()
    await expect(canvas.getByText('jan/25 – dez/25')).toBeInTheDocument()
    await expect(canvas.getByText('Saldo Final Projetado')).toBeInTheDocument()
    await expect(canvas.getByText(/déficit de 23,12%/)).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Editar projeto' }))
    await expect(args.onOpen).toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Arquivar projeto' }))
    await expect(args.onArchive).toHaveBeenCalled()
  },
}

export const SaldoFinalPositivo: Story = {
  render: (args) => (
    <ProjectCard {...args}>
      <Sections deficit={false} />
    </ProjectCard>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(/sobra de 12,36%/)).toBeInTheDocument()
  },
}

export const Carregando: Story = {
  render: (args) => (
    <ProjectCard {...args}>
      <Sections loading />
    </ProjectCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('M1')).not.toBeInTheDocument()
    await expect(canvas.queryByText(/R\$/)).not.toBeInTheDocument()
    // O espaço cinza do valor é uma div: dentro de um <p> o HTML fica inválido.
    await expect(canvasElement.querySelectorAll('p div, p h1, p ul')).toHaveLength(0)
  },
}

export const ValoresIndisponiveis: Story = {
  render: (args) => (
    <ProjectCard {...args}>
      <ProjectMonths months={MONTHS} unavailable />
      <ProjectValues cashBalance={undefined} projectedFinalBalance={undefined} contractedContribution={undefined} totalRealized={undefined} instituteFee={undefined} />
      <ProjectRubrics groups={[]} unavailable />
    </ProjectCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('indisponível')).toBeInTheDocument()
    await expect(canvas.getByText('Não foi possível carregar as rubricas.')).toBeInTheDocument()
  },
}

export const DetalheDasRubricas: Story = {
  render: (args) => (
    <ProjectCard {...args}>
      <Sections />
    </ProjectCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.hover(canvas.getByLabelText(/^2 estouradas/))
    await expect((await within(document.body).findAllByText('Viagens e Diárias')).length).toBeGreaterThan(0)
  },
}

export const Arquivado: Story = {
  args: { archived: true, onArchive: undefined },
  render: (args) => (
    <ProjectCard {...args}>
      <Sections deficit={false} />
    </ProjectCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Arquivado')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Arquivar projeto' })).not.toBeInTheDocument()
  },
}

export const SemPermissaoParaArquivar: Story = {
  args: { onArchive: undefined, manager: null },
  render: (args) => (
    <ProjectCard {...args}>
      <Sections />
    </ProjectCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: 'Arquivar projeto' })).not.toBeInTheDocument()
    await expect(canvas.getByText('Sem gestor')).toBeInTheDocument()
  },
}
