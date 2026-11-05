import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { MOCK_USER } from '../mocks/scholarship'
import { TermPage } from './TermPage'

const meta = {
  title: 'Sistemas/FAROL/Páginas/Termos/Assinar termo',
  component: TermPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Fluxo de um termo em passos. O **passo ativo** tem borda e conteúdo; os **futuros** ficam em cinza só com o título. A ordem dos passos muda conforme o termo:',
          '',
          '| Termo | Passos |',
          '| --- | --- |',
          '| Confidencialidade e propriedade intelectual | 1 Leia e assine; 2 Aguarde a revisão |',
          '| Autodeclaração étnico-racial | 1 Preencha; 2 Leia e assine; 3 Aguarde a revisão |',
          '| Parentesco e conflito de interesses | 1 Preencha; 2 Leia e assine; 3 Aguarde a revisão |',
          '| Termo de outorga | 1 Preencha; 2 Aguarde a revisão; 3 Leia e assine |',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Está na autodeclaração e ainda não escolheu a raça | **Enviar resposta** fica desabilitado |',
          '| Escolhe uma opção | **Enviar resposta** é habilitado |',
          '| No termo de outorga, um dos dois campos está vazio | **Enviar resposta** fica desabilitado |',
          '| Clica em **Já assinei** | Dispara `onAlreadySigned` (leva ao envio do documento assinado) |',
          '| Clica em **Ler e Assinar** | Dispara `onSign` (abre o serviço de assinatura) |',
        ].join('\n'),
      },
    },
  },
  args: { userName: MOCK_USER.fullName, onSubmit: fn(), onAlreadySigned: fn(), onSign: fn() },
} satisfies Meta<typeof TermPage>

export default meta
type Story = StoryObj<typeof meta>

export const Confidencialidade: Story = { args: { kind: 'nda' } }
export const AutodeclaracaoEtnicoRacial: Story = { args: { kind: 'racial-self-declaration' } }
export const ParentescoEConflitoDeInteresses: Story = { args: { kind: 'kinship-conflict-declaration' } }
export const TermoDeOutorga: Story = { args: { kind: 'grant-term' } }

export const LerEAssinar: Story = {
  args: { kind: 'nda' },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(await within(canvasElement).findByRole('button', { name: /Ler e Assinar/ }))
    await expect(args.onSign).toHaveBeenCalledTimes(1)
  },
}

export const EnvioDependeDaEscolha: Story = {
  args: { kind: 'racial-self-declaration' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const submit = await canvas.findByRole('button', { name: /Enviar resposta/ })
    await expect(submit).toBeDisabled()
    await userEvent.click(canvas.getByLabelText('Pardo(a)'))
    await expect(submit).toBeEnabled()
    await userEvent.click(submit)
    await expect(args.onSubmit).toHaveBeenCalledWith({ race: 'Pardo(a)' })
  },
}

export const OutorgaExigeOsDoisCampos: Story = {
  args: { kind: 'grant-term' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = await canvas.findByRole('button', { name: /Enviar resposta/ })
    await userEvent.type(canvas.getByLabelText('Objetivo da bolsa no projeto'), 'Desenvolver o módulo X')
    await expect(submit).toBeDisabled()
    await userEvent.type(canvas.getByLabelText('Atividades principais'), 'Implementação e testes')
    await expect(submit).toBeEnabled()
  },
}
