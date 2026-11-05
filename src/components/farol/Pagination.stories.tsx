import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Pagination } from './Pagination'

function InteractivePagination({ totalPages, initialPage }: { totalPages: number; initialPage: number }) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  return <Pagination currentPage={currentPage} totalPages={totalPages} ariaLabel="Paginação dos relatórios" onPageChange={setCurrentPage} />
}

const meta = {
  title: 'Componentes/Navegação/Paginação',
  component: InteractivePagination,
  parameters: {
    docs: {
      description: {
        component: [
          'Paginação das listas (hoje, a de relatórios do perfil), alinhada à direita, sob a tabela.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Está na primeira página | **Anterior** fica desabilitado (opacidade 40%) |',
          '| Está na última página | **Próxima** fica desabilitado |',
          '| Clica num número | Vai para a página; o número ativo ganha borda e fundo cinza claro (`aria-current="page"`) |',
        ].join('\n'),
      },
    },
  },
  args: { totalPages: 3, initialPage: 1 },
} satisfies Meta<typeof InteractivePagination>

export default meta
type Story = StoryObj<typeof meta>

export const PrimeiraPagina: Story = {}
export const PaginaDoMeio: Story = { args: { initialPage: 2 } }
export const UmaPaginaSo: Story = { args: { totalPages: 1 } }

export const NavegaAteOFim: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('button', { name: '‹ Anterior' })).toBeDisabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Próxima ›' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Próxima ›' }))
    await expect(canvas.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('button', { name: 'Próxima ›' })).toBeDisabled()
  },
}
