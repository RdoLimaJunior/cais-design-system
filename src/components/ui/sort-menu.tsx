import { IconArrowsSort } from '@tabler/icons-react'
import { cn } from '../../lib/utils'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './dropdown-menu'

export interface SortMenuOption<T extends string> {
  value: T
  label: string
}

export interface SortMenuProps<T extends string> {
  options: SortMenuOption<T>[]
  value: T
  onValueChange: (value: T) => void
  /** Texto do botão e título do menu. */
  label?: string
  className?: string
}

/** Botão "Ordenar por: opção" que abre a lista de critérios, com a escolhida marcada. */
export function SortMenu<T extends string>({ options, value, onValueChange, label = 'Ordenar por', className }: SortMenuProps<T>) {
  const current = options.find((option) => option.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" data-slot="sort-menu" aria-label={`${label}: ${current?.label ?? ''}`} className={cn('justify-start font-normal', className)}>
          <IconArrowsSort aria-hidden="true" />
          <span className="text-muted-foreground">{label}:</span>
          <span className="font-medium">{current?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onValueChange(next as T)}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
