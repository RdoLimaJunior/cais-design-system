import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { MOCK_USER } from '../mocks/scholarship'
import { ChangePasswordPage } from './ChangePasswordPage'

const meta = {
  title: 'Sistemas/FAROL/Páginas/Perfil/Alterar senha',
  component: ChangePasswordPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Troca de senha de quem já está logado. É a **única tela do site sem breadcrumb**.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Envia sem a senha atual | O envio é bloqueado (texto de erro provisório) |',
          '| A nova senha não tem 8+ caracteres, maiúscula, minúscula, número e caractere especial | O envio é bloqueado |',
          '| A confirmação é diferente da nova senha | O envio é bloqueado e a confirmação mostra o erro |',
          '| Clica no olho de um campo | Só aquele campo mostra ou oculta a senha |',
          '| Clica em **Cancelar** | Volta ao Perfil |',
        ].join('\n'),
      },
    },
  },
  args: { userName: MOCK_USER.fullName, onSave: fn() },
} satisfies Meta<typeof ChangePasswordPage>

export default meta
type Story = StoryObj<typeof meta>

export const AlterarSenha: Story = {}

export const RejeitaSenhaFraca: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByLabelText('Senha atual', { selector: 'input' }), 'Atual@123')
    await userEvent.type(canvas.getByLabelText('Nova senha', { selector: 'input' }), 'fraca')
    await userEvent.click(canvas.getByRole('button', { name: /Salvar senha/ }))
    await expect(await canvas.findByText('A senha não atende aos requisitos.')).toBeVisible()
    await expect(args.onSave).not.toHaveBeenCalled()
  },
}

export const AceitaSenhaForte: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByLabelText('Senha atual', { selector: 'input' }), 'Atual@123')
    await userEvent.type(canvas.getByLabelText('Nova senha', { selector: 'input' }), 'Forte@1234')
    await userEvent.type(canvas.getByLabelText('Confirme a nova senha', { selector: 'input' }), 'Forte@1234')
    await userEvent.click(canvas.getByRole('button', { name: /Salvar senha/ }))
    await waitFor(() => expect(args.onSave).toHaveBeenCalledTimes(1))
  },
}
