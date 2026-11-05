import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconMenu2 } from '@tabler/icons-react'
import logoUrl from '../../assets/farol/logo-cais.png'
import { useMediaQuery } from '../../lib/useMediaQuery'
import {
  PREVIEW_ZOOM_ATTRIBUTE,
  changeFontScale,
  setHighContrast,
  setTheme,
  useAccessibilityPreferences,
} from '../../lib/accessibilityPreferences'
import { writeStoredValue } from '../../lib/browserStorage'
import { AppSidebar, SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_EXPANDED_WIDTH, type SidebarNavItem } from './AppSidebar'
import {
  FONT_SCALE_STEP,
  SIDEBAR_COLLAPSED_STORAGE_KEY,
  readStoredSidebarCollapsed,
} from './fontScale'
import { LogoutDialog } from './LogoutDialog'
import { PageBreadcrumb, type BreadcrumbItem, type BreadcrumbVariant } from './PageBreadcrumb'

export type UserRole = 'scholar' | 'admin'

const SIDEBAR_PORTAL_ROOT_ID = 'sidebar-portal-root'
const APP_ROOT_ID = 'root'
/** Abaixo de 768 px (antes da faixa tablet) o menu vira gaveta. */
const MOBILE_QUERY = '(max-width: 47.99rem)'

/**
 * O FAROL não tem um layout único: cada família de telas monta a própria casca,
 * com espaçamentos (e até cor de fundo) diferentes. Cada nome abaixo copia uma delas.
 */
export type AppFrame = 'home' | 'profile' | 'profile-edit' | 'document' | 'reports-list' | 'report-detail'

export interface AppLayoutProps {
  frame?: AppFrame
  breadcrumb: BreadcrumbItem[]
  breadcrumbVariant?: BreadcrumbVariant
  activeHref: string
  userName: string
  /** Menu próprio do sistema; sem isso, usa o menu do estilo (Bolsista ou Administrador). */
  navItems?: SidebarNavItem[]
  /** Rótulo do perfil; sem isso, usa o do estilo. */
  userRole?: string
  /** Nome do sistema, citado no modal de sair. Padrão: Farol. */
  systemName?: string
  /** Destino do logo e do nome da pessoa no menu (padrão: rotas do FAROL). */
  homeHref?: string
  profileHref?: string | null
  /** @deprecated Sem efeito: o papel no menu é só um texto informativo e não alterna por clique. */
  hasRoleToggle?: boolean
  /** Visão atual. Sem este valor, o layout guarda a visão internamente. */
  role?: UserRole
  initialRole?: UserRole
  /** @deprecated Sem efeito: o papel no menu é só um texto informativo e não alterna por clique. */
  onRoleChange?: (role: UserRole) => void
  onLogout?: () => void
  children: ReactNode
}

interface FrameProps {
  style: CSSProperties
  breadcrumb: ReactNode
  children: ReactNode
}

function HomeFrame({ style, breadcrumb, children }: FrameProps) {
  return (
    <main className="min-h-dvh bg-[#e3e6eb] font-sans text-zinc-950" style={style}>
      <div className="flex min-h-dvh">
        <section className="md:ml-(--sidebar-width,160px) min-w-0 flex-1 px-6 pt-8 pr-8 pb-16 transition-[margin] duration-200">
          <div className="w-full">{breadcrumb}</div>
          <div className="w-full space-y-3.5">{children}</div>
        </section>
      </div>
    </main>
  )
}

function SectionFrame({ style, breadcrumb, children, sectionClassName }: FrameProps & { sectionClassName: string }) {
  return (
    <main className="min-h-dvh bg-[#e3e6eb] font-sans text-zinc-950" style={style}>
      <section className={sectionClassName}>
        {breadcrumb}
        {children}
      </section>
    </main>
  )
}

function ProfileFrame(props: FrameProps) {
  return (
    <SectionFrame
      {...props}
      sectionClassName="md:ml-[var(--sidebar-width,160px)] min-h-dvh px-6 pt-8 pr-8 pb-2 transition-[margin] duration-200"
    />
  )
}

function ProfileEditFrame(props: FrameProps) {
  return (
    <SectionFrame
      {...props}
      sectionClassName="md:ml-[var(--sidebar-width,250px)] min-h-dvh px-6 pt-4 pr-8 pb-8 transition-[margin] duration-200"
    />
  )
}

function DocumentFrame(props: FrameProps) {
  return (
    <SectionFrame
      {...props}
      sectionClassName="md:ml-[var(--sidebar-width,250px)] min-h-dvh px-6 pt-8 pr-8 transition-[margin] duration-200"
    />
  )
}

function ReportsListFrame({ style, breadcrumb, children }: FrameProps) {
  return (
    <div className="flex min-h-screen bg-[#e3e6eb] font-sans text-zinc-950" style={style}>
      <main className="md:ml-(--sidebar-width,160px) min-w-0 flex-1 p-8 transition-[margin] duration-200">
        {breadcrumb}
        {children}
      </main>
    </div>
  )
}

