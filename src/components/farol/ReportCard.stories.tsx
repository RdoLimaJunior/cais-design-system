import type { Meta, StoryObj } from '@storybook/react-vite'
import { MOCK_PROJECT_NAME } from '../../mocks/scholarship'
import { ReportCard } from './ReportCard'

const meta = {
  title: 'Componentes/Dados/Card de relatório',
  component: ReportCard,
  parameters: {
    docs: {
      description: {
        component: [
          'Card de uma pendência na Home: competência, projeto, período de envio, selo de status e um botão de ação de largura total.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| O nome do projeto é longo | O texto quebra em várias linhas dentro do card |',
          '| Clica no botão de ação | Navega para `actionHref` (ex.: o relatório do mês) |',
          '| Passa o mouse no botão | Fundo azul bem claro (`#e8f5ff`) e texto mais escuro |',
        ].join('\n'),
      },
    },
  },
  decorators: [(Story) => <div className="max-w-[1000px] bg-[#f9fafb] p-4"><Story /></div>],
  args: {
    title: 'Relatório de Novembro 2026',
    projectName: MOCK_PROJECT_NAME,
    periodDescription: 'O período para envio está aberto de 02/11 até 20/11/2026.',
    status: 'Não iniciado',
    actionLabel: 'Iniciar relatório',
    actionHref: '/relatorio-mensal/678',
  },
} satisfies Meta<typeof ReportCard>

export default meta
type Story = StoryObj<typeof meta>

export const NaoIniciado: Story = {}
export const ProjetoComNomeCurto: Story = { args: { projectName: 'Projeto Tomorrow' } }
