"use client"

import * as React from "react"
import { CornerDownLeftIcon, SearchIcon, XIcon } from "lucide-react"
import { cn } from "../../lib/utils"
import { Spinner } from "./spinner"

export interface SearchSuggestion {
  id: string
  label: string
  /** Linha de apoio sob o rótulo (por exemplo, o cargo ou o instituto). */
  description?: React.ReactNode
  /** Título do grupo em que a sugestão aparece (por exemplo, "Projetos"). Sugestões sem grupo ficam no topo. */
  group?: string
  /** Ícone ou avatar à esquerda do rótulo. */
  icon?: React.ReactNode
  /** Texto extra que entra na busca, sem aparecer como rótulo. */
  searchText?: string
}

export interface SearchAutocompleteProps {
  /** Texto digitado. O componente é controlado: quem usa guarda o valor. */
  value: string
  onValueChange: (value: string) => void
  suggestions: SearchSuggestion[]
  /** Chamado ao escolher uma sugestão (clique ou `Enter` sobre ela). */
  onSelect: (suggestion: SearchSuggestion) => void
  /** Chamado ao apertar `Enter` sem nenhuma sugestão destacada: busca pelo texto digitado. */
  onSearch?: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  /** Mostra o indicador de carregamento no campo (por exemplo, enquanto as sugestões vêm do servidor). */
  loading?: boolean
  /** Quantas sugestões aparecem no máximo. */
  maxSuggestions?: number
  /** Quantos caracteres são necessários para abrir a lista. */
  minChars?: number
  /** Desligue quando as sugestões já vêm filtradas pelo servidor. */
  filterLocally?: boolean
  /** Tecla que leva o foco ao campo de qualquer lugar da tela; `null` desliga o atalho. */
  shortcutKey?: string | null
  "aria-label": string
  className?: string
}

const DEFAULT_MAX_SUGGESTIONS = 8

/** Minúsculas e sem acento, para a busca ignorar maiúscula e acentuação. */
function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
}

/** Parte o texto em trechos, marcando os que batem com a busca (sem diferenciar maiúscula nem acento). */
function splitByMatch(text: string, query: string): { text: string; match: boolean }[] {
  const term = normalize(query.trim())
  if (!term) return [{ text, match: false }]
  let normalized = ""
  const originalIndexOf: number[] = []
  Array.from(text).forEach((character, index) => {
    const piece = normalize(character)
    normalized += piece
    for (let i = 0; i < piece.length; i += 1) originalIndexOf.push(index)
  })
  const characters = Array.from(text)
  const start = normalized.indexOf(term)
  if (start < 0) return [{ text, match: false }]
  const from = originalIndexOf[start]
  const to = originalIndexOf[start + term.length - 1] + 1
  return [
    { text: characters.slice(0, from).join(""), match: false },
    { text: characters.slice(from, to).join(""), match: true },
    { text: characters.slice(to).join(""), match: false },
  ].filter((part) => part.text.length > 0)
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  return (
    <>
      {splitByMatch(text, query).map((part, index) =>
        part.match ? (
          <mark key={index} className="rounded-sm bg-primary/15 font-semibold text-primary">
            {part.text}
          </mark>
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        )
      )}
    </>
  )
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
}

/**
 * Campo de busca com sugestões: conforme o usuário digita, aparece uma lista agrupada com o trecho encontrado em destaque.
 * Serve para achar uma pessoa, um projeto ou um documento sem sair da tela.
 */
