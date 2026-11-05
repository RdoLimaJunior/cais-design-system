import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { PmoForcePasswordChangePage, PmoLoginPage, PmoRecoverPasswordPage } from './PmoAuthPages'

const meta = {
  title: 'Sistemas/CAIS PMO/Telas/Autenticação',
  component: PmoLoginPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Telas públicas do CAIS PMO, montadas com o `AuthLayout` e os campos de autenticação do design system.',
          '',
          '| Tela | Quando aparece |',
          '| --- | --- |',
          '| **Login** | Entrada com e-mail e senha, "lembrar-me" e entrada com Google |',
          '| **Recuperar senha** | A redefinição ainda não é feita por aqui; a tela só explica e volta ao login |',
          '| **Troca obrigatória de senha** | Todo usuário novo nasce com senha padrão e precisa trocá-la antes de usar qualquer outra tela |',
          '',
          'A troca exige a senha atual, uma nova senha com ao menos 8 caracteres e a confirmação igual.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof PmoLoginPage>

export default meta
type Story = StoryObj<typeof meta>

export const Login: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Acessar Sistema' }))
    await expect(await canvas.findByText('Informe o e-mail.')).toBeVisible()
    await expect(canvas.getByText('Informe a senha.')).toBeVisible()
  },
}

export const RecuperarSenha: Story = {
  render: () => <PmoRecoverPasswordPage />,
}

export const TrocaObrigatoriaDeSenha: Story = {
  render: () => <PmoForcePasswordChangePage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByLabelText('Senha atual *'), 'senhaantiga')
    await userEvent.type(canvas.getByLabelText('Nova senha *'), 'curta')
    await userEvent.click(canvas.getByRole('button', { name: 'Trocar senha e continuar' }))
    await expect(await canvas.findByText('A nova senha precisa ter ao menos 8 caracteres.')).toBeVisible()
  },
}
