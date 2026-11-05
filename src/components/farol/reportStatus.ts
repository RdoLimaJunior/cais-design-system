import type { MockReport } from '../../mocks/scholarship'
import type { StatusTagTone } from './StatusTag'

/** Rótulo e tom de cada status de relatório; usado pela aba Relatórios e por Meus relatórios. */
export const REPORT_STATUS: Record<MockReport['status'], { label: string; tone: StatusTagTone }> = {
  'not-started': { label: 'Não iniciado', tone: 'info' },
  completed: { label: 'Concluído', tone: 'success' },
}
