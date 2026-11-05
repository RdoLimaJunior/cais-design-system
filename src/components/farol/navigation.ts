import { IconFileAnalytics, IconHome, IconUser, IconUsers } from '@tabler/icons-react'
import type { SidebarNavItem } from './AppSidebar'

/** Visão do bolsista, como está em produção. */
export const SCHOLARSHIP_NAV_ITEMS: SidebarNavItem[] = [
  { label: 'Home', href: '/home', icon: IconHome },
  { label: 'Meu Perfil', href: '/perfil', icon: IconUser },
  { label: 'Meus Relatórios', href: '/meus-relatorios', icon: IconFileAnalytics },
]

/** Visão do administrador/RH, conforme o Figma; as rotas vêm do código público do site. */
export const ADMIN_NAV_ITEMS: SidebarNavItem[] = [
  { label: 'Home', href: '/home', icon: IconHome },
  { label: 'Meu Perfil', href: '/perfil', icon: IconUser },
  {
    label: 'Gestão de Pessoas',
    icon: IconUsers,
    children: [
      { label: 'Ver Todos os Colaboradores', href: '/rh/colaboradores' },
      { label: 'Adicionar Colaboradores', href: '/rh/colaboradores/adicionar' },
      { label: 'Relatórios de Bolsistas', href: '/rh/relatorios-bolsistas' },
      { label: 'Termos', href: '/rh/termos' },
    ],
  },
  {
    label: 'Gestão de Projetos',
    icon: IconFileAnalytics,
    children: [
      { label: 'Ver Todos os Projetos', href: '/rh/projetos' },
      { label: 'Adicionar Projeto', href: '/rh/projetos/adicionar' },
    ],
  },
]
