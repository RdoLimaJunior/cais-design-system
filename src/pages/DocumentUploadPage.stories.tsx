import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { MOCK_USER } from '../mocks/scholarship'
import { DocumentUploadPage } from './DocumentUploadPage'

const meta = {
  title: 'Sistemas/FAROL/Páginas/Documentos/Enviar documento',
  component: DocumentUploadPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Envio de um documento pendente para revisão do RH, em dois passos: **upload** e **aguardar a revisão**.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Ainda não escolheu arquivo | **Enviar** fica desabilitado |',
          '| Escolhe (ou arrasta) um PDF ou imagem | O nome do arquivo aparece na área e **Enviar** é habilitado |',
          '| Clica em **Enviar** | Dispara `onSubmit` com o arquivo |',
          '| O documento não existe (`documentName` vazio) | Mostra "Documento não encontrado" e o link **Voltar aos documentos** |',
          '',
          'O menu lateral não marca nenhum item como ativo nesta tela (igual ao site).',
        ].join('\n'),
      },
    },
  },
  args: { userName: MOCK_USER.fullName, documentName: 'Histórico escolar', onSubmit: fn() },
} satisfies Meta<typeof DocumentUploadPage>

export default meta
type Story = StoryObj<typeof meta>

export const EnviarDocumento: Story = {}
export const DocumentoNaoEncontrado: Story = { args: { documentName: undefined } }

export const EnviaOArquivoEscolhido: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const submit = await canvas.findByRole('button', { name: /Enviar/ })
    await expect(submit).toBeDisabled()
    const file = new File(['conteudo'], 'historico.pdf', { type: 'application/pdf' })
    await userEvent.upload(canvasElement.querySelector('input[type="file"]') as HTMLInputElement, file)
    await expect(await canvas.findByText('historico.pdf')).toBeVisible()
    await expect(submit).toBeEnabled()
    await userEvent.click(submit)
    await expect(args.onSubmit).toHaveBeenCalledWith(file)
  },
}
