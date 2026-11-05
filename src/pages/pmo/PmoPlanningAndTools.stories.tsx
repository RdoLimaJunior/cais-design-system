import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { PmoAuditPage } from './PmoAuditPage'
import { PmoContributionsPage } from './PmoContributionsPage'
import { PmoJanusPage } from './PmoJanusPage'
import {
  PmoHrMatrixPage,
  PmoPayrollHubPage,
  PmoProfilePage,
  PmoRpaSimulatorPage,
  PmoWorkPlanTimelinePage,
} from './PmoOtherPages'
import { PmoWorkPlanPage } from './PmoWorkPlanPage'

const meta = {
  title: 'Sistemas/CAIS PMO/Telas/Planejamento e ferramentas',
  component: PmoRpaSimulatorPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Planejamento financeiro, folha de RH, aportes, simulador e perfil.',
          '',
          '| Tela | O que mostra |',
          '| --- | --- |',
          '| **Simulador RPA** | Calcula o bruto a partir do líquido (ou o inverso), com as retenções e o custo total. No Storybook o cálculo é de exemplo; o oficial é do servidor |',
          '| **Plano de Trabalho** | Previsões de custo por rubrica e mês de um projeto, e a timeline |',
          '| **Folha RH** | Projetos com o saldo disponível de cada um |',
          '| **RH Matrix** | Escolha de um projeto para ver o Espelho de RH |',
          '| **Aportes** | Entradas de caixa com a taxa do instituto retirada de cada uma |',
          '| **Meu perfil** | Dados da conta e troca de senha |',
          '| **Auditoria** | Indicadores e a trilha das movimentações (no PMO atual a tela ainda está em desenvolvimento) |',
          '| **Janus IA** | Conversa com o consultor de compliance e planejamento, com perguntas sugeridas |',
          '',
          'Plano de Trabalho, Folha RH, RH Matrix e Aportes estão **fora do menu** no PMO atual e passam a ter item no menu do novo PMO. Auditoria e Janus IA estão atrás de feature flag no PMO atual e também entram no menu.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof PmoRpaSimulatorPage>

export default meta
type Story = StoryObj<typeof meta>

export const SimuladorRpa: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByRole('button', { name: 'Simular' })).toBeDisabled()
    await userEvent.type(await body.findByLabelText('Valor líquido desejado'), '100000')
    await userEvent.click(body.getByRole('button', { name: 'Simular' }))
    await expect(await body.findByText('Custo total do projeto')).toBeVisible()
  },
}
export const PlanoDeTrabalho: Story = { render: () => <PmoWorkPlanPage /> }
export const PlanoDeTrabalhoSemProjeto: Story = { render: () => <PmoWorkPlanPage hasProject={false} /> }
export const PlanoDeTrabalhoTimeline: Story = { render: () => <PmoWorkPlanTimelinePage /> }
export const FolhaRh: Story = { render: () => <PmoPayrollHubPage /> }
export const RhMatrix: Story = { render: () => <PmoHrMatrixPage /> }
export const Aportes: Story = { render: () => <PmoContributionsPage /> }
export const MeuPerfil: Story = { render: () => <PmoProfilePage /> }
export const Auditoria: Story = { render: () => <PmoAuditPage /> }
export const JanusIa: Story = {
  render: () => <PmoJanusPage />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(await body.findByRole('button', { name: 'Qual é o teto máximo para Taxa Administrativa?' }))
    await expect(await body.findByText(/resposta de exemplo do Storybook/)).toBeVisible()
  },
}
