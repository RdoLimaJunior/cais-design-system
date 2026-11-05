import { readStoredValue } from '../../lib/browserStorage'

/** Valores medidos no FAROL em produção: 100% a 130%, em passos de 10%. */
export const DEFAULT_FONT_SCALE = 1
export const MINIMUM_FONT_SCALE = 1
export const MAXIMUM_FONT_SCALE = 1.3
export const FONT_SCALE_STEP = 0.1

export const FONT_SCALE_STORAGE_KEY = 'cais-font-scale'
export const SIDEBAR_COLLAPSED_STORAGE_KEY = 'cais-sidebar-collapsed'

export function clampFontScale(scale: number): number {
  const roundedScale = Number(scale.toFixed(2))
  return Math.min(MAXIMUM_FONT_SCALE, Math.max(MINIMUM_FONT_SCALE, roundedScale))
}

export function readStoredFontScale(): number {
  const storedScale = Number(readStoredValue(FONT_SCALE_STORAGE_KEY))
  return Number.isFinite(storedScale) && storedScale > 0 ? clampFontScale(storedScale) : DEFAULT_FONT_SCALE
}

export function readStoredSidebarCollapsed(): boolean {
  return readStoredValue(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true'
}
