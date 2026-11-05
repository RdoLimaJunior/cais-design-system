import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconDots, IconEye, IconPencil, IconTrash } from '@tabler/icons-react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'

const meta = {
  title: 'Componentes/Navegação/Menu suspenso',
  component: DropdownMenu,
  parameters: {
    docs: {
      description: {
        component: [
          'Menu de ações que abre ao clicar em um botão (por exemplo, o de três pontos de uma linha de tabela).',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| O usuário clica ou usa `Enter` no gatilho | O menu abre; as setas percorrem os itens |',
          '| Escolhe um item ou pressiona `Esc` | O menu fecha e o foco volta ao gatilho |',
          '| O item apaga ou arquiva | Use `variant="destructive"`, que pinta o texto de vermelho; confirme com `AlertDialog` |',
          '',
          'O gatilho que só tem ícone precisa de `aria-label`.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const AcoesDaLinha: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Ações do projeto">
          <IconDots aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Projeto de exemplo</DropdownMenuLabel>
        <DropdownMenuItem>
          <IconEye size={16} aria-hidden="true" /> Ver detalhes
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconPencil size={16} aria-hidden="true" /> Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <IconTrash size={16} aria-hidden="true" /> Arquivar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(await body.findByRole('button', { name: 'Ações do projeto' }))
    const item = await body.findByRole('menuitem', { name: /Ver detalhes/ })
    await waitFor(() => expect(item).toBeVisible())
    await userEvent.keyboard('{Escape}')
  },
}
