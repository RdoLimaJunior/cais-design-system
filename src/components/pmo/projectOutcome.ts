/** `null`: ainda carregando. `undefined`: indisponível para este perfil ou a consulta falhou. */
export type ProjectMoney = number | null | undefined

export type ProjectOutcome = 'positive' | 'negative'

/** Desfecho do projeto pelo saldo final projetado; `undefined` enquanto carrega ou quando o valor não está disponível. */
export function outcomeOf(projectedFinalBalance: ProjectMoney): ProjectOutcome | undefined {
  if (typeof projectedFinalBalance !== 'number') return undefined
  return projectedFinalBalance >= 0 ? 'positive' : 'negative'
}
