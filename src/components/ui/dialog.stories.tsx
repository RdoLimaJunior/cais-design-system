import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Button } from './button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'

const meta = {
  title: 'Componentes/Feedback/Diálogo',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component: [
          'Janela modal para formulários e confirmações que não pedem uma página própria.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| O usuário clica no gatilho | A janela abre e o foco vai para dentro dela |',
          '| Pressiona `Esc` ou clica em **Fechar** | A janela fecha e o foco volta ao gatilho |',
          '| A ação não tem volta (excluir, arquivar) | Use `AlertDialog`, que pede confirmação explícita |',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Formulario: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Novo aporte</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar aporte</DialogTitle>
          <DialogDescription>Informe o valor recebido do financiador.</DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Os campos do formulário entram aqui.</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(await body.findByRole('button', { name: 'Novo aporte' }))
    const dialog = await body.findByRole('dialog', { name: 'Registrar aporte' })
    // O diálogo anima a entrada e a saída; espera a animação terminar antes de conferir.
    await waitFor(() => expect(dialog).toBeVisible())
    await userEvent.click(body.getByRole('button', { name: 'Cancelar' }))
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())
  },
}
