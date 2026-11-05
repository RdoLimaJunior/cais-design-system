import { cn } from '../../lib/utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  ariaLabel: string
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, ariaLabel, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="mt-auto flex items-center justify-end gap-2 pt-6 text-xs" aria-label={ariaLabel}>
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2 disabled:opacity-40"
      >
        ‹ Anterior
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(page)}
          className={cn('size-8 rounded-lg', page === currentPage && 'border border-zinc-200 bg-zinc-50')}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2 disabled:opacity-40"
      >
        Próxima ›
      </button>
    </nav>
  )
}
