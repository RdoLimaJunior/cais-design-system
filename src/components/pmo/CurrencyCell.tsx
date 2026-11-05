import { TableCell } from '../ui/table'
import { formatCurrency } from '../../lib/finance'
import { cn } from '../../lib/utils'

interface CurrencyCellProps {
  value: number | string
  /** Negrito, para linhas de total. */
  strong?: boolean
  redIfNegative?: boolean
  /** Zero aparece como "—" para a grade não ficar poluída de "R$ 0,00". */
  zeroAsDash?: boolean
  className?: string
  /** Passe para células editáveis; o campo de edição é o `CurrencyInput`. */
  onClick?: () => void
}

/** Célula de valor em reais: "R$ 1.234,56", alinhada à direita, com dígitos de largura fixa. */
export function CurrencyCell({
  value,
  strong = false,
  redIfNegative = false,
  zeroAsDash = true,
  className,
  onClick,
}: CurrencyCellProps) {
  const number = typeof value === 'string' ? parseFloat(value) : value
  const showDash = zeroAsDash && number === 0
  return (
    <TableCell
      onClick={onClick}
      className={cn(
        'text-right tabular-nums',
        strong && 'font-bold',
        redIfNegative && number < 0 && 'text-destructive',
        className,
      )}
    >
      {showDash ? <span className="text-muted-foreground">—</span> : formatCurrency(number)}
    </TableCell>
  )
}
