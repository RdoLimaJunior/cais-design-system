import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { MOCK_PROFILE, MOCK_USER } from '../mocks/scholarship'
import { EditProfilePage } from './EditProfilePage'

const meta = {
  title: 'Sistemas/FAROL/Páginas/Perfil/Editar perfil',
  component: EditProfilePage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Edição dos dados pessoais. CPF e telefone usam um campo por dígito.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Digita um dígito no CPF ou telefone | O foco avança para a próxima caixa |',
          '| Apaga numa caixa vazia | O dígito anterior é removido e o foco volta |',
          '| Cola um número | Os dígitos preenchem as caixas a partir da atual |',
          '| Envia com o nome vazio ou e-mail inválido | O envio é bloqueado e o campo mostra o erro (texto provisório) |',
          '| Clica em **Substituir foto** | Abre o seletor de imagem; a prévia é trocada |',
          '| Clica em **Remover foto** | A foto some e a caixa mostra o ícone de pessoa |',
          '| Clica em **Cancelar edição** | Volta ao Perfil sem salvar |',
        ].join('\n'),
      },
    },
  },
  args: {
    userName: MOCK_USER.fullName,
    onSave: fn(),
    initialValues: {
      fullName: MOCK_PROFILE.fullName,
      socialName: '',
      cpf: '12345678909',
      phone: '85999990000',
      personalEmail: MOCK_PROFILE.personalEmail,
      corporateEmail: MOCK_PROFILE.corporateEmail,
      photoUrl: MOCK_PROFILE.photoUrl,
    },
  },
} satisfies Meta<typeof EditProfilePage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SemFoto: Story = { args: { initialValues: { ...meta.args.initialValues, photoUrl: null } } }

export const SalvaDadosValidos: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: /Salvar edição/ }))
    await waitFor(() => expect(args.onSave).toHaveBeenCalledTimes(1))
  },
}

export const BloqueiaNomeVazio: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.clear(await canvas.findByLabelText('Nome completo'))
    await userEvent.click(canvas.getByRole('button', { name: /Salvar edição/ }))
    await expect(await canvas.findByText('Informe seu nome completo.')).toBeVisible()
    await expect(args.onSave).not.toHaveBeenCalled()
  },
}

export const DigitosAvancamEApagam: Story = {
  args: { initialValues: { ...meta.args.initialValues, cpf: '' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = await canvas.findByLabelText('cpf dígito 1')
    await userEvent.click(first)
    await userEvent.keyboard('123')
    await expect(canvas.getByLabelText('cpf dígito 3')).toHaveValue('3')
    await expect(canvas.getByLabelText('cpf dígito 4')).toHaveFocus()
    await userEvent.keyboard('{Backspace}')
    await expect(canvas.getByLabelText('cpf dígito 3')).toHaveValue('')
  },
}

export const RemoveFoto: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Remover foto' }))
    await waitFor(() => expect(canvas.queryByAltText('Foto para comunicação interna')).toBeNull())
  },
}
