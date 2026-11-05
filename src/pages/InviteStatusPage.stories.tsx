import type { Meta, StoryObj } from '@storybook/react-vite'
import { InviteStatusPage } from './InviteStatusPage'

const meta = {
  title: 'Sistemas/FAROL/Páginas/Autenticação/Convite',
  component: InviteStatusPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Telas de `/register` (link inválido) e `/register/expired` (convite vencido). Em ambas, o único caminho é **Ir para o login**.',
      },
    },
  },
} satisfies Meta<typeof InviteStatusPage>

export default meta
type Story = StoryObj<typeof meta>

export const Indisponivel: Story = { args: { problem: 'invalid' } }
export const Expirado: Story = { args: { problem: 'expired' } }
