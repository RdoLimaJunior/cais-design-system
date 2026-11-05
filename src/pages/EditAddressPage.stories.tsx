import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { MOCK_ADDRESS, MOCK_USER } from '../mocks/scholarship'
import { EditAddressPage } from './EditAddressPage'

const meta = {
  title: 'Sistemas/FAROL/Páginas/Perfil/Editar endereço',
  component: EditAddressPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Edição do endereço. CEP e número usam o campo de dígitos.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Envia com logradouro, bairro ou cidade vazios | O envio é bloqueado e o campo mostra o erro (texto provisório) |',
          '| Preenche tudo e salva | `onSave` recebe os valores |',
          '| Clica em **Cancelar edição** | Volta ao Perfil sem salvar |',
          '',
          '**Pendente:** preenchimento automático por CEP (o site não mostrou esse comportamento nos dados capturados).',
        ].join('\n'),
      },
    },
  },
  args: {
    userName: MOCK_USER.fullName,
    onSave: fn(),
    initialValues: {
      postalCode: MOCK_ADDRESS.postalCode,
      street: MOCK_ADDRESS.street,
      number: MOCK_ADDRESS.number,
      complement: MOCK_ADDRESS.complement,
      neighborhood: MOCK_ADDRESS.neighborhood,
      city: MOCK_ADDRESS.city,
      state: MOCK_ADDRESS.state,
    },
  },
} satisfies Meta<typeof EditAddressPage>

export default meta
type AddressStory = StoryObj<typeof meta>

export const EditarEndereco: AddressStory = {}

export const BloqueiaLogradouroVazio: AddressStory = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.clear(await canvas.findByLabelText('Logradouro'))
    await userEvent.click(canvas.getByRole('button', { name: /Salvar edição/ }))
    await expect(await canvas.findByText('Informe o logradouro.')).toBeVisible()
    await expect(args.onSave).not.toHaveBeenCalled()
  },
}

export const SalvaEndereco: AddressStory = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(await within(canvasElement).findByRole('button', { name: /Salvar edição/ }))
    await waitFor(() => expect(args.onSave).toHaveBeenCalledTimes(1))
  },
}
