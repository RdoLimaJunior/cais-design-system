import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { PageLoader } from './PageLoader'

const meta = {
  title: 'Componentes/Feedback/Carregamento de página',
  component: PageLoader,
  parameters: {
    docs: {
      description: {
        component: [
          'Estado de carregamento de uma página ou seção que ainda não tem dados: o `Spinner` centralizado, com legenda opcional.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| A página inteira espera a resposta da API | Use `PageLoader`, no lugar do corpo da página |',
          '| A forma do conteúdo já é conhecida (cartões, linhas) | Use `Skeleton`, em cinza claro |',
          '| Uma ação curta (salvar) | Use o `Spinner` dentro do botão desabilitado |',
          '| Recebe `label` | O texto aparece abaixo do indicador; o `Spinner` já anuncia "Carregando" para leitores de tela |',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof PageLoader>

export default meta
type Story = StoryObj<typeof meta>

export const ComLegenda: Story = {
  args: { label: 'Carregando projetos...' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('status')).toHaveTextContent('Carregando projetos...')
  },
}

export const SemLegenda: Story = {
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('status', { name: 'Carregando' })).toBeInTheDocument()
  },
}
