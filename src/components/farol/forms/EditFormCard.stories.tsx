import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { FormFieldLabel, FormHelperText, FormTextInput } from './FormField'
import { EditFormCard } from './EditFormCard'

const meta = {
  title: 'Componentes/Formulários/Cartão de edição',
  component: EditFormCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Casca das telas de edição: cabeçalho, corpo em duas colunas sobre fundo `#fbfcfd` e rodapé fixo com **Cancelar edição** e **Salvar edição**.',
          '',
          '| `headerStyle` | Onde | Cabeçalho |',
          '| --- | --- | --- |',
          '| `large` | Editar perfil | Título de 22px, borda zinc-200 |',
          '| `compact` | Editar endereço e dados bancários | Título de 14px extra negrito, borda zinc-100 |',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Clica em **Salvar edição** | O formulário é enviado (`onSubmit`); a validação é do formulário que usa o cartão |',
          '| Clica em **Cancelar edição** | Navega para `cancelHref` sem salvar |',
          '| O conteúdo é curto | O rodapé continua encostado na base da tela (`min-h-[calc(100dvh-111px)]`) |',
        ].join('\n'),
      },
    },
  },
  args: {
    title: 'Editar perfil',
    cancelHref: '/perfil',
    onSubmit: fn((event) => event.preventDefault()),
    children: (
      <>
        <div>
          <FormFieldLabel htmlFor="name">Nome completo</FormFieldLabel>
          <FormTextInput id="name" defaultValue="Maria Souza Andrade" />
          <FormHelperText>Preencha conforme seu documento de identidade.</FormHelperText>
        </div>
        <div>
          <FormFieldLabel htmlFor="social">Nome social</FormFieldLabel>
          <FormTextInput id="social" />
        </div>
      </>
    ),
  },
} satisfies Meta<typeof EditFormCard>

export default meta
type Story = StoryObj<typeof meta>

export const Grande: Story = {}
export const Compacto: Story = { args: { title: 'Editar endereço', headerStyle: 'compact' } }

export const EnviaOFormulario: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: /Salvar edição/ }))
    await expect(args.onSubmit).toHaveBeenCalledTimes(1)
  },
}
