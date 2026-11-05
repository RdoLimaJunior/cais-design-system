import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormErrorText, FormFieldLabel, FormHelperText, FormTextInput, type FormFieldSize } from './FormField'

function FieldExample({ fieldSize, error, helper }: { fieldSize: FormFieldSize; error?: string; helper?: string }) {
  return (
    <div className="max-w-[380px]">
      <FormFieldLabel htmlFor="example" size={fieldSize}>
        Nome completo
      </FormFieldLabel>
      <FormTextInput id="example" fieldSize={fieldSize} aria-invalid={Boolean(error)} defaultValue="Maria Souza Andrade" />
      {error ? <FormErrorText id="example-error">{error}</FormErrorText> : helper && <FormHelperText>{helper}</FormHelperText>}
    </div>
  )
}

const meta = {
  title: 'Componentes/Formulários/Campo de texto',
  component: FieldExample,
  parameters: {
    docs: {
      description: {
        component: [
          'Rótulo, caixa de texto e texto de apoio ou erro. Existem **dois tamanhos**:',
          '',
          '| `fieldSize` | Onde | Rótulo | Caixa |',
          '| --- | --- | --- | --- |',
          '| `large` | Editar perfil | 16px, medium | 44px de altura, texto de 18px, cantos de 8px |',
          '| `compact` | Editar endereço e dados bancários | 14px, medium | 32px de altura, texto de 14px, cantos de 6px |',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| O campo recebe foco | A borda e o anel viram azul CAIS (`#0089e2`) |',
          '| Há erro de validação | O campo recebe `aria-invalid` e o texto de apoio dá lugar à mensagem em vermelho |',
          '| O campo está desabilitado | Opacidade 50% e cursor de bloqueio |',
        ].join('\n'),
      },
    },
  },
  args: { fieldSize: 'large', helper: 'Preencha conforme seu documento de identidade.' },
} satisfies Meta<typeof FieldExample>

export default meta
type Story = StoryObj<typeof meta>

export const Grande: Story = {}
export const Compacto: Story = { args: { fieldSize: 'compact' } }
export const ComErro: Story = { args: { error: 'Informe seu nome completo.' } }
