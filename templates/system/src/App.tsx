import { IconHome, IconListDetails } from '@tabler/icons-react'
import { Route, Routes, useLocation } from 'react-router'
import { AppLayout, PageCard, type SidebarNavItem } from '@cais/design-system'
import { useInternalLinks } from './useInternalLinks'

// Menu do sistema: troque pelos itens do seu domínio. Ícones: https://tabler.io/icons
const NAV_ITEMS: SidebarNavItem[] = [
  { label: 'Início', href: '/', icon: IconHome },
  { label: 'Exemplo', href: '/exemplo', icon: IconListDetails },
]

const USER_NAME = 'Nome da Pessoa'
const USER_ROLE = 'Perfil'

function Page({ title, children }: { title: string; children: string }) {
  const { pathname } = useLocation()

  return (
    <AppLayout
      frame="profile"
      breadcrumb={[{ label: 'Início', href: '/' }, { label: title }]}
      activeHref={pathname}
      userName={USER_NAME}
      userRole={USER_ROLE}
      navItems={NAV_ITEMS}
      homeHref="/"
      profileHref={null}
    >
      <PageCard title={title} subtitle="Página de exemplo do molde">
        <p className="text-sm text-zinc-500">{children}</p>
      </PageCard>
    </AppLayout>
  )
}

function App() {
  useInternalLinks()

  return (
    <Routes>
      <Route path="/" element={<Page title="Início">Substitua esta página pela tela inicial do sistema.</Page>} />
      <Route
        path="/exemplo"
        element={<Page title="Exemplo">Cada rota nova usa o AppLayout com o quadro (frame) que combina com a tela.</Page>}
      />
    </Routes>
  )
}

export default App
