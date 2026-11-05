import { Badge } from '../ui/badge'

export type Health = 'green' | 'yellow' | 'red'

const HEALTH: Record<Health, { label: string; variant: 'success' | 'warning' | 'destructive' }> = {
  green: { label: 'Saudável', variant: 'success' },
  yellow: { label: 'Atenção', variant: 'warning' },
  red: { label: 'Crítico', variant: 'destructive' },
}

/** Selo da saúde do projeto. O texto diz a situação; a cor só reforça. */
export function HealthBadge({ health }: { health: Health }) {
  return <Badge variant={HEALTH[health].variant}>{HEALTH[health].label}</Badge>
}
