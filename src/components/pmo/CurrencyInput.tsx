import { Input } from '../ui/input'
import { readReais } from '../../lib/finance'

interface CurrencyInputProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type' | 'max'> {
  /** Valor em reais (por exemplo 1234.56). A máscara cuida só da exibição. */
  value: number
  onChange: (valueInReais: number) => void
  /** Aceita valor negativo (descontos): a tecla "-" alterna o sinal. */
  allowNegative?: boolean
  /** Mostra só o número ("1.234,56"), para células de tabela cuja coluna já é em reais. */
  hideSymbol?: boolean
  /** Valor máximo em reais; digitar além dele é ignorado. */
  max?: number
}

function formatCents(cents: number, hideSymbol: boolean): string {
  return (cents / 100).toLocaleString('pt-BR', {
    ...(hideSymbol ? {} : { style: 'currency', currency: 'BRL' }),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Campo de valor monetário. Os dígitos entram pela direita (como em caixa eletrônico), sempre com 2 casas;
 * só aceita número. Colar um texto segue a regra brasileira (vírgula decimal, ponto de milhar).
 */
export function CurrencyInput({
  value,
  onChange,
  allowNegative,
  hideSymbol = false,
  max,
  ...props
}: CurrencyInputProps) {
  const isNegative = allowNegative && value < 0
  const text = (isNegative ? '-' : '') + formatCents(Math.round(Math.abs(value) * 100), hideSymbol)

  const limit = (reais: number) => (max !== undefined ? Math.min(reais, max) : reais)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, '')
    const reais = limit((digits ? parseInt(digits, 10) : 0) / 100)
    onChange(isNegative ? -reais : reais)
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text')
    const reais = limit(readReais(pasted))
    onChange(allowNegative && pasted.trim().startsWith('-') ? -reais : reais)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (allowNegative && event.key === '-') {
      event.preventDefault()
      onChange(-value)
    }
    props.onKeyDown?.(event)
  }

  return (
    <Input
      inputMode="numeric"
      autoComplete="off"
      {...props}
      value={text}
      onChange={handleChange}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onFocus={(event) => {
        event.target.select()
        props.onFocus?.(event)
      }}
    />
  )
}
