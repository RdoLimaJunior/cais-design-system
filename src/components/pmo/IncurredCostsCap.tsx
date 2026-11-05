import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { formatPercent } from '../../lib/finance'
import { cn } from '../../lib/utils'

/** Limite legal de custos incorridos sobre a base de aportes (RN-EX03). */
export const INCURRED_COSTS_CAP_PERCENT = 20
/** A partir daqui o indicador avisa que a margem até o teto é pequena. */
export const INCURRED_COSTS_ALERT_PERCENT = 15

type BadgeVariant = NonNullable<React.ComponentProps<typeof Badge>['variant']>

function toneFor(percent: number | null): { badge: BadgeVariant; bar: string } {
  if (percent === null) return { badge: 'secondary', bar: '*:data-[slot=progress-indicator]:bg-muted-foreground' }
  if (percent > INCURRED_COSTS_CAP_PERCENT) {
    return { badge: 'destructive', bar: '*:data-[slot=progress-indicator]:bg-destructive' }
  }
  if (percent > INCURRED_COSTS_ALERT_PERCENT) {
    return { badge: 'warning', bar: '*:data-[slot=progress-indicator]:bg-warning' }
  }
  return { badge: 'success', bar: '*:data-[slot=progress-indicator]:bg-success' }
}

interface IncurredCostsCapProps {
  /** Percentual de custos incorridos sobre a base de aportes; `null` quando ainda não há base. */
  percent: number | null
  /** Conteúdo ao lado do título, por exemplo um ícone com `Tooltip` explicando o cálculo. */
  help?: React.ReactNode
}

/**
 * Indicador do teto de 20% de custos incorridos (RN-EX03). Verde até 15%, âmbar de 15% a 20%, vermelho acima de 20%.
 * A barra fica cheia quando chega ao teto e o texto abaixo diz o que fazer: a cor nunca é o único sinal.
 */
export function IncurredCostsCap({ percent, help }: IncurredCostsCapProps) {
  const tone = toneFor(percent)
  const isOver = percent !== null && percent > INCURRED_COSTS_CAP_PERCENT
  const isWarning = percent !== null && percent > INCURRED_COSTS_ALERT_PERCENT
  const barValue = percent !== null ? Math.min((percent / INCURRED_COSTS_CAP_PERCENT) * 100, 100) : 0

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="inline-flex items-center gap-1.5">
          Teto de Incorridos (RN-EX03 — máx. {INCURRED_COSTS_CAP_PERCENT}%)
          {help}
        </CardTitle>
        <Badge variant={tone.badge}>{percent !== null ? formatPercent(percent, 2) : '—'}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={barValue} className={cn('h-3 bg-muted', tone.bar)} aria-label="Uso do teto de incorridos" />
        {isWarning && (
          <p className={cn('text-sm', isOver ? 'text-destructive' : 'text-warning')}>
            {isOver
              ? 'Teto ultrapassado — novos incorridos serão bloqueados pelo servidor.'
              : `Atenção: acima de ${INCURRED_COSTS_ALERT_PERCENT}%. Margem pequena até o teto de ${INCURRED_COSTS_CAP_PERCENT}%.`}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
