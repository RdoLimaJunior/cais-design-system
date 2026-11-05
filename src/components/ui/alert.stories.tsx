import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from './alert'

const meta = {
  title: 'Componentes/Feedback/Alerta',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component: [
          'Aviso em bloco, com título e descrição. Tem `role="alert"`, então o leitor de tela o anuncia.',
          '',
          '| `variant` | Quando usar |',
          '| --- | --- |',
          '| `default` | Informação neutra |',
          '| `info` | Orientação ou contexto |',
          '| `success` | Algo foi concluído |',
          '| `warning` | Atenção: o usuário pode precisar agir |',
          '| `destructive` | Erro ou bloqueio |',
          '',
          'A cor nunca é o único sinal: escreva sempre o que aconteceu no título ou na descrição.',
        ].join('\n'),
      },
    },
  },
  args: { variant: 'info' },
  render: (args) => (
    <Alert {...args}>
      <IconInfoCircle aria-hidden="true" />
      <AlertTitle>Teto de custos incorridos</AlertTitle>
      <AlertDescription>O projeto usou 82% do teto de 20%. Confira antes de lançar novas execuções.</AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Informacao: Story = {}
export const Sucesso: Story = {
  args: { variant: 'success' },
  render: (args) => (
    <Alert {...args}>
      <IconCircleCheck aria-hidden="true" />
      <AlertTitle>Plano de trabalho aprovado</AlertTitle>
      <AlertDescription>Os valores já estão disponíveis para execução.</AlertDescription>
    </Alert>
  ),
}
export const Atencao: Story = {
  args: { variant: 'warning' },
  render: (args) => (
    <Alert {...args}>
      <IconAlertTriangle aria-hidden="true" />
      <AlertTitle>Saldo da rubrica quase no fim</AlertTitle>
      <AlertDescription>Restam 6% do valor previsto para Serviços de terceiros.</AlertDescription>
    </Alert>
  ),
}
export const Erro: Story = {
  args: { variant: 'destructive' },
  render: (args) => (
    <Alert {...args}>
      <IconAlertTriangle aria-hidden="true" />
      <AlertTitle>Saldo negativo</AlertTitle>
      <AlertDescription>A execução deixaria a rubrica com saldo negativo e foi bloqueada.</AlertDescription>
    </Alert>
  ),
}
