import { UPDATE_GLOBALS, GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events'
import { addons } from 'storybook/preview-api'
import {
  PREVIEW_ZOOM_ATTRIBUTE,
  getAccessibilityPreferences,
  setFontScale,
  setHighContrast,
  setTheme,
  subscribeToAccessibilityPreferences,
  type AccessibilityPreferences,
} from '../src/lib/accessibilityPreferences'

export const CONTRAST_NORMAL = 'normal'
export const CONTRAST_HIGH = 'high'

interface AccessibilityGlobals {
  fontScale?: string
  contrast?: string
  theme?: string
}

export function applyGlobalsToPreferences(globals: AccessibilityGlobals) {
  if (globals.fontScale !== undefined) setFontScale(Number(globals.fontScale))
  if (globals.contrast !== undefined) setHighContrast(globals.contrast === CONTRAST_HIGH)
  if (globals.theme !== undefined) setTheme(globals.theme === 'dark' ? 'dark' : 'light')
}

function applyZoomToPage({ fontScale }: AccessibilityPreferences) {
  document.body.style.zoom = String(fontScale)
}

function toGlobals({ fontScale, isHighContrast, theme }: AccessibilityPreferences): AccessibilityGlobals {
  return { fontScale: String(fontScale), contrast: isHighContrast ? CONTRAST_HIGH : CONTRAST_NORMAL, theme }
}

/**
 * Liga a barra do Storybook (Fonte e Contraste) às preferências de acessibilidade do sistema.
 * Nos dois sentidos: mexer na barra muda o menu lateral, e mexer nos botões do menu muda a barra.
 * O zoom vai no <body>, então vale para as histórias e para as páginas de documentação.
 */
export function connectAccessibilityToolbar() {
  const channel = addons.getChannel()
  document.documentElement.setAttribute(PREVIEW_ZOOM_ATTRIBUTE, 'true')
  applyZoomToPage(getAccessibilityPreferences())

  channel.on(SET_GLOBALS, ({ globals }: { globals: AccessibilityGlobals }) => applyGlobalsToPreferences(globals))
  channel.on(GLOBALS_UPDATED, ({ userGlobals }: { userGlobals: AccessibilityGlobals }) =>
    applyGlobalsToPreferences(userGlobals),
  )

  subscribeToAccessibilityPreferences(() => {
    const preferences = getAccessibilityPreferences()
    applyZoomToPage(preferences)
    channel.emit(UPDATE_GLOBALS, { globals: toGlobals(preferences) })
  })
}
