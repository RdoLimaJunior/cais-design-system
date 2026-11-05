import type { ReactNode } from 'react'
import { IconSelector } from '@tabler/icons-react'
import { cn } from '../../lib/utils'

export type SortDirection = 'ascending' | 'descending'

export interface DataTableColumn<Row> {
  id: string
  header?: ReactNode
  headerClassName?: string
  cellClassName?: string
  isSortable?: boolean
  render: (row: Row) => ReactNode
}

export interface DataTableSelection {
  selectAllLabel: string
  getRowLabel: (rowKey: string) => string
  isRowSelectable: (rowKey: string) => boolean
  selectedKeys: string[]
  onSelectionChange: (selectedKeys: string[]) => void
}

export interface DataTableSort {
  columnId: string
  direction: SortDirection
  onSortChange: (columnId: string) => void
}

export interface DataTableProps<Row> {
  columns: DataTableColumn<Row>[]
  rows: Row[]
  getRowKey: (row: Row) => string
  selection?: DataTableSelection
  sort?: DataTableSort
  minWidthClassName?: string
}

function SortableHeader({ label, isActive, onClick }: { label: ReactNode; isActive: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2">
      {label}
      <IconSelector className={cn('size-3', isActive ? 'opacity-100' : 'opacity-60')} aria-hidden="true" />
    </button>
  )
}

export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  selection,
  sort,
  minWidthClassName,
}: DataTableProps<Row>) {
  const selectableKeys = selection ? rows.map(getRowKey).filter(selection.isRowSelectable) : []
  const hasSelectableRows = selectableKeys.length > 0
  const areAllSelected = hasSelectableRows && selectableKeys.every((key) => selection?.selectedKeys.includes(key))

  function toggleAll() {
    selection?.onSelectionChange(areAllSelected ? [] : selectableKeys)
  }

  function toggleRow(rowKey: string) {
    if (!selection) return
    const isSelected = selection.selectedKeys.includes(rowKey)
    selection.onSelectionChange(
      isSelected ? selection.selectedKeys.filter((key) => key !== rowKey) : [...selection.selectedKeys, rowKey],
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className={cn('w-full table-fixed text-left text-sm', minWidthClassName)}>
        <thead className="h-10 bg-[#0089E2] text-white">
          <tr>
            {selection && (
              <th className="w-9 px-3">
                <input
                  type="checkbox"
                  className="size-3"
                  aria-label={selection.selectAllLabel}
                  disabled={!hasSelectableRows}
                  checked={areAllSelected}
                  onChange={toggleAll}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                className={cn('px-3 font-medium', column.headerClassName)}
                aria-sort={sort && column.isSortable && sort.columnId === column.id ? sort.direction : undefined}
              >
                {column.isSortable && sort ? (
                  <SortableHeader
                    label={column.header}
                    isActive={sort.columnId === column.id}
                    onClick={() => sort.onSortChange(column.id)}
                  />
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const rowKey = getRowKey(row)
            return (
              <tr key={rowKey} className="h-11 border-b border-zinc-200 last:border-b-0">
                {selection && (
                  <td className="px-3">
                    <input
                      type="checkbox"
                      className="size-3"
                      aria-label={selection.getRowLabel(rowKey)}
                      disabled={!selection.isRowSelectable(rowKey)}
                      checked={selection.selectedKeys.includes(rowKey)}
                      onChange={() => toggleRow(rowKey)}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.id} className={cn('px-3', column.cellClassName)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
