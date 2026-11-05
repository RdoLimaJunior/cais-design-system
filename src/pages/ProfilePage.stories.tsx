import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import {
  MOCK_ADDRESS,
  MOCK_BANK_ACCOUNT,
  MOCK_CONTRACTS,
  MOCK_DOCUMENTS,
  MOCK_PROFILE,
  MOCK_PROJECT_NAME,
  MOCK_REPORTS,
  MOCK_TERMS,
  MOCK_USER,
} from '../mocks/scholarship'
import { ProfilePage } from './ProfilePage'

const meta = {
  title: 'Sistemas/FAROL/Páginas/Perfil/Ver perfil',
  component: ProfilePage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Perfil do bolsista, com oito abas. O rodapé de ações acompanha a aba ativa.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| O usuário troca de aba | O conteúdo muda sem recarregar a página; a aba ativa fica com fundo branco e sombra |',
          '| Está em Perfil, Endereço ou Dados bancários | O rodapé mostra **Editar** e leva à tela de edição correspondente |',
          '| Está em Senha | O rodapé mostra **Mudar senha** |',
          '| Está em Informações de Contrato, Documentos, Termos ou Relatórios | Não há rodapé de edição |',
          '| Em Documentos, clica no cabeçalho de uma coluna ordenável | A lista ordena (ascendente, depois descendente) e o cabeçalho recebe `aria-sort` |',
          '| Em Documentos, marca documentos *Recebidos* | **Baixar arquivos** é habilitado; documentos pendentes ou opcionais não podem ser marcados |',
          '| Em Relatórios, há mais de 5 itens | A paginação aparece e **Anterior/Próxima** respeitam os limites |',
        ].join('\n'),
      },
    },
  },
  args: {
    userName: MOCK_USER.fullName,
    profile: MOCK_PROFILE,
    address: MOCK_ADDRESS,
    bankAccount: MOCK_BANK_ACCOUNT,
    contracts: MOCK_CONTRACTS,
    documents: MOCK_DOCUMENTS,
    terms: MOCK_TERMS,
    reports: MOCK_REPORTS,
    projectName: MOCK_PROJECT_NAME,
  },
} satisfies Meta<typeof ProfilePage>

export default meta
type Story = StoryObj<typeof meta>

export const Perfil: Story = {}
export const Endereco: Story = { args: { initialTab: 'Endereço' } }
export const DadosBancarios: Story = { args: { initialTab: 'Dados bancários' } }
export const InformacoesDeContrato: Story = { args: { initialTab: 'Informações de Contrato' } }
export const Documentos: Story = { args: { initialTab: 'Documentos' } }
export const Termos: Story = { args: { initialTab: 'Termos' } }
export const Relatorios: Story = { args: { initialTab: 'Relatórios' } }
export const Senha: Story = { args: { initialTab: 'Senha' } }

export const RelatoriosComPaginacao: Story = {
  args: {
    initialTab: 'Relatórios',
    reports: Array.from({ length: 7 }, (_, index) => ({
      ...MOCK_REPORTS[1],
      id: String(900 + index),
      competence: `Competência ${index + 1}`,
    })),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Competência 1')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Próxima ›' }))
    await expect(await canvas.findByText('Competência 6')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Próxima ›' })).toBeDisabled()
  },
}

export const DocumentosSelecionaRecebidos: Story = {
  args: { initialTab: 'Documentos' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const download = await canvas.findByRole('button', { name: /Baixar arquivos/ })
    await expect(download).toBeDisabled()
    await userEvent.click(canvas.getByLabelText('Selecionar CPF'))
    await expect(download).toBeEnabled()
    await expect(canvas.getByLabelText('Selecionar Histórico escolar')).toBeDisabled()
  },
}

export const TrocaDeAbas: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Endereço' }))
    await expect(await canvas.findByText('Logradouro')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Senha' }))
    await expect(await canvas.findByRole('link', { name: /Mudar senha/ })).toBeVisible()
  },
}
