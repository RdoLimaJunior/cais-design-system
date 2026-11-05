import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'
import { Skeleton } from './skeleton'
import { Spinner } from './spinner'

const meta = {
  title: 'Componentes/Feedback/Carregamento',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component: [
          'Duas formas de mostrar que algo está carregando:',
          '',
          '| Componente | Quando usar |',
          '| --- | --- |',
          '| `Spinner` | Ação curta: dentro de um botão, ao lado de um texto ou centralizado numa página ainda sem dados |',
          '| `Skeleton` | A forma do conteúdo já é conhecida (cartões, linhas de tabela) |',
          '',
          'O `Spinner` anuncia "Carregando" para leitores de tela e usa a cor do texto. Para botão em carregamento, desabilite o botão e coloque o `Spinner` antes do texto.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Indicador: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-10 text-primary" />
    </div>
  ),
}

export const BotaoSalvando: Story = {
  render: () => (
    <Button disabled>
      <Spinner />
      Salvando
    </Button>
  ),
}

export const PaginaCarregando: Story = {
  render: () => (
    <div className="flex min-h-60 flex-col items-center justify-center gap-3">
      <Spinner className="size-8 text-primary" />
      <p className="text-sm text-muted-foreground">Carregando projetos...</p>
    </div>
  ),
}

export const EsqueletoDeCartao: Story = {
  render: () => (
    <div className="max-w-sm space-y-3 rounded-lg border p-4">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  ),
}
