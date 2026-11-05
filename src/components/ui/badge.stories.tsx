import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const meta = {
  title: 'Componentes/Dados/Selo (Badge)',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: [
          'Rótulo curto e arredondado. As variantes de estado têm fundo suave e texto na cor do estado.',
          '',
          '| `variant` | Cor | Usos |',
          '| --- | --- | --- |',
          '| `success` | Verde | Concluído, dentro do limite |',
          '| `warning` | Âmbar | Atenção, perto do limite |',
          '| `destructive` | Vermelho sólido | Erro, estourado, bloqueado |',
          '| `info` | Azul | Informação |',
          '| `default`, `secondary`, `outline` | Azul de marca sólido, cinza, contorno | Usos gerais |',
          '',
          '**Regra:** `success`, `warning`, `destructive` e `info` só dizem estado. Todas as cores vêm do CAIS master.',
          'O texto do selo sempre diz o estado; a cor só reforça.',
        ].join('\n'),
      },
    },
  },
  args: { children: 'Em execução', variant: 'default' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}
export const Sucesso: Story = { args: { variant: 'success', children: 'Aprovado' } }
export const Atencao: Story = { args: { variant: 'warning', children: 'Perto do teto' } }
export const Erro: Story = { args: { variant: 'destructive', children: 'Saldo negativo' } }
export const Informacao: Story = { args: { variant: 'info', children: 'Planejamento' } }

export const Todos: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Em execução</Badge>
      <Badge variant="success">Aprovado</Badge>
      <Badge variant="warning">Perto do teto</Badge>
      <Badge variant="destructive">Saldo negativo</Badge>
      <Badge variant="info">Planejamento</Badge>
      <Badge variant="secondary">Arquivado</Badge>
      <Badge variant="outline">Rascunho</Badge>
    </div>
  ),
}