function ReportDetailFrame({ style, breadcrumb, children }: FrameProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#E5E7EB] font-sans text-zinc-950" style={style}>
      <main className="md:ml-(--sidebar-width,250px) flex min-w-0 flex-1 flex-col gap-4 p-6 transition-[margin] duration-200">
        {breadcrumb}
        {children}
      </main>
    </div>
  )
}

const FRAMES: Record<AppFrame, (props: FrameProps) => ReactNode> = {
  home: HomeFrame,
  profile: ProfileFrame,
  'profile-edit': ProfileEditFrame,
  document: DocumentFrame,
  'reports-list': ReportsListFrame,
  'report-detail': ReportDetailFrame,
}

const DEFAULT_BREADCRUMB_VARIANTS: Record<AppFrame, BreadcrumbVariant> = {
  home: 'plain',
  profile: 'profile',
  'profile-edit': 'edit',
  document: 'document',
  'reports-list': 'reports-list',
  'report-detail': 'report-detail',
}

export function AppLayout({
  frame = 'home',
  breadcrumb,
  breadcrumbVariant,
  activeHref,
  userName,
  navItems,
  userRole,
  systemName,
  homeHref,
  profileHref,
  role,
  initialRole = 'scholar',
  onLogout,
  children,
}: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(readStoredSidebarCollapsed)
  const { fontScale, isHighContrast, theme } = useAccessibilityPreferences()
  const [internalRole] = useState<UserRole>(initialRole)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const isEffectivelyCollapsed = isCollapsed && !isMobile

  const currentRole = role ?? internalRole
  const sidebarWidth = isEffectivelyCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH
  const Frame = FRAMES[frame]

  // No site, o zoom vai em #root e a sidebar fica num portal fora dele. Fora do site (Storybook), o zoom vai no quadro.
  const appRoot = document.getElementById(APP_ROOT_ID)
  const sidebarPortalRoot = document.getElementById(SIDEBAR_PORTAL_ROOT_ID)
  const isZoomAppliedOutside = Boolean(appRoot) || document.documentElement.hasAttribute(PREVIEW_ZOOM_ATTRIBUTE)
  const frameStyle = { ...(isZoomAppliedOutside ? {} : { zoom: fontScale }), '--sidebar-width': sidebarWidth } as CSSProperties

  useEffect(() => {
    if (!appRoot) return
    appRoot.style.zoom = String(fontScale)
    return () => {
      appRoot.style.zoom = ''
    }
  }, [appRoot, fontScale])

  // Esc fecha a gaveta do menu no celular.
  useEffect(() => {
    if (!isMobileMenuOpen) return
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMobileMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    // A gaveta fica por cima da página (não a empurra) e a página atrás não rola enquanto ela está aberta.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileMenuOpen])

  function toggleCollapsed() {
    const nextValue = !isCollapsed
    setIsCollapsed(nextValue)
    writeStoredValue(SIDEBAR_COLLAPSED_STORAGE_KEY, String(nextValue))
  }

  const sidebarElement = (
    <AppSidebar
      variant={currentRole}
      navItems={navItems}
      userRole={userRole}
      homeHref={homeHref}
      profileHref={profileHref}
      activeHref={activeHref}
      userName={userName}
      isCollapsed={isEffectivelyCollapsed}
      isMobileDrawer={isMobile}
      isMobileOpen={isMobileMenuOpen}
      onCloseMobile={() => setIsMobileMenuOpen(false)}
      onToggleCollapse={toggleCollapsed}
      fontScale={fontScale}
      isHighContrastEnabled={isHighContrast}
      isDarkTheme={theme === 'dark'}
      onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      onIncreaseFont={() => changeFontScale(FONT_SCALE_STEP)}
      onDecreaseFont={() => changeFontScale(-FONT_SCALE_STEP)}
      onToggleHighContrast={() => setHighContrast(!isHighContrast)}
      onLogout={() => setIsLogoutDialogOpen(true)}
    />
  )
  const sidebar = sidebarPortalRoot ? createPortal(sidebarElement, sidebarPortalRoot) : sidebarElement

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex h-12 items-center gap-3 border-b border-zinc-300 bg-[#e3e6eb] px-4 md:hidden">
        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex size-9 items-center justify-center rounded-sm text-zinc-950 hover:bg-white/70"
        >
          <IconMenu2 className="size-5 stroke-[1.6]" aria-hidden="true" />
        </button>
        <img alt="Instituto CAIS" className="h-auto w-28 object-contain" src={logoUrl} />
      </header>
      <div className="h-12 md:hidden" aria-hidden="true" />
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" aria-hidden="true" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <Frame
        style={frameStyle}
        breadcrumb={
          breadcrumb.length > 0 ? (
            <PageBreadcrumb items={breadcrumb} variant={breadcrumbVariant ?? DEFAULT_BREADCRUMB_VARIANTS[frame]} />
          ) : null
        }
      >
        {children}
      </Frame>
      {sidebar}
      <LogoutDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen} onConfirm={onLogout} systemName={systemName} />
    </>
  )
}
