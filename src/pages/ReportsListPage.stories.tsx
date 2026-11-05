import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { MOCK_REPORTS, MOCK_USER } from '../mocks/scholarship'
import { ReportsListPage } from './ReportsListPage'

const meta = {
  title: 'Sistemas/FAROL/Páginas/Relatórios/Meus relatórios',
  component: ReportsListPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Lista de todos os relatórios mensais do bolsista, do mais recente para o mais antigo.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| O relatório está **não iniciado** | A linha tem só **Preencher**, que abre o relatório |',
          '| O relatório está **concluído** | A linha tem **Baixar** e **Visualizar** |',
          '| Clica em **Baixar** | Dispara `onDownload` com o id do relatório |',
          '| Passa o mouse numa linha | O fundo clareia (`zinc-50`) |',
          '| A tabela é mais larga que a área | A lista rola na horizontal |',
        ].join('\n'),
      },
    },
  },
  args: { userName: MOCK_USER.fullName, reports: MOCK_REPORTS, onDownload: fn() },
} satisfies Meta<typeof ReportsListPage>

export default meta
type Story = StoryObj<typeof meta>

export const ListaDeRelatorios: Story = {}

export const BaixaUmRelatorioConcluido: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const [firstDownload] = await canvas.findAllByRole('button', { name: /Baixar/ })
    await userEvent.click(firstDownload)
    await expect(args.onDownload).toHaveBeenCalledWith('493')
  },
}
