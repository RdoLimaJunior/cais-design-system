/** Formatação e leitura de valores financeiros em reais (regra brasileira: vírgula decimal, ponto de milhar). */

export function formatCurrency(value: number | string): string {
  const number = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}

export function formatPercent(value: number | string, decimals = 1): string {
  const number = typeof value === 'string' ? parseFloat(value) : value
  return (
    number.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + '%'
  )
}

/**
 * Lê um texto colado como valor em reais: a vírgula é o decimal e o ponto separa milhar ("1.234,56" vira 1234.56).
 * Sem vírgula, um único ponto com até 2 dígitos depois é decimal ("1234.5" vira 1234.50); qualquer outro ponto é milhar.
 * Texto sem dígitos vale 0.
 */
export function readReais(text: string): number {
  const clean = text.replace(/[^\d.,]/g, '')
  if (!clean) return 0
  let integerPart = clean
  let decimalPart = ''
  const commaIndex = clean.lastIndexOf(',')
  if (commaIndex >= 0) {
    integerPart = clean.slice(0, commaIndex)
    decimalPart = clean.slice(commaIndex + 1)
  } else {
    const dotIndex = clean.lastIndexOf('.')
    const isSingleDot = clean.indexOf('.') === dotIndex
    if (dotIndex >= 0 && isSingleDot && clean.length - dotIndex - 1 <= 2) {
      integerPart = clean.slice(0, dotIndex)
      decimalPart = clean.slice(dotIndex + 1)
    }
  }
  const integerDigits = integerPart.replace(/\D/g, '') || '0'
  const decimalDigits = decimalPart.replace(/\D/g, '').slice(0, 2).padEnd(2, '0')
  return Math.round(Number(`${integerDigits}${decimalDigits}`)) / 100
}
