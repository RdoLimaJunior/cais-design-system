import { create } from 'storybook/theming/create'

const AZUL_CAIS = '#0089E2'
const FONTE_BASE = "'Inter Variable', Inter, system-ui, sans-serif"

const COMUM = {
  brandTitle: 'Design System CAIS',
  brandImage: 'logo-cais.png',
  brandTarget: '_self',
  colorPrimary: AZUL_CAIS,
  colorSecondary: AZUL_CAIS,
  fontBase: FONTE_BASE,
  fontCode: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
  appBorderRadius: 8,
  inputBorderRadius: 6,
}

/** Tema do painel do Storybook (menu lateral e barras). */
export const caisManagerTheme = create({
  ...COMUM,
  base: 'light',
  appBg: '#f4f6f9',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e4e4e7',
  textColor: '#0f172a',
  textInverseColor: '#ffffff',
  barTextColor: '#52525b',
  barSelectedColor: AZUL_CAIS,
  barHoverColor: AZUL_CAIS,
  barBg: '#ffffff',
  inputBorder: '#d4d4d8',
  inputBg: '#ffffff',
  inputTextColor: '#0f172a',
})

/** Tema das páginas de documentação. */
export const caisDocsTheme = caisManagerTheme
