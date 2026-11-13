import { useId, useState, type ComponentType } from 'react'
import {
  IconChevronDown,
  IconChevronUp,
  IconContrast,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMoon,
  IconPower,
  IconSun,
  IconX,
  type TablerIcon,
} from '@tabler/icons-react'
import { AArrowDown, AArrowUp } from 'lucide-react'
import faviconUrl from '../../assets/farol/favicon.png'
import logoUrl from '../../assets/farol/logo-cais.png'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { canDecreaseFont, canIncreaseFont } from '../../lib/accessibilityPreferences'
import { readStoredValue, writeStoredValue } from '../../lib/browserStorage'
import { ADMIN_NAV_ITEMS, SCHOLARSHIP_NAV_ITEMS } from './navigation'

export const SIDEBAR_EXPANDED_WIDTH = '250px'
export const SIDEBAR_COLLAPSED_WIDTH = '3.5rem'

const NAV_ITEM_CLASSES =
  'flex h-6 w-full items-center rounded-sm px-1 text-left text-xs leading-5 tracking-wide text-zinc-950 transition hover:bg-white/70'
const SIDEBAR_SCROLLBAR_CLASSES =
  '[scrollbar-color:#a1a1aa_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-400 [&::-webkit-scrollbar-track]:bg-transparent'
const ICON_CLASSES = 'size-4 stroke-[1.6]'

export interface SidebarSubitem {
  label: string
  href: string
  /** Mostra o item sem permitir o clique (página ainda não existe). */
  isDisabled?: boolean
}

export interface SidebarNavItem {
  label: string
  icon: TablerIcon
  /** Itens com submenu não têm destino próprio; o primeiro submenu é usado quando o menu está recolhido. */
  href?: string
  children?: SidebarSubitem[]
}

/** Os dois estilos do menu: `scholar` (Bolsista, 3 itens) e `admin` (Administrador, com submenus e alto contraste). */
export type SidebarVariant = 'scholar' | 'admin'

const NAV_ITEMS_BY_VARIANT: Record<SidebarVariant, SidebarNavItem[]> = {
  scholar: SCHOLARSHIP_NAV_ITEMS,
  admin: ADMIN_NAV_ITEMS,
}

const ROLE_LABEL_BY_VARIANT: Record<SidebarVariant, string> = {
  scholar: 'Bolsista',
  admin: 'Administrador',
}

export interface AppSidebarProps {
  variant?: SidebarVariant
  /** Substitui os itens padrão do estilo; use em sistemas com menu próprio. */
  navItems?: SidebarNavItem[]
  activeHref: string
  userName: string
  /** Destino do logo. Padrão: a Home do FAROL. */
  homeHref?: string
  /** Destino do nome da pessoa. Padrão: o perfil do FAROL; `null` mostra o nome sem link. */
  profileHref?: string | null
  /** Substitui o rótulo padrão do estilo ("Bolsista" ou "Administrador"). */
  userRole?: string
  isCollapsed?: boolean
  /** Abaixo de tablet o menu vira uma gaveta que desliza sobre a página, sempre expandida. */
  isMobileDrawer?: boolean
  isMobileOpen?: boolean
  onCloseMobile?: () => void
  /** Mostra "Ativar Alto Contraste". Por padrão, aparece no estilo `admin` quando `onToggleHighContrast` é passado. */
  hasHighContrastToggle?: boolean
  isHighContrastEnabled?: boolean
  /** Mostra "Tema escuro" quando `onToggleTheme` é passado. */
  isDarkTheme?: boolean
  onToggleTheme?: () => void
  /** Escala atual da fonte (1 a 1,3); sem ela, os botões de fonte ficam sempre ativos. */
  fontScale?: number
  onToggleCollapse?: () => void
  onIncreaseFont?: () => void
  onDecreaseFont?: () => void
  onToggleHighContrast?: () => void
  onLogout?: () => void
}

type AccessibilityIcon = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>

interface AccessibilityButtonProps {
  label: string
  icon: AccessibilityIcon
  isCollapsed: boolean
  isPressed?: boolean
  isDisabled?: boolean
  onClick?: () => void
}

function AccessibilityButton({ label, icon: Icon, isCollapsed, isPressed, isDisabled, onClick }: AccessibilityButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isPressed}
      disabled={isDisabled}
      title={isCollapsed ? label : undefined}
      aria-label={isCollapsed ? label : undefined}
      className={cn(NAV_ITEM_CLASSES, 'min-h-6 disabled:cursor-not-allowed disabled:opacity-50', isCollapsed ? 'justify-center' : 'gap-2')}
    >
      <Icon className={ICON_CLASSES} aria-hidden />
      {!isCollapsed && <span>{label}</span>}
    </button>
  )
}

