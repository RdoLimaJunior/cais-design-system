import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { MOCK_PROFILE } from '../../../mocks/scholarship'
import { PhotoUploadField } from './PhotoUploadField'

function PhotoExample({ initialPhoto }: { initialPhoto: string | null }) {
  const [photoUrl, setPhotoUrl] = useState(initialPhoto)
  return (
    <PhotoUploadField
      photoUrl={photoUrl}
      altText="Foto para comunicação interna"
      onPhotoChange={(file) => setPhotoUrl(URL.createObjectURL(file))}
      onPhotoRemove={() => setPhotoUrl(null)}
    />
  )
}

const meta = {
  title: 'Componentes/Formulários/Upload de foto',
  component: PhotoExample,
  parameters: {
    docs: {
      description: {
        component: [
          'Foto para comunicação interna, no Editar perfil. Mostra a prévia (80 x 96px) e dois botões.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Clica em **Substituir foto** | Abre o seletor de arquivo (somente imagens); ao escolher, a prévia é trocada |',
          '| Clica em **Remover foto** | A foto some e a caixa mostra o ícone de pessoa |',
          '',
          'O campo de arquivo real fica oculto (`sr-only`) e é ligado ao rótulo pelo `id="profile-photo"`.',
        ].join('\n'),
      },
    },
  },
  args: { initialPhoto: MOCK_PROFILE.photoUrl },
} satisfies Meta<typeof PhotoExample>

export default meta
type Story = StoryObj<typeof meta>

export const ComFoto: Story = {}
export const SemFoto: Story = { args: { initialPhoto: null } }

export const RemoveAFoto: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Remover foto' }))
    await waitFor(() => expect(canvas.queryByAltText('Foto para comunicação interna')).toBeNull())
  },
}
