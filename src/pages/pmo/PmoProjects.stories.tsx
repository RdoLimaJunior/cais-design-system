import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { PMO_PROJETOS } from '../../mocks/pmo'
import { PmoNewProjectPage } from './PmoNewProjectPage'
import { PmoProjectDetailPage } from './PmoProjectDetailPage'
import { PmoProjectsPage } from './PmoProjectsPage'

const meta = {
  title: 'Sistemas/CAIS PMO/Telas/Projetos',
  component: PmoProjectsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Lista, cadastro e detalhe dos projetos.',
          '',
          '| Tela | O que mostra |',
          '| --- | --- |',
          '| **Lista** | Abas *Projetos* (em execução), *Simulação* (em planejamento) e *Arquivados*; alterna entre cartões e lista |',
          '| **Novo projeto** | Cadastro e parâmetros, importação do Plano de Trabalho e da Folha RH (opcional). "Concluir cadastro" só habilita com o Plano de Trabalho salvo |',
          '| **Detalhe** | Cabeçalho com status e ações, avisos de somente leitura e nove abas |',
          '',
          '**Regras que as telas cumprem**',
          '',
          '- O status do projeto tem dois valores (Planejamento e Execução); "Arquivado" é um atributo à parte e deixa o projeto somente leitura.',
          '- Projeto em planejamento mostra "Aprovar e Iniciar Execução (gera PT v1.0)".',
          '- O Leitor consulta sem criar, editar nem ver salários; só o Administrador exclui.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof PmoProjectsPage>

export default meta
type Story = StoryObj<typeof meta>

export const ListaEmCards: Story = {}
export const AlternaParaLista: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(await body.findByText('Plataforma de análise de dados (exemplo)')).toBeVisible()
    await userEvent.click(body.getByRole('button', { name: 'Ver em lista' }))
    await expect(await body.findByRole('columnheader', { name: 'Saúde' })).toBeVisible()
  },
}
export const ListaEmTabela: Story = { args: { initialView: 'list' } }
export const Simulacao: Story = { args: { initialTab: 'simulacao' } }
export const Arquivados: Story = { args: { initialTab: 'arquivados' } }
export const ListaParaLeitor: Story = { args: { role: 'LEITOR' } }
export const ListaVazia: Story = { args: { projetos: [] } }
export const ListaNoMobile: Story = { parameters: { device: 'mobile' } }
export const ListaNoTablet: Story = { parameters: { device: 'tablet' } }
export const ListaNoDesktopPequeno: Story = { parameters: { device: 'desktopPequeno' } }
export const ListaNaTelaGrande: Story = { parameters: { device: 'telaGrande' } }

export const NovoProjeto: Story = { render: () => <PmoNewProjectPage /> }
export const NovoProjetoComPlanoSalvo: Story = { render: () => <PmoNewProjectPage workPlanSaved /> }

export const DetalheResumo: Story = { render: () => <PmoProjectDetailPage /> }
export const DetalheVisaoGeral: Story = { render: () => <PmoProjectDetailPage initialTab="visao-geral" /> }
export const DetalheFolhaRh: Story = { render: () => <PmoProjectDetailPage initialTab="folha-rh" /> }
export const DetalheEspelhoRh: Story = { render: () => <PmoProjectDetailPage initialTab="espelho-rh" /> }
export const DetalheDemaisRubricas: Story = { render: () => <PmoProjectDetailPage initialTab="demais-rubricas" /> }
export const DetalheIncorridos: Story = { render: () => <PmoProjectDetailPage initialTab="incorridos" /> }
export const DetalheIncorridosEstourado: Story = {
  render: () => <PmoProjectDetailPage projeto={PMO_PROJETOS[2]} initialTab="incorridos" />,
}
export const DetalheRealizado: Story = { render: () => <PmoProjectDetailPage initialTab="realizado" /> }
export const DetalheFechamento: Story = { render: () => <PmoProjectDetailPage initialTab="fechamento" /> }
export const DetalheEquipeEParametros: Story = { render: () => <PmoProjectDetailPage initialTab="equipe" /> }
export const DetalheEmPlanejamento: Story = { render: () => <PmoProjectDetailPage projeto={PMO_PROJETOS[3]} /> }
export const DetalheArquivado: Story = { render: () => <PmoProjectDetailPage projeto={PMO_PROJETOS[4]} /> }
export const DetalheParaLeitor: Story = { render: () => <PmoProjectDetailPage role="LEITOR" initialTab="folha-rh" /> }
export const DetalheNoMobile: Story = { render: () => <PmoProjectDetailPage />, parameters: { device: 'mobile' } }
export const DetalheNoTablet: Story = { render: () => <PmoProjectDetailPage />, parameters: { device: 'tablet' } }
export const DetalheNaTelaGrande: Story = { render: () => <PmoProjectDetailPage />, parameters: { device: 'telaGrande' } }