function SearchAutocomplete({
  value,
  onValueChange,
  suggestions,
  onSelect,
  onSearch,
  placeholder = "Buscar…",
  emptyMessage = "Nada encontrado",
  loading = false,
  maxSuggestions = DEFAULT_MAX_SUGGESTIONS,
  minChars = 1,
  filterLocally = true,
  shortcutKey = "/",
  "aria-label": ariaLabel,
  className,
}: SearchAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const listboxId = React.useId()

  const canShowList = value.trim().length >= minChars

  const visible = React.useMemo(() => {
    const term = normalize(value.trim())
    const matching = filterLocally && term
      ? suggestions.filter((suggestion) => normalize(`${suggestion.label} ${suggestion.searchText ?? ""}`).includes(term))
      : suggestions
    return matching.slice(0, maxSuggestions)
  }, [suggestions, value, filterLocally, maxSuggestions])

  // As sugestões sem grupo vêm primeiro; as demais seguem a ordem em que cada grupo aparece pela primeira vez.
  const groups = React.useMemo(() => {
    const byGroup = new Map<string, SearchSuggestion[]>()
    for (const suggestion of visible) {
      const key = suggestion.group ?? ""
      byGroup.set(key, [...(byGroup.get(key) ?? []), suggestion])
    }
    return [...byGroup.entries()].sort(([a], [b]) => (a === "" ? -1 : b === "" ? 1 : 0))
  }, [visible])

  // O teclado anda na ordem em que as sugestões aparecem na tela (já agrupadas).
  const ordered = React.useMemo(() => groups.flatMap(([, items]) => items), [groups])

  const positionById = React.useMemo(() => new Map(ordered.map((suggestion, index) => [suggestion.id, index])), [ordered])

  const isListOpen = open && canShowList

  React.useEffect(() => {
    if (!isListOpen) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [isListOpen])

  React.useEffect(() => {
    if (!isListOpen) return
    listRef.current?.querySelector(`#${CSS.escape(`${listboxId}-${activeIndex}`)}`)?.scrollIntoView?.({ block: "nearest" })
  }, [isListOpen, activeIndex, listboxId])

  React.useEffect(() => {
    if (!shortcutKey) return
    const focusOnShortcut = (event: KeyboardEvent) => {
      if (event.key !== shortcutKey || event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return
      event.preventDefault()
      inputRef.current?.focus()
    }
    document.addEventListener("keydown", focusOnShortcut)
    return () => document.removeEventListener("keydown", focusOnShortcut)
  }, [shortcutKey])

  const changeValue = (nextValue: string) => {
    onValueChange(nextValue)
    setActiveIndex(0)
    setOpen(true)
  }

  const clear = () => {
    onValueChange("")
    setOpen(false)
    inputRef.current?.focus()
  }

  const choose = (suggestion: SearchSuggestion) => {
    onSelect(suggestion)
    setOpen(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (!isListOpen) setOpen(true)
      else setActiveIndex((index) => Math.min(index + 1, ordered.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === "Enter") {
      event.preventDefault()
      const active = isListOpen ? ordered[activeIndex] : undefined
      if (active) choose(active)
      else if (value.trim()) {
        onSearch?.(value.trim())
        setOpen(false)
      }
    } else if (event.key === "Escape") {
      if (isListOpen) {
        event.preventDefault()
        setOpen(false)
      } else if (value) {
        event.preventDefault()
        clear()
      }
    } else if (event.key === "Tab") {
      setOpen(false)
    }
  }

  const activeOptionId = isListOpen && ordered[activeIndex] ? `${listboxId}-${activeIndex}` : undefined
  const showShortcutHint = Boolean(shortcutKey) && !value

  return (
    <div ref={containerRef} data-slot="search-autocomplete" className={cn("relative w-full", className)}>
      <div className="group relative">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          data-slot="search-autocomplete-input"
          type="text"
          role="combobox"
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-expanded={isListOpen}
          aria-controls={isListOpen ? listboxId : undefined}
          aria-activedescendant={activeOptionId}
          autoComplete="off"
          spellCheck={false}
          value={value}
          placeholder={placeholder}
          onChange={(event) => changeValue(event.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-10 w-full rounded-lg border border-input bg-background pr-16 pl-9 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1.5">
          {loading && <Spinner className="size-4 text-muted-foreground" />}
          {value && (
            <button
              type="button"
              aria-label="Limpar busca"
              onClick={clear}
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <XIcon className="size-3.5" aria-hidden="true" />
            </button>
          )}
          {showShortcutHint && (
            <kbd
              aria-hidden="true"
              className="hidden h-5 min-w-5 items-center justify-center rounded border bg-muted px-1.5 font-sans text-[11px] font-medium text-muted-foreground sm:inline-flex"
            >
              {shortcutKey}
            </kbd>
          )}
        </div>
      </div>

      {isListOpen && (
        <div
          data-slot="search-autocomplete-content"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg"
        >
          <div ref={listRef} id={listboxId} role="listbox" aria-label={ariaLabel} className="max-h-80 overflow-y-auto p-1.5">
            {ordered.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">{loading ? "Buscando…" : emptyMessage}</p>
            ) : (
              groups.map(([group, items]) => (
                <div key={group || "sem-grupo"} role="group" aria-label={group || undefined}>
                  {group && (
                    <p aria-hidden="true" className="px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {group}
                    </p>
                  )}
                  {items.map((suggestion) => {
                    const position = positionById.get(suggestion.id) ?? 0
                    const isActive = position === activeIndex
                    return (
                      <div
                        key={suggestion.id}
                        id={`${listboxId}-${position}`}
                        data-slot="search-autocomplete-item"
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActiveIndex(position)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => choose(suggestion)}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors select-none",
                          isActive && "bg-muted"
                        )}
                      >
                        {suggestion.icon && (
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&>svg]:size-4">
                            {suggestion.icon}
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">
                            <HighlightedText text={suggestion.label} query={value} />
                          </span>
                          {suggestion.description && (
                            <span className="block truncate text-xs text-muted-foreground">{suggestion.description}</span>
                          )}
                        </span>
                        {isActive && <CornerDownLeftIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />}
                      </div>
                    )
                  })}
                </div>
              ))
            )}
          </div>
          <div
            aria-hidden="true"
            className="hidden items-center gap-4 border-t bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground sm:flex"
          >
            <span>↑↓ navegar</span>
            <span>Enter escolher</span>
            <span>Esc fechar</span>
          </div>
        </div>
      )}
    </div>
  )
}

export { SearchAutocomplete }
