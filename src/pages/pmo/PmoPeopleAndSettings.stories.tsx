import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { PmoCollaboratorDetailPage } from './PmoCollaboratorDetailPage'
import { PmoCollaboratorsPage } from './PmoCollaboratorsPage'
import { PmoInstitutePage, PmoSettingsPage } from './PmoSettingsPages'

const meta = {
  title: 'Sistemas/CAIS PMO/Telas/Pessoas e configurações',
  component: PmoCollaboratorsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Colaboradores e configurações do sistema.',
          '',
          '| Tela | O que mostra |',
          '| --- | --- |',
          '| **Colaboradores** | Busca por nome ou CPF, filtros de vínculo e instituto, escolha de colunas visíveis e ações por linha. Cadastro e edição abrem em janela |',
          '| **Colaborador** | Contato, vínculo, ocupação nos projetos ativos e histórico de salários |',
          '| **Configurações** | Abas *Institutos*, *Modelos de Projeto*, *Rubricas*, *Usuários* e *Regras de Acesso* |',
          '| **Instituto** | Taxa, folha e teto de incorridos numa página só, com a barra "Alterações não salvas" |',
          '',
          '**Regras que as telas cumprem**',
          '',
          '- O CPF aparece mascarado na lista e no detalhe.',
          '- "Vaga em aberto" é uma posição planejada, não uma pessoa.',
          '- A carga atual é verde até 85%, âmbar acima de 85% e vermelha acima de 100% (sobrealocado).',
          '- O Leitor não acessa Colaboradores nem Configurações e nunca vê salários.',
          '- Só o Administrador entra em Configurações. O Administrador não aparece na tabela de regras porque sempre passa.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof PmoCollaboratorsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Lista: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(await body.findByRole('button', { name: 'Novo colaborador' }))
    const dialog = await body.findByRole('dialog', { name: 'Novo colaborador' })
    // O diálogo anima a entrada; espera terminar antes de conferir.
    await waitFor(() => expect(dialog).toBeVisible())
  },
}
export const ListaSemResultado: Story = { args: { colaboradores: [] } }
export const Detalhe: Story = { render: () => <PmoCollaboratorDetailPage /> }
export const DetalheParaLeitor: Story = { render: () => <PmoCollaboratorDetailPage role="LEITOR" /> }

export const ConfiguracoesInstitutos: Story = { render: () => <PmoSettingsPage /> }
export const ConfiguracoesModelos: Story = { render: () => <PmoSettingsPage initialTab="modelos" /> }
export const ConfiguracoesRubricas: Story = { render: () => <PmoSettingsPage initialTab="rubricas" /> }
export const ConfiguracoesUsuarios: Story = { render: () => <PmoSettingsPage initialTab="usuarios" /> }
export const ConfiguracoesRegrasDeAcesso: Story = { render: () => <PmoSettingsPage initialTab="regras" /> }
export const Instituto: Story = { render: () => <PmoInstitutePage /> }
export const InstitutoComAlteracoes: Story = { render: () => <PmoInstitutePage hasUnsavedChanges /> }
