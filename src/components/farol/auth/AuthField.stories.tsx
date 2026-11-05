import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { AuthField, AuthPasswordField } from './AuthField'

function FieldGallery({ errorMessage }: { errorMessage?: string }) {
  return (
    <div className="max-w-[320px] space-y-5">
      <AuthField id="cpf" label="CPF" placeholder="000.000.000-00" errorMessage={errorMessage} />
      <AuthPasswordField id="password" label="Senha" errorMessage={errorMessage} />
    </div>
  )
}

const meta = {
  title: 'Componentes/Formulários/Campo de senha e login',
  component: FieldGallery,
  parameters: {
    docs: {
      description: {
        component: [
          'Campos das telas de autenticação e de alterar senha: rótulo, caixa de 40px e, na senha, o botão de olho.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Clica no olho | A senha alterna entre oculta e visível; o ícone e o rótulo do botão mudam (**Mostrar senha** / **Ocultar senha**) |',
          '| Há erro | O campo recebe `aria-invalid` e `aria-describedby`; a mensagem aparece em vermelho abaixo |',
          '| Recebe foco | Anel azul CAIS de 2px |',
          '| Quando há ação ao lado do rótulo (ex.: **Esqueceu a senha?**) | Rótulo e ação ficam nas pontas da mesma linha |',
          '',
          'O estilo do rótulo é configurável (`labelClassName`): o login usa 12px semibold; alterar senha usa 14px medium.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof FieldGallery>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}
export const ComErro: Story = { args: { errorMessage: 'Campo obrigatório.' } }

export const MostraEOcultaSenha: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = await canvas.findByLabelText('Senha', { selector: 'input' })
    await expect(field).toHaveAttribute('type', 'password')
    await userEvent.click(canvas.getByRole('button', { name: 'Mostrar senha' }))
    await expect(field).toHaveAttribute('type', 'text')
    await expect(canvas.getByRole('button', { name: 'Ocultar senha' })).toBeVisible()
  },
}
