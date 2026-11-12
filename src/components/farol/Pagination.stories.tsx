import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Pagination } from './Pagination'

function InteractivePagination({
  totalPages,
  initialPage,
  totalItems,
  pageSize,
}: {
  totalPages: number
  initialPage: number
  totalItems?: number
  pageSize?: number
}) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      ariaLabel="Paginação dos relatórios"
      onPageChange={setCurrentPage}
      totalItems={totalItems}
      pageSize={pageSize}
    />
  )
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
          '| Há mais de 7 páginas | Mostra só a primeira, a última, a atual e as vizinhas, com `…` nos intervalos |',
          '| Recebe `totalItems` e `pageSize` | Mostra "Mostrando X–Y de Z" à esquerda |',
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
export const MuitasPaginas: Story = { args: { totalPages: 30, initialPage: 15 } }
export const ComResumoDeItens: Story = { args: { totalPages: 5, initialPage: 2, totalItems: 88, pageSize: 20 } }

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

export const MostraJanelaDePaginas: Story = {
  args: { totalPages: 30, initialPage: 15 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('button', { name: '15' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('button', { name: '1' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: '30' })).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: '8' })).not.toBeInTheDocument()
  },
}
