import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageBreadcrumb } from './PageBreadcrumb'

const meta = {
  title: 'Componentes/Navegação/Breadcrumb',
  component: PageBreadcrumb,
  decorators: [(Story) => <div className="bg-[#e3e6eb] p-6"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component: [
          'Trilha de navegação no topo da página. O FAROL usa **sete variações**, uma por família de telas; cada `variant` copia a marcação exata de uma delas.',
          '',
          '| `variant` | Onde aparece | Particularidade |',
          '| --- | --- | --- |',
          '| `plain` | Home | Só o rótulo da página, sem links |',
          '| `profile` | Ver perfil | Separador `›` em texto; o último item é só texto |',
          '| `edit` | Editar perfil | Separador com margem horizontal; todos os itens são links |',
          '| `edit-compact` | Editar endereço e dados bancários | Texto de 12px |',
          '| `document` | Termos e documentos | Separador é o ícone de seta; o último item recebe `aria-current` |',
          '| `reports-list` | Meus relatórios | Igual ao `profile`, com `aria-current` |',
          '| `report-detail` | Relatório mensal | Separador cinza; links sublinham no hover |',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Passa o mouse num link | O texto fica azul (`#0089E2`), ou sublinha na variante `report-detail` |',
          '| É o último item | Não é link e marca a página atual para leitores de tela (quando a variante prevê) |',
        ].join('\n'),
      },
    },
  },
  args: {
    items: [
      { label: 'Home', href: '/home' },
      { label: 'Seu perfil' },
    ],
  },
} satisfies Meta<typeof PageBreadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Home: Story = { args: { variant: 'plain', items: [{ label: 'Home' }] } }
export const Perfil: Story = { args: { variant: 'profile' } }
export const Edicao: Story = {
  args: { variant: 'edit', items: [{ label: 'Home', href: '/home' }, { label: 'Seu perfil', href: '/perfil' }] },
}
export const EdicaoCompacta: Story = {
  args: { variant: 'edit-compact', items: [{ label: 'Home', href: '/home' }, { label: 'Seu perfil', href: '/perfil' }] },
}
export const Documento: Story = {
  args: {
    variant: 'document',
    items: [{ label: 'Home', href: '/home' }, { label: 'Termos', href: '/perfil?tab=termos' }, { label: 'Termo de outorga' }],
  },
}
export const ListaDeRelatorios: Story = {
  args: { variant: 'reports-list', items: [{ label: 'Home', href: '/home' }, { label: 'Meus relatórios' }] },
}
export const DetalheDoRelatorio: Story = {
  args: {
    variant: 'report-detail',
    items: [
      { label: 'Home', href: '/home' },
      { label: 'Meus relatórios', href: '/meus-relatorios' },
      { label: 'Relatório do mês de novembro • AI Advanced' },
    ],
  },
}
