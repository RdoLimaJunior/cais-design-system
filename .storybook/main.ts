import type { StorybookConfig } from '@storybook/react-vite'
import remarkGfm from 'remark-gfm'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      // Sem o remark-gfm, as tabelas das páginas aparecem como texto com barras (| --- |).
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-mcp',
  ],
  staticDirs: ['./public'],
  framework: '@storybook/react-vite',
  features: { sidebarOnboardingChecklist: false },
  core: { disableWhatsNewNotifications: true },
}

export default config
