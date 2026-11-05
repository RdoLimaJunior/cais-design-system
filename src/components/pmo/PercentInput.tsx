import { useState } from 'react'
import { Input } from '../ui/input'

interface PercentInputProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type'> {
  /** Valor percentual (por exemplo 10.4 para "10,4%"). */
  value: number
  onChange: (value: number) => void
  /** Casas decimais aceitas na digitação. Padrão 2, a mesma precisão que o servidor grava. */
  decimals?: number
}

function toNumber(text: string): number {
  const number = Number(text.replace(',', '.'))
  return text === '' || Number.isNaN(number) ? 0 : number
}

function toText(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return ''
  return String(Number(value.toFixed(decimals))).replace('.', ',')
}

/**
 * Campo percentual que trava a quantidade de casas decimais digitadas. O `step` de um `<input type="number">`
 * não impede digitar "10,12345678"; aqui a tecla que estouraria a precisão é ignorada.
 */
export function PercentInput({ value, onChange, decimals = 2, ...props }: PercentInputProps) {
  const [text, setText] = useState(() => toText(value, decimals))
  const [lastValue, setLastValue] = useState(value)

  // Se o valor muda por fora (por exemplo "Restaurar padrão"), o texto acompanha; no meio da digitação não briga.
  if (value !== lastValue) {
    setLastValue(value)
    if (toNumber(text) !== value) setText(toText(value, decimals))
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const typed = event.target.value
    const allowed = new RegExp(`^\\d*([,.]\\d{0,${decimals}})?$`)
    if (typed !== '' && !allowed.test(typed)) return
    setText(typed)
    onChange(toNumber(typed))
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    setText(toText(value, decimals))
    props.onBlur?.(event)
  }

  return <Input inputMode="decimal" value={text} onChange={handleChange} {...props} onBlur={handleBlur} />
}
