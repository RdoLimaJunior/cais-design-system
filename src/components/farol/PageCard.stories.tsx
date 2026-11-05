import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditFooterLink } from './EditFooterLink'
import { Button } from '../ui/button'
import { PageCard } from './PageCard'

const meta = {
  title: 'Componentes/Layout/Card de página',
  component: PageCard,
  decorators: [(Story) => <div className="bg-[#e3e6eb] p-6"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component: [
          'Card branco que ocupa a altura da tela: cabeçalho com título azul e subtítulo, corpo e **rodapé de ações sempre encostado na base** (`mt-auto`).',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| O conteúdo é curto | O card ainda assim chega à base da janela e o rodapé fica embaixo |',
          '| Não há `footer` | O card não mostra a faixa de rodapé |',
          '| Há `actions` | Os botões principais ficam à direita do título; no celular, abaixo dele |',
          '| O rodapé tem **Editar** (`EditFooterLink`) | É um link de contorno azul com ícone de lápis; no hover, fundo `#e8f5ff` |',
        ].join('\n'),
      },
    },
  },
  args: { title: 'Seu perfil', subtitle: 'Nenhuma pendência no perfil', children: <p className="text-sm text-zinc-500">Corpo do card.</p> },
} satisfies Meta<typeof PageCard>

export default meta
type Story = StoryObj<typeof meta>

export const SemRodape: Story = {}
export const ComRodapeDeEdicao: Story = { args: { footer: <EditFooterLink href="/perfil/editar" /> } }
export const RodapeMudarSenha: Story = { args: { footer: <EditFooterLink href="/perfil/alterar-senha" label="Mudar senha" /> } }
export const ComAcoesNoCabecalho: Story = {
  args: {
    title: 'Solicitações',
    subtitle: undefined,
    actions: (
      <>
        <Button size="lg">Nova compra de produtos</Button>
        <Button size="lg">Nova contratação de serviço</Button>
      </>
    ),
  },
}
