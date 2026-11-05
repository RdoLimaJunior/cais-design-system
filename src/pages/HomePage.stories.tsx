import type { Meta, StoryObj } from '@storybook/react-vite'
import { HomePage } from './HomePage'

const meta = {
  title: 'Sistemas/FAROL/Páginas/Início/Home',
  component: HomePage,
  parameters: { layout: 'fullscreen' },
  args: {
    userName: 'Maria Souza Andrade',
    pendingSummary: 'Você tem 1 pendência(s): Relatório de Novembro 2026.',
    alertSectionTitle: 'Relatório do mês (1 alertas)',
    alertSectionDescription: 'O envio do relatório é obrigatório e afeta o pagamento da sua bolsa.',
    pendingReports: [
      {
        title: 'Relatório de Novembro 2026',
        projectName:
          'AI Advanced - Projeto P&D de Agente Autônomo de IA para Análise Avançada de Simulações Digitais do Processo de Fabricação de Semicondutores na Adata Integration Brazil S/A',
        periodDescription: 'O período para envio está aberto de 02/11 até 20/11/2026.',
        status: 'Não iniciado',
        actionLabel: 'Iniciar relatório',
        actionHref: '/relatorio-mensal/678',
      },
    ],
  },
} satisfies Meta<typeof HomePage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
