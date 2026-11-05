import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { MOCK_PROJECT_NAME, MOCK_USER } from '../mocks/scholarship'
import { MonthlyReportPage } from './MonthlyReportPage'

const meta = {
  title: 'Sistemas/FAROL/Páginas/Relatórios/Relatório mensal',
  component: MonthlyReportPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Relatório do mês em três passos: **descrever as atividades**, **aguardar a revisão do gestor** e **assinar**.',
          '',
          '| `status` | Passo ativo | Visto no site? |',
          '| --- | --- | --- |',
          '| `draft` | 1 (formulário de atividades) | ✅ |',
          '| `under-review` | 2 (aguardando o gestor) | ⚠️ **Não capturado**; desenho inferido, conferir com o produto |',
          '| `completed` | 3 (trâmite concluído, com download do relatório assinado) | ✅ |',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Clica em **Adicionar atividade** | Surge um novo campo "Atividade N" |',
          '| Clica na lixeira de uma atividade | O campo é removido e a numeração se ajusta |',
          '| Clica em **Avalie minhas atividades** com menos de 3 preenchidas | Mostra o aviso (texto provisório) e não avança |',
          '| Preenche 3 ou mais e avalia | Dispara `onEvaluate` com as atividades preenchidas |',
          '| Está concluído e clica em **Baixar relatório assinado** | Dispara `onDownloadSigned` |',
          '',
          'O menu lateral **não marca nenhum item** como ativo nesta tela (igual ao site) e o fundo é `#E5E7EB`.',
        ].join('\n'),
      },
    },
  },
  args: {
    userName: MOCK_USER.fullName,
    monthName: 'novembro',
    projectName: MOCK_PROJECT_NAME,
    submissionPeriod: '02/11 até 20/11/2026',
    status: 'draft',
    onEvaluate: fn(),
    onDownloadSigned: fn(),
  },
} satisfies Meta<typeof MonthlyReportPage>

export default meta
type Story = StoryObj<typeof meta>

export const NaoIniciado: Story = {}
export const EmRevisaoPeloGestor: Story = { args: { status: 'under-review' } }
export const Concluido: Story = { args: { status: 'completed', monthName: 'outubro', submissionPeriod: '01/10 até 20/10/2026' } }

export const ExigeTresAtividades: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByLabelText('Atividade 1'), 'Revisei o módulo de relatórios')
    await userEvent.click(canvas.getByRole('button', { name: /Avalie minhas atividades/ }))
    await expect(await canvas.findByText('Descreva pelo menos 3 atividades.')).toBeVisible()
    await expect(args.onEvaluate).not.toHaveBeenCalled()
  },
}

export const AvaliaComTresAtividades: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByLabelText('Atividade 1'), 'Primeira')
    await userEvent.type(canvas.getByLabelText('Atividade 2'), 'Segunda')
    await userEvent.type(canvas.getByLabelText('Atividade 3'), 'Terceira')
    await userEvent.click(canvas.getByRole('button', { name: /Avalie minhas atividades/ }))
    await expect(args.onEvaluate).toHaveBeenCalledWith(['Primeira', 'Segunda', 'Terceira'])
  },
}

export const AdicionaERemoveAtividade: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: /Adicionar atividade/ }))
    await expect(canvas.getByLabelText('Atividade 4')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Remover atividade 4' }))
    await expect(canvas.queryByLabelText('Atividade 4')).toBeNull()
  },
}

export const BaixaORelatorioAssinado: Story = {
  args: { status: 'completed' },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(await within(canvasElement).findByRole('button', { name: /Baixar relatório assinado/ }))
    await expect(args.onDownloadSigned).toHaveBeenCalledTimes(1)
  },
}

