import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ResetPasswordPage } from './ResetPasswordPage'

const meta = {
  title: 'Sistemas/FAROL/Páginas/Autenticação/Definir nova senha',
  component: ResetPasswordPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Aberta pelo link recebido por e-mail (`/reset-password?token=…`).',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| A senha tem menos de 8 caracteres, ou falta maiúscula, minúscula, número ou caractere especial | O envio é bloqueado e o campo mostra o erro |',
          '| A confirmação é diferente da nova senha | O envio é bloqueado e a confirmação mostra o erro |',
          '| Tudo válido | A nova senha é enviada |',
        ].join('\n'),
      },
    },
  },
  args: { onSubmit: fn() },
} satisfies Meta<typeof ResetPasswordPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const RejeitaSenhaFraca: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByLabelText('Nova senha'), 'fraca')
    await userEvent.click(canvas.getByRole('button', { name: 'Definir nova senha' }))
    await expect(await canvas.findByText('A senha não atende aos requisitos.')).toBeVisible()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const AceitaSenhaForte: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByLabelText('Nova senha'), 'Forte@123')
    await userEvent.type(canvas.getByLabelText('Confirme a nova senha'), 'Forte@123')
    await userEvent.click(canvas.getByRole('button', { name: 'Definir nova senha' }))
    await expect(args.onSubmit).toHaveBeenCalledWith('Forte@123')
  },
}
