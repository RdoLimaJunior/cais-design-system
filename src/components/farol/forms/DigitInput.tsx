import { Fragment, useRef, type ClipboardEvent, type KeyboardEvent } from 'react'
import { cn } from '../../../lib/utils'

const DIGIT_BOX_CLASSES =
  'h-8 w-5 text-sm border-r border-zinc-300 bg-transparent text-center font-medium text-zinc-900 outline-none last:border-r-0 focus:bg-sky-50 focus:ring-2 focus:ring-[#0089e2] focus:ring-inset disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:opacity-70'

export interface DigitInputProps {
  /** Usado no `id` do primeiro campo e no rótulo de acessibilidade de cada dígito ("cpf dígito 1"). */
  name: string
  value: string
  /** Quantidade de caixas de cada grupo; grupos são separados por um hífen. */
  groups: number[]
  onChange: (value: string) => void
  inputMode?: 'numeric' | 'tel'
  autoComplete?: string
  isDisabled?: boolean
  hasError?: boolean
}

function toDigits(text: string): string {
  return text.replace(/\D/g, '')
}

/** Campo de um dígito por caixa (CPF, telefone, CEP): digitar avança, apagar volta, colar preenche. */
export function DigitInput({
  name,
  value,
  groups,
  onChange,
  inputMode = 'numeric',
  autoComplete = 'off',
  isDisabled = false,
  hasError = false,
}: DigitInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const totalDigits = groups.reduce((sum, size) => sum + size, 0)

  function focusBox(index: number) {
    inputRefs.current[Math.min(Math.max(index, 0), totalDigits - 1)]?.focus()
  }

  function replaceDigitsFrom(index: number, newDigits: string) {
    const current = value.padEnd(totalDigits, ' ').split('')
    newDigits.split('').forEach((digit, offset) => {
      if (index + offset < totalDigits) current[index + offset] = digit
    })
    onChange(current.join('').trimEnd().replace(/ /g, ''))
    focusBox(index + newDigits.length)
  }

  function handleInput(index: number, typed: string) {
    const digits = toDigits(typed)
    if (!digits) {
      const current = value.split('')
      current.splice(index, 1)
      onChange(current.join(''))
      return
    }
    replaceDigitsFrom(Math.min(index, value.length), digits.slice(-1))
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !value[index]) {
      event.preventDefault()
      const current = value.split('')
      current.splice(index - 1, 1)
      onChange(current.join(''))
      focusBox(index - 1)
    }
    if (event.key === 'ArrowLeft') focusBox(index - 1)
    if (event.key === 'ArrowRight') focusBox(index + 1)
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    replaceDigitsFrom(Math.min(index, value.length), toDigits(event.clipboardData.getData('text')))
  }

  let boxIndex = 0
  return (
    <div className="mt-1 flex w-fit items-center gap-2">
      {groups.map((size, groupIndex) => (
        <Fragment key={groupIndex}>
          <span className="flex items-center gap-2">
            {groupIndex > 0 && <span className="text-xs text-zinc-500">-</span>}
            <span className="flex overflow-hidden rounded border border-zinc-300 bg-white">
              {Array.from({ length: size }, () => {
                const index = boxIndex++
                return (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element
                    }}
                    id={index === 0 ? name : undefined}
                    inputMode={inputMode}
                    autoComplete={autoComplete}
                    maxLength={1}
                    disabled={isDisabled}
                    readOnly={isDisabled}
                    aria-label={`${name} dígito ${index + 1}`}
                    aria-invalid={hasError}
                    className={cn(DIGIT_BOX_CLASSES)}
                    value={value[index] ?? ''}
                    onChange={(event) => handleInput(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={(event) => handlePaste(index, event)}
                  />
                )
              })}
            </span>
          </span>
        </Fragment>
      ))}
    </div>
  )
}
