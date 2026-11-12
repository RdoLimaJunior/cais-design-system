"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "../../lib/utils"

export interface ComboboxOption {
  value: string
  label: string
  /** Texto extra que entra na busca (por exemplo, o vínculo), sem aparecer como rótulo. */
  searchText?: string
  /** Linha de apoio sob o rótulo (por exemplo, um aviso). */
  description?: React.ReactNode
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value: string | null
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  loading?: boolean
  disabled?: boolean
  id?: string
  "aria-label"?: string
  className?: string
}

/** Minúsculas e sem acento, para a busca ignorar maiúscula e acentuação. */
function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
}

/** Lista suspensa com busca: o usuário digita um trecho e as opções filtram na hora. Use no lugar do `Select` quando a lista for longa. */
function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Selecionar",
  searchPlaceholder = "Buscar…",
  emptyMessage = "Nenhum resultado encontrado",
  loading = false,
  disabled = false,
  id,
  className,
  "aria-label": ariaLabel,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const searchRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const listboxId = React.useId()

  const selected = options.find((option) => option.value === value) ?? null

  const filtered = React.useMemo(() => {
    const term = normalize(query.trim())
    if (!term) return options
    return options.filter((option) => normalize(`${option.label} ${option.searchText ?? ""}`).includes(term))
  }, [options, query])

  const close = React.useCallback((restoreFocus: boolean) => {
    setOpen(false)
    setQuery("")
    if (restoreFocus) triggerRef.current?.focus()
  }, [])

  React.useEffect(() => {
    if (!open) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) close(false)
    }
    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [open, close])

  React.useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  // Com a lista maior que a janela, o destaque do teclado precisa acompanhar a rolagem.
  React.useEffect(() => {
    if (open) listRef.current?.children[activeIndex]?.scrollIntoView?.({ block: "nearest" })
  }, [open, activeIndex])

  /** Próxima opção habilitada a partir de `from`, andando `step` posições; fica onde está se não houver outra. */
  const findEnabledIndex = (from: number, step: 1 | -1): number => {
    for (let index = from + step; index >= 0 && index < filtered.length; index += step) {
      if (!filtered[index].disabled) return index
    }
    return from
  }

  const openList = () => {
    const selectedIndex = options.findIndex((option) => option.value === value)
    const firstEnabledIndex = options.findIndex((option) => !option.disabled)
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : Math.max(firstEnabledIndex, 0))
    setOpen(true)
  }

  const changeQuery = (nextQuery: string) => {
    setQuery(nextQuery)
    const term = normalize(nextQuery.trim())
    const firstMatchIndex = options.filter((option) => normalize(`${option.label} ${option.searchText ?? ""}`).includes(term)).findIndex((option) => !option.disabled)
    setActiveIndex(Math.max(firstMatchIndex, 0))
  }

  const choose = (option: ComboboxOption) => {
    if (option.disabled) return
    onValueChange(option.value)
    close(true)
  }

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault()
      close(true)
    } else if (event.key === "Tab") {
      // Devolve o foco ao campo antes do Tab seguir, para a lista não ficar aberta sobre o próximo campo.
      close(true)
    } else if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => findEnabledIndex(index, 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => findEnabledIndex(index, -1))
    } else if (event.key === "Enter") {
      event.preventDefault()
      const option = filtered[activeIndex]
      if (option) choose(option)
    }
  }

  const activeOptionId = filtered[activeIndex] ? `${listboxId}-${activeIndex}` : undefined

  return (
    <div ref={containerRef} data-slot="combobox" className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        onClick={() => (open ? close(false) : openList())}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50",
          className
        )}
      >
        <span className={cn("truncate text-left", !selected && "text-muted-foreground")}>
          {selected?.label ?? (loading ? "Carregando…" : placeholder)}
        </span>
        <ChevronDownIcon className="size-4 shrink-0 opacity-50" aria-hidden="true" />
      </button>

      {open && (
        <div
          data-slot="combobox-content"
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
        >
          <input
            ref={searchRef}
            data-slot="combobox-search"
            type="text"
            role="searchbox"
            aria-label={searchPlaceholder}
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={searchPlaceholder}
            className="h-9 w-full border-b bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <div ref={listRef} id={listboxId} role="listbox" aria-label={ariaLabel} className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-2 py-3 text-center text-sm text-muted-foreground">{emptyMessage}</p>
            ) : (
              filtered.map((option, index) => (
                <div
                  key={option.value}
                  id={`${listboxId}-${index}`}
                  data-slot="combobox-item"
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled || undefined}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(option)}
                  className={cn(
                    "relative flex w-full cursor-default flex-col rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none",
                    index === activeIndex && "bg-accent text-accent-foreground",
                    option.disabled && "pointer-events-none opacity-50"
                  )}
                >
                  <span className="absolute left-2 flex size-3.5 items-center justify-center">
                    {option.value === value && <CheckIcon className="size-4" aria-hidden="true" />}
                  </span>
                  <span>{option.label}</span>
                  {option.description && <span className="text-xs opacity-70">{option.description}</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { Combobox }
