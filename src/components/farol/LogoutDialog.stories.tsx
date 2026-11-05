import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { Button } from '../ui/button'
import { LogoutDialog } from './LogoutDialog'

const meta = {
  title: 'Componentes/Feedback/Modal Sair do sistema',
  component: LogoutDialog,
  parameters: {
    docs: {
      description: {
        component: [
          'Confirmação antes de encerrar a sessão.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| O usuário aciona **Sair do Sistema** | O modal abre com o foco dentro dele e o fundo escurece |',
          '| Clica em **Cancelar** ou pressiona `Esc` | O modal fecha e a sessão continua |',
          '| Clica em **Sair** | A ação de logout é disparada |',
        ].join('\n'),
      },
    },
  },
  args: {
    onConfirm: fn(),
    trigger: <Button variant="outline">Sair do Sistema</Button>,
  },
} satisfies Meta<typeof LogoutDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {}

export const Open: Story = { args: { defaultOpen: true } }

export const ConfirmsLogout: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(await body.findByRole('button', { name: 'Sair do Sistema' }))
    await userEvent.click(await body.findByRole('button', { name: 'Sair' }))
    await expect(args.onConfirm).toHaveBeenCalledTimes(1)
  },
}

export const CancelClosesDialog: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(await body.findByRole('button', { name: 'Sair do Sistema' }))
    await userEvent.click(await body.findByRole('button', { name: 'Cancelar' }))
    await waitFor(() => expect(body.queryByRole('alertdialog')).toBeNull())
  },
}
