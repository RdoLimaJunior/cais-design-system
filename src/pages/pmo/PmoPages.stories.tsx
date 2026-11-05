import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { PmoDashboardPage } from './PmoDashboardPage'

const meta = {
  title: 'Sistemas/CAIS PMO/Telas/Dashboard',
  component: PmoDashboardPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Dashboard do CAIS PMO na **versão nova**, montado só com componentes do design system.',
          '',
          '| Bloco | O que mostra |',
          '| --- | --- |',
          '| Cartões de resumo | Orçamento total, gasto, saldo e quantidade de projetos em execução |',
          '| Saldo financeiro | Rosca do quanto do orçamento já foi gasto |',
          '| Saúde do portfólio | Barra proporcional de projetos em risco, em atenção e saudáveis |',
          '| Projetos | Desvio entre previsto e executado no mês e saldo atual de cada projeto |',
          '| Últimos remanejamentos | Movimentações entre rubricas |',
          '',
          '**Regra que a tela cumpre:** só entram nas somas os projetos em execução e não arquivados. Projetos em planejamento e arquivados ficam de fora.',
          '',
          '**O que muda para o papel:** o Leitor não vê "Colaboradores" nem "Simulador RPA" no menu; só o Administrador vê "Configurações".',
          '',
          'Teste em **Mobile**, **Tablet** e **Desktop** com a barra de tamanho de tela, e com **Alto contraste** e fonte a 130%.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof PmoDashboardPage>

export default meta
type Story = StoryObj<typeof meta>

export const Gestor: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(await body.findByText('Saúde do Portfólio')).toBeVisible()
    await expect(body.getByRole('link', { name: 'Colaboradores' })).toBeVisible()
  },
}

export const Leitor: Story = {
  args: { role: 'LEITOR', userName: 'Leo Leitor' },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(await body.findByText('Saúde do Portfólio')).toBeVisible()
    await expect(body.queryByRole('link', { name: 'Colaboradores' })).toBeNull()
    await expect(body.queryByRole('link', { name: 'Configurações' })).toBeNull()
  },
}

export const Administrador: Story = {
  args: { role: 'ADMIN', userName: 'Gustavo Admin' },
}

export const SemProjetos: Story = {
  args: { projetos: [], remanejamentos: [] },
}

export const NoMobile: Story = { parameters: { device: 'mobile' } }
export const NoTablet: Story = { parameters: { device: 'tablet' } }
export const NoDesktopPequeno: Story = { parameters: { device: 'desktopPequeno' } }
export const NaTelaGrande: Story = { parameters: { device: 'telaGrande' } }
export const NaTelaExtraGrande: Story = { parameters: { device: 'telaExtraGrande' } }
