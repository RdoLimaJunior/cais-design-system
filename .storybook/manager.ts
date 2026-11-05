import { addons } from 'storybook/manager-api'
import { caisManagerTheme } from './caisTheme'

addons.setConfig({
  theme: caisManagerTheme,
  sidebar: { showRoots: true },
})
