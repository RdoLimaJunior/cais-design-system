import {
  IconBrain,
  IconClipboardCheck,
  IconShoppingCart,
  IconLayoutDashboard,
  IconSettings,
  IconShieldCheck,
} from '@tabler/icons-react'
import type { SidebarNavItem } from '../farol/AppSidebar'

export type PmoRole = 'ADMIN' | 'GESTOR' | 'ANALISTA' | 'LEITOR'

export const PMO_ROLE_LABELS: Record<PmoRole, string> = {
  ADMIN: 'Administrador',
  GESTOR: 'Gestor',
  ANALISTA: 'Analista',
  LEITOR: 'Leitor',
}

interface PmoNavChild {
  label: string
  href: string
  roles: readonly PmoRole[]
  /** Página ainda não existe: o item aparece, mas não abre. */
  isDisabled?: boolean
}

interface PmoNavItem extends Omit<SidebarNavItem, 'children'> {
  /** Papéis que enxergam o item. O servidor continua sendo a barreira real (RBAC). */
  roles: readonly PmoRole[]
  children?: readonly PmoNavChild[]
}

const ALL_ROLES: readonly PmoRole[] = ['ADMIN', 'GESTOR', 'ANALISTA', 'LEITOR']
const OPERATIONAL_ROLES: readonly PmoRole[] = ['ADMIN', 'GESTOR', 'ANALISTA']

/**
 * Navegação do CAIS PMO no menu lateral do design system. Os grupos que o PMO atual tinha ("PROJETOS & RH",
 * "EXECUÇÃO & AUDITORIA") viram itens com páginas filhas, que o usuário abre e fecha. No PMO atual alguns destes
 * itens estão fora do menu (Plano de Trabalho, Folha RH, RH Matrix e Aportes) ou atrás de feature flag
 * (Janus IA e Auditoria); no novo front todos entram. A página Design System é substituída pelo Storybook.
 */
const PMO_NAV_ITEMS: readonly PmoNavItem[] = [
  { label: 'Janus IA', icon: IconBrain, href: '/app/janus', roles: ALL_ROLES },
  { label: 'Dashboard', icon: IconLayoutDashboard, href: '/app/dashboard', roles: ALL_ROLES },
  {
    label: 'Projetos e RH',
    icon: IconClipboardCheck,
    roles: ALL_ROLES,
    children: [
      { label: 'Projetos', href: '/app/projetos', roles: ALL_ROLES },
      { label: 'Colaboradores', href: '/app/colaboradores', roles: OPERATIONAL_ROLES },
      { label: 'Simulador RPA', href: '/app/simulador-rpa', roles: OPERATIONAL_ROLES },
      { label: 'Plano de Trabalho', href: '/app/orcamento', roles: ALL_ROLES },
      { label: 'Folha RH', href: '/app/folha-rh', roles: OPERATIONAL_ROLES },
      { label: 'RH Matrix', href: '/app/rh', roles: OPERATIONAL_ROLES },
    ],
  },
  {
    label: 'Execução e Auditoria',
    icon: IconShieldCheck,
    roles: OPERATIONAL_ROLES,
    children: [
      { label: 'Aportes', href: '/app/aportes', roles: OPERATIONAL_ROLES },
      { label: 'Auditoria', href: '/app/auditoria', roles: OPERATIONAL_ROLES },
    ],
  },
  {
    // Módulo SCSP: a estrutura do menu já existe, as páginas vêm depois. Os papéis do SCSP (Solicitante, Compras, Jurídico...)
    // ainda não foram mapeados para os do PMO; até lá, vale a regra provisória de Admin, Gestor e Analista.
    label: 'Compras e Serviços',
    icon: IconShoppingCart,
    roles: OPERATIONAL_ROLES,
    children: [
      { label: 'Todas as solicitações', href: '/app/compras/solicitacoes', roles: OPERATIONAL_ROLES, isDisabled: true },
      { label: 'Nova compra de produtos', href: '/app/compras/solicitacoes/nova-compra', roles: OPERATIONAL_ROLES, isDisabled: true },
      { label: 'Nova contratação de serviço', href: '/app/compras/solicitacoes/nova-contratacao', roles: OPERATIONAL_ROLES, isDisabled: true },
      { label: 'Alarmes de cobrança', href: '/app/compras/alarmes', roles: OPERATIONAL_ROLES, isDisabled: true },
      { label: 'Contratos e serviços', href: '/app/compras/contratos', roles: OPERATIONAL_ROLES, isDisabled: true },
      { label: 'Fornecedores', href: '/app/compras/fornecedores', roles: OPERATIONAL_ROLES, isDisabled: true },
    ],
  },
  { label: 'Configurações', icon: IconSettings, href: '/app/configuracoes', roles: ['ADMIN'] },
]

/** Itens do menu que o papel pode ver (RBAC: Leitor não enxerga Colaboradores nem salários). */
export function pmoNavItemsFor(role: PmoRole): SidebarNavItem[] {
  return PMO_NAV_ITEMS.filter((item) => item.roles.includes(role)).flatMap<SidebarNavItem>(({ label, icon, href, children }) => {
    if (!children) return [{ label, icon, href }]
    const visibleChildren = children.filter((child) => child.roles.includes(role))
    // Item com páginas filhas some quando o papel não vê nenhuma delas.
    return visibleChildren.length === 0
      ? []
      : [{ label, icon, children: visibleChildren.map((child) => ({ label: child.label, href: child.href, isDisabled: child.isDisabled })) }]
  })
}
