import { cn } from '../../lib/utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  ariaLabel: string
  onPageChange: (page: number) => void
  /** Total de itens e itens por página: quando os dois vêm, mostra "Mostrando X–Y de Z" à esquerda. */
  totalItems?: number
  pageSize?: number
}

/** Até este total mostramos todas as páginas; acima disso, só a página atual, as pontas e as vizinhas. */
const MAX_PAGES_WITHOUT_GAPS = 7
const NEIGHBOR_PAGES = 1
const GAP = 'gap' as const

type PageItem = number | typeof GAP

function listVisiblePages(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= MAX_PAGES_WITHOUT_GAPS) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const wanted = new Set([1, totalPages])
  for (let page = currentPage - NEIGHBOR_PAGES; page <= currentPage + NEIGHBOR_PAGES; page += 1) {
    if (page > 1 && page < totalPages) wanted.add(page)
  }
  const sorted = [...wanted].sort((a, b) => a - b)
  return sorted.flatMap((page, index) => (index > 0 && page - sorted[index - 1] > 1 ? [GAP, page] : [page]))
}

export function Pagination({ currentPage: requestedPage, totalPages, ariaLabel, onPageChange, totalItems, pageSize }: PaginationProps) {
  // Uma página fora do intervalo (por exemplo, depois de um filtro que reduziu o total) não pode gerar "41–12 de 12".
  const currentPage = Math.min(Math.max(requestedPage, 1), Math.max(totalPages, 1))
  const hasSummary = totalItems !== undefined && pageSize !== undefined && totalItems > 0
  const firstItem = hasSummary ? (currentPage - 1) * pageSize + 1 : 0
  const lastItem = hasSummary ? Math.min(currentPage * pageSize, totalItems) : 0

  return (
    <nav
      className={cn('mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-xs', hasSummary ? 'justify-between' : 'justify-end')}
      aria-label={ariaLabel}
    >
      {hasSummary && (
        <p className="text-zinc-500">
          Mostrando{' '}
          <span className="font-medium text-zinc-950">
            {firstItem}–{lastItem}
          </span>{' '}
          de <span className="font-medium text-zinc-950">{totalItems}</span>
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2 disabled:opacity-40"
        >
          ‹ Anterior
        </button>
        {listVisiblePages(currentPage, totalPages).map((page, index) =>
          page === GAP ? (
            <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-zinc-500">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
              className={cn('size-8 rounded-lg', page === currentPage && 'border border-zinc-200 bg-zinc-50')}
            >
              {page}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2 disabled:opacity-40"
        >
          Próxima ›
        </button>
      </div>
    </nav>
  )
}
