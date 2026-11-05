import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { HelpTip } from './HelpTip'

interface StatCardProps {
  label: string
  value: string
  /** Explicação curta do número, mostrada na dica ao lado do rótulo. */
  help?: string
}

/** Cartão de indicador: rótulo pequeno e número grande. */
export function StatCard({ label, value, help }: StatCardProps) {
  return (
    <Card className="gap-2 py-4">
      <CardHeader className="gap-0">
        <CardTitle className="flex items-center gap-1.5 text-sm font-normal text-muted-foreground">
          {label}
          {help && <HelpTip text={help} />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  )
}
