import { useSyncExternalStore } from 'react'
import { readStoredValue, writeStoredValue } from './browserStorage'
import {
  DEFAULT_FONT_SCALE,
  FONT_SCALE_STORAGE_KEY,
  MAXIMUM_FONT_SCALE,
  MINIMUM_FONT_SCALE,
  clampFontScale,
  readStoredFontScale,
} from '../components/farol/fontScale'

export const HIGH_CONTRAST_STORAGE_KEY = 'cais-high-contrast'
export const HIGH_CONTRAST_ATTRIBUTE = 'data-contrast'
export const HIGH_CONTRAST_VALUE = 'high'
export const THEME_STORAGE_KEY = 'cais-theme'
/** Classe que o tema escuro põe no <html>; os tokens `.dark` de globals.css respondem a ela. */
const DARK_THEME_CLASS = 'dark'
/** O Storybook marca o <html> com este atributo quando ele mesmo aplica o zoom da fonte em toda a página. */
export const PREVIEW_ZOOM_ATTRIBUTE = 'data-preview-zoom'

export type Theme = 'light' | 'dark'

export interface AccessibilityPreferences {
  fontScale: number
  isHighContrast: boolean
  theme: Theme
}

type Listener = () => void

/**
 * Fonte única das preferências de acessibilidade: o menu lateral e a barra do Storybook leem e gravam aqui,
 * então os dois ficam sempre em sincronia. A escala de fonte vai de 100% a 130%, em passos de 10%.
 */
let preferences: AccessibilityPreferences = {
  fontScale: readStoredFontScale(),
  isHighContrast: readStoredValue(HIGH_CONTRAST_STORAGE_KEY) === 'true',
  theme: readStoredValue(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light',
}
const listeners = new Set<Listener>()

function applyHighContrastToDocument(isHighContrast: boolean) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (isHighContrast) root.setAttribute(HIGH_CONTRAST_ATTRIBUTE, HIGH_CONTRAST_VALUE)
  else root.removeAttribute(HIGH_CONTRAST_ATTRIBUTE)
}

function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle(DARK_THEME_CLASS, theme === 'dark')
}

function publish(next: AccessibilityPreferences) {
  const isUnchanged =
    next.fontScale === preferences.fontScale &&
    next.isHighContrast === preferences.isHighContrast &&
    next.theme === preferences.theme
  if (isUnchanged) return
  preferences = next
  applyHighContrastToDocument(next.isHighContrast)
  applyThemeToDocument(next.theme)
  listeners.forEach((listener) => listener())
}

applyHighContrastToDocument(preferences.isHighContrast)
applyThemeToDocument(preferences.theme)

export function getAccessibilityPreferences(): AccessibilityPreferences {
  return preferences
}

export function subscribeToAccessibilityPreferences(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setFontScale(scale: number) {
  const nextScale = clampFontScale(scale)
  writeStoredValue(FONT_SCALE_STORAGE_KEY, String(nextScale))
  publish({ ...preferences, fontScale: nextScale })
}

export function changeFontScale(delta: number) {
  setFontScale(preferences.fontScale + delta)
}

export function setHighContrast(isHighContrast: boolean) {
  writeStoredValue(HIGH_CONTRAST_STORAGE_KEY, String(isHighContrast))
  publish({ ...preferences, isHighContrast })
}

export function setTheme(theme: Theme) {
  writeStoredValue(THEME_STORAGE_KEY, theme)
  publish({ ...preferences, theme })
}

export function canIncreaseFont(scale: number): boolean {
  return scale < MAXIMUM_FONT_SCALE
}

export function canDecreaseFont(scale: number): boolean {
  return scale > MINIMUM_FONT_SCALE
}

/** Volta ao padrão sem gravar no navegador; usado entre uma história e outra. */
export function resetAccessibilityPreferences() {
  publish({ fontScale: DEFAULT_FONT_SCALE, isHighContrast: false, theme: 'light' })
}

export function useAccessibilityPreferences(): AccessibilityPreferences {
  return useSyncExternalStore(subscribeToAccessibilityPreferences, getAccessibilityPreferences)
}
