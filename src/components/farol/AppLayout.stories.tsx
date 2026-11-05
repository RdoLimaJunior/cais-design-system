import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppLayout } from './AppLayout'
import { PageCard } from './PageCard'

function SampleCard() {
  return (
    <PageCard title="Título da página" subtitle="Conteúdo de exemplo dentro do quadro">
      <p className="text-sm text-zinc-500">Conteúdo da página.</p>
    </PageCard>
  )
}

const meta = {
  title: 'Componentes/Layout/Quadros de página',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'O FAROL **não tem um layout único**: cada família de telas monta a própria casca, com espaçamentos diferentes (e até cor de fundo). O `frame` escolhe qual copiar; isso foi medido contra o site, tela a tela.',
          '',
          '| `frame` | Telas | Espaçamento da área | Fundo |',
          '| --- | --- | --- | --- |',
          '| `home` | Home | `px-6 pt-8 pr-8 pb-16`, cards empilhados com 14px | `#e3e6eb` |',
          '| `profile` | Ver perfil | `px-6 pt-8 pr-8 pb-2` | `#e3e6eb` |',
          '| `profile-edit` | Editar perfil, endereço, banco, alterar senha | `px-6 pt-4 pr-8 pb-8` | `#e3e6eb` |',
          '| `document` | Termos e documentos | `px-6 pt-8 pr-8` | `#e3e6eb` |',
          '| `reports-list` | Meus relatórios | `p-8` | `#e3e6eb` |',
          '| `report-detail` | Relatório mensal | `p-6`, itens com 16px de espaço | **`#E5E7EB`** (mais escuro) |',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| A sidebar recolhe ou expande | A margem esquerda do conteúdo acompanha (`--sidebar-width`) |',
          '| O usuário muda a fonte | O zoom vai no `#root` do site (no Storybook, no próprio quadro); a sidebar não muda |',
          '| Clica em **Sair do Sistema** | O modal de confirmação abre |',
        ].join('\n'),
      },
    },
  },
  args: { activeHref: '/home', userName: 'Maria Souza Andrade', breadcrumb: [{ label: 'Home' }], children: <SampleCard /> },
} satisfies Meta<typeof AppLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Home: Story = { args: { frame: 'home' } }

export const Perfil: Story = {
  args: { frame: 'profile', activeHref: '/perfil', breadcrumb: [{ label: 'Home', href: '/home' }, { label: 'Seu perfil' }] },
}

export const EdicaoDePerfil: Story = {
  args: { frame: 'profile-edit', activeHref: '/perfil', breadcrumbVariant: 'edit', breadcrumb: [{ label: 'Home', href: '/home' }, { label: 'Seu perfil', href: '/perfil' }] },
}

export const TermosEDocumentos: Story = {
  args: { frame: 'document', activeHref: '/perfil', breadcrumb: [{ label: 'Home', href: '/home' }, { label: 'Termos', href: '/perfil?tab=termos' }, { label: 'Termo de outorga' }] },
}

export const ListaDeRelatorios: Story = {
  args: { frame: 'reports-list', activeHref: '/meus-relatorios', breadcrumb: [{ label: 'Home', href: '/home' }, { label: 'Meus relatórios' }] },
}

export const DetalheDoRelatorio: Story = {
  args: { frame: 'report-detail', activeHref: '/meus-relatorios', breadcrumb: [{ label: 'Home', href: '/home' }, { label: 'Meus relatórios', href: '/meus-relatorios' }, { label: 'Relatório do mês de novembro' }] },
}

export const VisaoDeAdministrador: Story = {
  args: { frame: 'home', initialRole: 'admin' },
}
