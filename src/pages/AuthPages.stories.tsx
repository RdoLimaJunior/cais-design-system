import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { LoginPage } from './LoginPage'

const loginMeta = {
  title: 'Sistemas/FAROL/Páginas/Autenticação/Login',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Entrada no sistema por CPF e senha, com recuperação de senha no mesmo card.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Digita o CPF | A máscara `000.000.000-00` é aplicada na hora |',
          '| Envia com CPF ou senha vazios | Aparecem "Informe seu CPF." e "Informe sua senha." e o primeiro campo inválido recebe `aria-invalid` |',
          '| Clica no ícone do olho | A senha alterna entre oculta e visível; o rótulo do botão muda |',
          '| Clica em **Esqueceu a senha?** | O card troca para "Recupere sua senha", pedindo o e-mail |',
          '| Envia o e-mail | O card mostra o aviso de que o link foi enviado (texto provisório) |',
          '| Clica em **Voltar para o login** | Retorna ao formulário de login |',
        ].join('\n'),
      },
    },
  },
  args: { onLogin: fn(), onRequestPasswordRecovery: fn() },
} satisfies Meta<typeof LoginPage>

export default loginMeta
type Story = StoryObj<typeof loginMeta>

export const Login: Story = {}
export const RecuperarSenha: Story = { args: { initialMode: 'recovery' } }
export const RecuperacaoEnviada: Story = { args: { initialMode: 'recovery-sent' } }

export const ValidaCamposVazios: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Entrar' }))
    await expect(await canvas.findByText('Informe seu CPF.')).toBeVisible()
    await expect(canvas.getByText('Informe sua senha.')).toBeVisible()
  },
}

export const AplicaMascaraDeCpf: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByLabelText('CPF'), '12345678909')
    await expect(canvas.getByLabelText('CPF')).toHaveValue('123.456.789-09')
  },
}

export const EntraComCredenciais: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByLabelText('CPF'), '12345678909')
    await userEvent.type(canvas.getByLabelText('Senha'), 'qualquer-senha')
    await userEvent.click(canvas.getByRole('button', { name: 'Entrar' }))
    await expect(args.onLogin).toHaveBeenCalledWith('123.456.789-09')
  },
}

export const FluxoEsqueciSenha: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Esqueceu a senha?' }))
    await userEvent.type(await canvas.findByLabelText('Email'), 'maria@example.com')
    await userEvent.click(canvas.getByRole('button', { name: 'Enviar link' }))
    await expect(args.onRequestPasswordRecovery).toHaveBeenCalledWith('maria@example.com')
    await expect(await canvas.findByText('Verifique seu e-mail')).toBeVisible()
  },
}
