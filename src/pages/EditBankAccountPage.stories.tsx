import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { MOCK_BANK_ACCOUNT, MOCK_USER } from '../mocks/scholarship'
import { EditBankAccountPage } from './EditBankAccountPage'

const meta = {
  title: 'Sistemas/FAROL/Páginas/Perfil/Editar dados bancários',
  component: EditBankAccountPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Edição dos dados bancários. **Banco e código do banco são somente leitura** (vêm do cadastro); agência, conta, chave Pix e tipo da chave são editáveis.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Tenta editar o banco ou o código | Os campos estão desabilitados |',
          '| Envia sem a chave Pix ou sem o tipo de chave | O envio é bloqueado e o erro aparece (texto provisório) |',
          '| Escolhe um tipo de chave Pix | Só uma opção fica marcada (CPF, Celular, E-mail ou Chave aleatória) |',
          '| Agência passa de 6 caracteres, ou conta passa de 20 | O campo não aceita mais caracteres |',
        ].join('\n'),
      },
    },
  },
  args: {
    userName: MOCK_USER.fullName,
    onSave: fn(),
    initialValues: {
      bankName: MOCK_BANK_ACCOUNT.bankName,
      bankCode: MOCK_BANK_ACCOUNT.bankCode,
      branch: MOCK_BANK_ACCOUNT.branch,
      accountNumber: MOCK_BANK_ACCOUNT.accountNumber,
    },
  },
} satisfies Meta<typeof EditBankAccountPage>

export default meta
type Story = StoryObj<typeof meta>

export const EditarDadosBancarios: Story = {}

export const BancoEhSomenteLeitura: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByLabelText('Banco')).toBeDisabled()
    await expect(canvas.getByLabelText('bank-code dígito 1')).toBeDisabled()
  },
}

export const ExigeChavePixETipo: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: /Salvar edição/ }))
    await expect(await canvas.findByText('Informe a chave Pix.')).toBeVisible()
    await expect(args.onSave).not.toHaveBeenCalled()
  },
}

export const SalvaComTudoPreenchido: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByLabelText('Chave Pix'), 'chave-de-teste')
    await userEvent.click(canvas.getByLabelText('Chave aleatória'))
    await userEvent.click(canvas.getByRole('button', { name: /Salvar edição/ }))
    await waitFor(() => expect(args.onSave).toHaveBeenCalledTimes(1))
  },
}
