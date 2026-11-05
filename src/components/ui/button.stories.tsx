import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconCheck, IconDownload, IconPlus } from '@tabler/icons-react'
import { Button } from './button'

const meta = {
  title: 'Componentes/Formulários/Botão',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: [
          'Botão do shadcn/ui na versão que o FAROL usa (altura 32px, `px-2.5`, `gap-1.5`). As telas aplicam **cores próprias por cima** da variante; os exemplos abaixo mostram as receitas reais.',
          '',
          '| Receita | Onde | Classes principais |',
          '| --- | --- | --- |',
          '| Contorno azul | Ver perfil, Iniciar relatório, Já assinei | `border-[#0089e2] text-[#0089e2] hover:bg-sky-50` |',
          '| Azul cheio | Salvar edição, Enviar, Entrar | `bg-[#0089e2] text-white hover:bg-[#0077c5]` |',
          '| Contorno vermelho | Cancelar edição, Remover foto, Sair do Sistema | `border-red-500 text-red-600 hover:bg-red-50` |',
          '| Contorno neutro | Cancelar (alterar senha), Cancelar (modal) | `border-zinc-200 text-zinc-950 hover:bg-zinc-100` |',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Passa o mouse num botão habilitado | O cursor vira **mãozinha** (regra global do site) |',
          '| O botão está desabilitado | Opacidade 50%, sem cursor de mão e sem eventos |',
          '| Recebe foco pelo teclado | Aparece o anel de foco (`focus-visible:ring-3`) |',
        ].join('\n'),
      },
    },
  },
  args: { children: 'Botão' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}
export const Contorno: Story = { args: { variant: 'outline' } }
export const Secundario: Story = { args: { variant: 'secondary' } }
export const Fantasma: Story = { args: { variant: 'ghost' } }
export const Destrutivo: Story = { args: { variant: 'destructive' } }
export const Link: Story = { args: { variant: 'link' } }
export const Desabilitado: Story = { args: { disabled: true } }

export const ReceitasDoFarol: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" className="rounded border-[#0089e2] bg-white text-xs text-[#0089e2] hover:bg-sky-50">
        Contorno azul
      </Button>
      <Button className="rounded border-transparent bg-[#0089e2] text-xs font-semibold text-white hover:bg-[#0077c5]">
        Azul cheio <IconCheck className="size-3.5" />
      </Button>
      <Button variant="outline" className="rounded border-red-500 bg-white text-xs text-red-600 hover:bg-red-50">
        Contorno vermelho
      </Button>
      <Button variant="outline" className="rounded border-zinc-200 bg-white text-xs text-zinc-950 hover:bg-zinc-100">
        Contorno neutro
      </Button>
      <Button variant="outline" className="rounded border-[#0089e2] bg-white text-xs text-[#0089e2] hover:bg-sky-50">
        <IconPlus className="size-3.5" /> Com ícone
      </Button>
      <Button className="rounded bg-[#0089E2] text-xs text-white disabled:opacity-50" disabled>
        <IconDownload className="size-3.5" /> Baixar arquivos
      </Button>
    </div>
  ),
}
