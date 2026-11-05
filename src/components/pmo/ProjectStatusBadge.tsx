import { Badge } from '../ui/badge'

export type ProjectStatus = 'Planejamento' | 'Execução'

interface ProjectStatusBadgeProps {
  status: ProjectStatus
  /** Projeto arquivado é somente leitura (RN-EX04). É um atributo à parte do status. */
  archived?: boolean
}

/**
 * Selo do status do projeto. O status tem só dois valores (Planejamento e Execução); "Arquivado" aparece ao lado,
 * porque um projeto pode estar em execução e arquivado ao mesmo tempo.
 */
export function ProjectStatusBadge({ status, archived = false }: ProjectStatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <Badge variant={status === 'Execução' ? 'default' : 'outline'}>{status}</Badge>
      {archived && <Badge variant="secondary">Arquivado</Badge>}
    </span>
  )
}
