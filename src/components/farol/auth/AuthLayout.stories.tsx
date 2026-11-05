import type { Meta, StoryObj } from '@storybook/react-vite'
import { AuthLayout } from './AuthLayout'

const meta = {
  title: 'Componentes/Layout/Layout de autenticação',
  component: AuthLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Casca de todas as telas públicas (login, recuperar senha, nova senha, convite): fundo `#eef1f7` com a imagem de rede a 10% de opacidade, logo de 260px, card central de 360px e "Powered by".',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| A janela é alta | O conjunto fica centralizado na vertical e na horizontal |',
          '| Há `description` | Aparece sob o título, centralizada, com largura máxima própria |',
          '| O card é translúcido | O fundo de rede aparece levemente por trás (`bg-white/95` com desfoque) |',
        ].join('\n'),
      },
    },
  },
  args: { title: 'Entre na sua conta', children: <p className="text-center text-sm text-zinc-500">Conteúdo do card</p> },
} satisfies Meta<typeof AuthLayout>

export default meta
type Story = StoryObj<typeof meta>

export const SoComTitulo: Story = {}
export const ComDescricao: Story = {
  args: { title: 'Recupere sua senha', description: 'Será enviado um link de recuperação para o seu e-mail, caso ele esteja registrado.' },
}
