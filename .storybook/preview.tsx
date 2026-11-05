import type { Preview } from '@storybook/react-vite'
import '../src/styles/globals.css'
import { CONTRAST_HIGH, CONTRAST_NORMAL, applyGlobalsToPreferences, connectAccessibilityToolbar } from './accessibilityBridge'
import { TooltipProvider } from '../src/components/ui/tooltip'
import { caisDocsTheme } from './caisTheme'
import { DeviceFrame, type DeviceKey } from './DeviceFrame'
import { VIEWPORTS_DO_ECOSSISTEMA } from './viewports'

// Preferência que o FAROL guarda no navegador; cada história começa com o menu expandido.
const STORED_PREFERENCE_KEYS = ['cais-sidebar-collapsed']

const FONT_SCALE_ITEMS = [
  { value: '1', title: '100% (padrão)' },
  { value: '1.1', title: '110%' },
  { value: '1.2', title: '120%' },
  { value: '1.3', title: '130% (máximo)' },
]

const THEME_ITEMS = [
  { value: 'light', title: 'Tema claro' },
  { value: 'dark', title: 'Tema escuro' },
]

const CONTRAST_ITEMS = [
  { value: CONTRAST_NORMAL, title: 'Contraste normal' },
  { value: CONTRAST_HIGH, title: 'Alto contraste' },
]

connectAccessibilityToolbar()

const preview: Preview = {
  tags: ['autodocs'],
  // O Tooltip do shadcn exige um TooltipProvider; nas aplicações ele fica uma vez na raiz.
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
    // Histórias com `parameters.device` aparecem dentro de uma moldura com a largura real da faixa de tela.
    (Story, context) => {
      const device = context.parameters.device as DeviceKey | undefined
      if (!device) return <Story />
      return (
        <DeviceFrame device={device} storyId={context.id} viewMode={context.viewMode} globals={context.globals}>
          <Story />
        </DeviceFrame>
      )
    },
  ],
  initialGlobals: { fontScale: '1', contrast: CONTRAST_NORMAL, theme: 'light' },
  globalTypes: {
    fontScale: {
      description: 'Tamanho da fonte (de 100% a 130%)',
      toolbar: { title: 'Fonte', icon: 'zoom', items: FONT_SCALE_ITEMS, dynamicTitle: true },
    },
    theme: {
      description: 'Tema claro ou escuro',
      toolbar: { title: 'Tema', icon: 'moon', items: THEME_ITEMS, dynamicTitle: true },
    },
    contrast: {
      description: 'Modo de contraste',
      toolbar: { title: 'Contraste', icon: 'contrast', items: CONTRAST_ITEMS, dynamicTitle: true },
    },
  },
  beforeEach: ({ globals }) => {
    // Cada história volta ao que está na barra (nos testes, o padrão), sem apagar a escolha de quem navega.
    applyGlobalsToPreferences(globals)
    try {
      STORED_PREFERENCE_KEYS.forEach((key) => window.localStorage.removeItem(key))
    } catch {
      // Sem armazenamento disponível: nada a limpar.
    }
  },
  parameters: {
    docs: { theme: caisDocsTheme },
    viewport: { options: VIEWPORTS_DO_ECOSSISTEMA },
    options: {
      storySort: {
        order: [
          'Ecossistema CAIS',
          ['Apresentação', 'Como criar um novo sistema', 'Inventário do que foi coletado', 'Figma: o que existe e o que falta'],
          'Fundamentos',
          ['Cores', 'Tipografia', 'Ícones', 'Espaçamento e layout', 'Responsividade', 'Acessibilidade'],
          'Componentes',
          ['Navegação', 'Formulários', 'Dados', 'Layout', 'Feedback'],
          'Sistemas',
          [
            'FAROL',
            ['Visão geral', 'Páginas'],
            'CAIS PMO',
            [
              'Visão geral',
              'Migração',
              ['Guia para o desenvolvedor', 'De-para de componentes e tokens', 'Mapa de ícones'],
              'Telas',
              'Componentes',
            ],
            'CAIS SCSP',
          ],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