function getItemHref(item: SidebarNavItem): string | undefined {
  return item.href ?? item.children?.find((child) => !child.isDisabled)?.href
}

function isItemActive(item: SidebarNavItem, activeHref: string): boolean {
  return item.href === activeHref
}

const OPEN_SUBMENU_STORAGE_PREFIX = 'cais-sidebar-open:'

function SidebarNavLink({ item, activeHref, isCollapsed }: { item: SidebarNavItem; activeHref: string; isCollapsed: boolean }) {
  const Icon = item.icon
  const submenuId = useId()
  const hasChildren = Boolean(item.children?.length)
  const isActive = isItemActive(item, activeHref) || Boolean(item.children?.some((child) => child.href === activeHref))
  // As páginas filhas começam abertas; quem fecha uma lista a vê fechada na próxima visita.
  const [isOpen, setIsOpen] = useState(() => readStoredValue(OPEN_SUBMENU_STORAGE_PREFIX + item.label) !== 'false')

  function toggleSubmenu() {
    const next = !isOpen
    setIsOpen(next)
    writeStoredValue(OPEN_SUBMENU_STORAGE_PREFIX + item.label, String(next))
  }

  // Recolhido, só o ícone aparece e ele leva à primeira página filha; sem nenhuma filha ativa, ele não leva a lugar nenhum.
  if (hasChildren && isCollapsed && !getItemHref(item)) {
    return (
      <span
        aria-disabled="true"
        title={item.label}
        className={cn(NAV_ITEM_CLASSES, 'cursor-not-allowed justify-center opacity-50 hover:bg-transparent')}
      >
        <Icon className={ICON_CLASSES} />
      </span>
    )
  }

  if (!hasChildren || isCollapsed) {
    return (
      <a
        href={getItemHref(item)}
        aria-current={isItemActive(item, activeHref) ? 'page' : undefined}
        title={isCollapsed ? item.label : undefined}
        className={cn(NAV_ITEM_CLASSES, isCollapsed ? 'justify-center' : 'gap-2', isActive && 'font-bold')}
      >
        <Icon className={ICON_CLASSES} />
        {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
      </a>
    )
  }

  return (
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={submenuId}
        onClick={toggleSubmenu}
        className={cn(NAV_ITEM_CLASSES, 'justify-between gap-2', isActive && 'font-bold')}
      >
        <span className="flex items-center gap-2">
          <Icon className={ICON_CLASSES} />
          <span className="whitespace-nowrap">{item.label}</span>
        </span>
        {isOpen ? <IconChevronUp className={ICON_CLASSES} aria-hidden /> : <IconChevronDown className={ICON_CLASSES} aria-hidden />}
      </button>
      <div id={submenuId} hidden={!isOpen} className="ml-3 space-y-0.5 border-l border-zinc-950 pl-3">
        {item.children?.map((child) => {
          const isChildActive = child.href === activeHref
          if (child.isDisabled) {
            return (
              <span key={child.href} aria-disabled="true" className={cn(NAV_ITEM_CLASSES, 'cursor-not-allowed opacity-50 hover:bg-transparent')}>
                <span className="whitespace-nowrap">{child.label}</span>
              </span>
            )
          }
          return (
            <a
              key={child.href}
              href={child.href}
              aria-current={isChildActive ? 'page' : undefined}
              className={cn(NAV_ITEM_CLASSES, isChildActive && 'font-bold')}
            >
              <span className="whitespace-nowrap">{child.label}</span>
            </a>
          )
        })}
      </div>
    </>
  )
}

export function AppSidebar({
  variant = 'scholar',
  navItems = NAV_ITEMS_BY_VARIANT[variant],
  activeHref,
  userName,
  homeHref = '/home',
  profileHref = '/perfil',
  userRole = ROLE_LABEL_BY_VARIANT[variant],
  isCollapsed = false,
  isMobileDrawer = false,
  isMobileOpen = false,
  onCloseMobile,
  hasHighContrastToggle,
  isHighContrastEnabled = false,
  isDarkTheme = false,
  onToggleTheme,
  fontScale,
  onToggleCollapse,
  onIncreaseFont,
  onDecreaseFont,
  onToggleHighContrast,
  onLogout,
}: AppSidebarProps) {
  const toggleLabel = isCollapsed ? 'Expandir menu' : 'Recolher menu'
  // O botão só aparece quando há uma ação ligada a ele: um botão que não faz nada parece um recurso quebrado.
  const showHighContrastToggle = hasHighContrastToggle ?? Boolean(onToggleHighContrast)

  return (
    <aside
      aria-label="Menu principal"
      // No celular, tocar em um link leva a outra página e a gaveta precisa fechar.
      onClick={(event) => {
        if (isMobileDrawer && (event.target as HTMLElement).closest('a')) onCloseMobile?.()
      }}
      inert={isMobileDrawer && !isMobileOpen}
      className={cn(
        'fixed top-0 left-0 flex h-screen max-h-screen shrink-0 flex-col overflow-y-auto bg-[#e3e6eb] py-8',
        SIDEBAR_SCROLLBAR_CLASSES,
        isMobileDrawer
          ? cn('z-50 w-[250px] px-4 shadow-xl transition-transform duration-200', isMobileOpen ? 'translate-x-0' : '-translate-x-full')
          : cn('transition-[width,padding] duration-200', isCollapsed ? 'w-14 px-3' : 'w-[250px] px-4'),
      )}
    >
      {isMobileDrawer && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={onCloseMobile}
          className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-sm text-zinc-950 hover:bg-white/70"
        >
          <IconX className="size-5 stroke-[1.6]" aria-hidden="true" />
        </button>
      )}
      <a
        title="Instituto CAIS"
        className={cn('mb-5 flex shrink-0 items-center', isCollapsed && 'justify-center')}
        href={homeHref}
      >
        {isCollapsed ? (
          <img alt="Instituto CAIS" className="size-8 rounded-sm object-contain" src={faviconUrl} />
        ) : (
          <img alt="Instituto CAIS" className="h-auto w-[140px] object-contain" src={logoUrl} />
        )}
      </a>

      <nav className="space-y-0.5">
        {navItems.map((item) => (
          <SidebarNavLink key={item.label} item={item} activeHref={activeHref} isCollapsed={isCollapsed} />
        ))}
      </nav>

      <section className="mt-5 space-y-0.5">
        {!isCollapsed && (
          <h2 className="px-1 text-xs leading-5 font-bold tracking-wide text-zinc-950">Acessibilidade</h2>
        )}
        <AccessibilityButton
          label="Aumentar fonte"
          icon={AArrowUp}
          isCollapsed={isCollapsed}
          isDisabled={fontScale !== undefined && !canIncreaseFont(fontScale)}
          onClick={onIncreaseFont}
        />
        <AccessibilityButton
          label="Diminuir fonte"
          icon={AArrowDown}
          isCollapsed={isCollapsed}
          isDisabled={fontScale !== undefined && !canDecreaseFont(fontScale)}
          onClick={onDecreaseFont}
        />
        {onToggleTheme && (
          <AccessibilityButton
            label={isDarkTheme ? 'Ativar tema claro' : 'Ativar tema escuro'}
            icon={isDarkTheme ? IconSun : IconMoon}
            isCollapsed={isCollapsed}
            isPressed={isDarkTheme}
            onClick={onToggleTheme}
          />
        )}
        {showHighContrastToggle && (
          <AccessibilityButton
            label={isHighContrastEnabled ? 'Desativar alto contraste' : 'Ativar alto contraste'}
            icon={IconContrast}
            isCollapsed={isCollapsed}
            isPressed={isHighContrastEnabled}
            onClick={onToggleHighContrast}
          />
        )}
      </section>

      <div className="mt-auto space-y-5 pt-8">
        {!isMobileDrawer && (
          <button
            type="button"
            aria-label={toggleLabel}
            title={isCollapsed ? toggleLabel : undefined}
            onClick={onToggleCollapse}
            className={cn(NAV_ITEM_CLASSES, isCollapsed ? 'justify-center' : 'justify-between')}
          >
            {!isCollapsed && <span>{toggleLabel}</span>}
            {isCollapsed ? (
              <IconLayoutSidebarLeftExpand className={ICON_CLASSES} aria-hidden />
            ) : (
              <IconLayoutSidebarLeftCollapse className={ICON_CLASSES} aria-hidden />
            )}
          </button>
        )}

        {!isCollapsed && (
          <div className="border-t border-zinc-950 pt-4 text-xs leading-5 tracking-wide text-zinc-950">
            {profileHref === null ? (
              <p>{userName}</p>
            ) : (
              <a className="block rounded-sm transition hover:text-[#0089e2] hover:underline" href={profileHref}>
                {userName}
              </a>
            )}
            <p className="mt-0.5">{userRole}</p>
          </div>
        )}

        {isCollapsed ? (
          <button
            type="button"
            title="Sair do Sistema"
            aria-label="Sair do Sistema"
            onClick={onLogout}
            className="flex h-8 w-full items-center justify-center rounded-sm text-red-700 transition hover:bg-red-50 hover:text-red-800"
          >
            <IconPower className="size-5 stroke-[1.6]" />
          </button>
        ) : (
          <Button
            variant="outline"
            onClick={onLogout}
            className="h-8 w-full rounded border-red-600 bg-transparent text-xs leading-5 tracking-wide text-red-700 hover:bg-red-50 hover:text-red-800"
          >
            <IconPower className={ICON_CLASSES} />
            Sair do Sistema
          </Button>
        )}
      </div>
    </aside>
  )
}
