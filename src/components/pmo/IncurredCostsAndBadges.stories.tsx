import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconInfoCircle } from '@tabler/icons-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { IncurredCostsCap } from './IncurredCostsCap'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { RUBRIC_GROUPS, RubricBadge } from './RubricBadge'

const meta = {
  title: 'Sistemas/CAIS PMO/Componentes/Indicadores e selos',
  component: IncurredCostsCap,
  parameters: {
    docs: {
      description: {
        component: [
          '**Teto de incorridos (RN-EX03):** os custos incorridos não podem passar de **20%** da base de aportes.',
          '',
          '| Percentual | Selo e barra | Mensagem |',
          '| --- | --- | --- |',
          '| até 15% | Verde | Nenhuma |',
          '| acima de 15% e até 20% | Âmbar | "Atenção: ... margem pequena" |',
          '| acima de 20% | Vermelho | "Teto ultrapassado — novos incorridos serão bloqueados" |',
          '| sem base de aportes | Cinza, "—" | Nenhuma |',
          '',
          'A barra fica cheia quando o percentual chega ao teto. O bloqueio acontece no servidor; a tela só informa.',
          'As cores são as de estado do CAIS master (`success`, `warning`, `destructive`).',
          '',
          '**Selos:** `ProjectStatusBadge` mostra o status do projeto (Planejamento ou Execução) e, à parte, "Arquivado". `RubricBadge` colore pelo grupo da rubrica.',
        ].join('\n'),
      },
    },
  },
  decorators: [(Story) => <div className="max-w-xl"><Story /></div>],
  args: { percent: 8.4 },
} satisfies Meta<typeof IncurredCostsCap>

export default meta
type Story = StoryObj<typeof meta>

const HELP = (
  <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" aria-label="Como o teto é calculado" className="text-muted-foreground">
        <IconInfoCircle size={16} aria-hidden="true" />
      </button>
    </TooltipTrigger>
    <TooltipContent>
      (taxa administrativa + fundo de reserva + custos administrativos) ÷ base de aportes não pode passar de 20%.
    </TooltipContent>
  </Tooltip>
)

export const DentroDoLimite: Story = { args: { help: HELP } }
export const Atencao: Story = { args: { percent: 17.2, help: HELP } }
export const Ultrapassado: Story = { args: { percent: 21.6, help: HELP } }
export const SemBase: Story = { args: { percent: null } }

export const SelosDoProjeto: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ProjectStatusBadge status="Planejamento" />
      <ProjectStatusBadge status="Execução" />
      <ProjectStatusBadge status="Execução" archived />
    </div>
  ),
}

export const SelosDeRubrica: Story = {
  render: () => (
    <div className="space-y-3">
      {Object.entries(RUBRIC_GROUPS).map(([group, rubrics]) => (
        <div key={group} className="flex flex-wrap items-center gap-2">
          {rubrics.slice(0, 3).map((rubric) => (
            <RubricBadge key={rubric} rubric={rubric} />
          ))}
        </div>
      ))}
    </div>
  ),
}
