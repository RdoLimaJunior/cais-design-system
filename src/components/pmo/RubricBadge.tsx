import { Badge } from '../ui/badge'

type BadgeVariant = NonNullable<React.ComponentProps<typeof Badge>['variant']>

export const RUBRIC_GROUPS = {
  HR: ['RH Direto', 'RH Indireto'],
  OTHER_EXPENSES: [
    'Equipamentos e Software',
    'Obras Civis',
    'Livros e Periódicos Técnicos',
    'Material de Consumo para Protótipos',
    'Viagens',
    'Treinamento',
    'Serviços de Terceiros - Tecnológicos',
    'Serviços de Terceiros - Outros',
    'Outros Correlatos',
  ],
  INCURRED_COSTS: [
    'Taxa Administrativa do Instituto',
    'Fundo de Reserva (P&D)',
    'Custos Administrativos / Projetos Conveniados',
  ],
} as const

// RH usa o azul de marca; as demais despesas ficam neutras; Custos Incorridos usa o âmbar de atenção, porque é o
// grupo sujeito ao teto de 20% (RN-EX03).
function variantFor(rubric: string): BadgeVariant {
  if ((RUBRIC_GROUPS.HR as readonly string[]).includes(rubric)) return 'default'
  if ((RUBRIC_GROUPS.INCURRED_COSTS as readonly string[]).includes(rubric)) return 'warning'
  return 'secondary'
}

/** Selo da rubrica, colorido pelo grupo a que ela pertence. */
export function RubricBadge({ rubric }: { rubric: string }) {
  return <Badge variant={variantFor(rubric)}>{rubric}</Badge>
}
