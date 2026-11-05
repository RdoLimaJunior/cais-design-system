import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { AppLayout } from './AppLayout'
import { AppSidebar } from './AppSidebar'

const meta = {
  title: 'Componentes/Navegação/Menu lateral',
  component: AppSidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Menu lateral fixo do FAROL, com **dois estilos** (`variant`) e dois tamanhos (`isCollapsed`).',
          '',
          '| Estilo | Itens | Particularidades |',
          '| --- | --- | --- |',
          '| `scholar` (Bolsista) | Home, Meu Perfil, Meus Relatórios | É o que está em produção no FAROL |',
          '| `admin` (Administrador) | Home, Meu Perfil, **Gestão de Pessoas** (4 submenus), **Gestão de Projetos** (2 submenus) | Vem do Figma; tem o botão **Alto contraste**. As rotas dos submenus vêm do código público do site |',
          '',
          'Um sistema novo pode passar `navItems` próprio e manter o resto do comportamento.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Clica em **Recolher menu** | A barra encolhe de 250px para 56px; só ícones; o rótulo vira dica (`title`). O ícone é o de painel lateral que recolhe (e passa a ser o que expande) |',
          '| Clica em **Expandir menu** | Volta a 250px, com rótulos, grupo Acessibilidade e dados do usuário |',
          '| Clica em **Aumentar/Diminuir fonte** | O conteúdo cresce ou encolhe de 100% a 130%, em passos de 10%; o botão fica desabilitado no limite |',
          '| Clica em **Ativar tema escuro** | A página inteira passa para o tema escuro; o botão vira **Ativar tema claro**. A escolha fica salva |',
          '| Abaixo de 768 px | O menu some e vira uma **gaveta**: abre pelo botão do topo, desliza por cima da página (sem empurrá-la), fecha com o X, o fundo escurecido, `Esc` ou ao tocar em um link |',
          '| Clica em **Ativar alto contraste** | A página inteira passa para fundo preto, texto branco, títulos e botões principais em amarelo, bordas brancas e links sublinhados; o botão vira **Desativar alto contraste** |',
          '| Clica em um item com **páginas filhas** (por exemplo, Gestão de Pessoas) | A lista de filhas abre ou fecha; a seta mostra o estado (`aria-expanded`) e a escolha fica salva. Elas começam abertas |',
          '| A rota atual coincide com um item | O item fica em negrito e recebe `aria-current="page"` |',
          '| Está recolhido e há submenus (admin) | Os submenus não aparecem; o ícone leva ao primeiro submenu |',
          '| Clica em **Sair do Sistema** | Dispara `onLogout` (normalmente abre o modal de confirmação) |',
        ].join('\n'),
      },
    },
  },
  args: {
    activeHref: '/home',
    userName: 'Maria Souza Andrade',
    onToggleCollapse: fn(),
    onIncreaseFont: fn(),
    onDecreaseFont: fn(),
    onToggleHighContrast: fn(),
    onLogout: fn(),
  },
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Bolsista: Story = { args: { variant: 'scholar' } }

export const BolsistaRecolhido: Story = { args: { variant: 'scholar', isCollapsed: true } }

export const Administrador: Story = { args: { variant: 'admin', userName: 'Ana Ribeiro Costa' } }

export const AdministradorRecolhido: Story = {
  args: { variant: 'admin', userName: 'Ana Ribeiro Costa', isCollapsed: true },
}

export const AdministradorNaTelaDeProjetos: Story = {
  args: { variant: 'admin', userName: 'Ana Ribeiro Costa', activeHref: '/rh/projetos' },
}

function LayoutWithContent() {
  return (
    <AppLayout breadcrumb={[{ label: 'Home' }]} activeHref="/home" userName="Maria Souza Andrade">
      <article className="rounded bg-white px-4 py-4 shadow-sm">Clique em "Bolsista" no menu para alternar o estilo.</article>
    </AppLayout>
  )
}

export const RecolheEExpande: Story = {
  render: () => <LayoutWithContent />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(await body.findByRole('button', { name: 'Recolher menu' }))
    await expect(await body.findByRole('button', { name: 'Expandir menu' })).toBeVisible()
    await userEvent.click(body.getByRole('button', { name: 'Expandir menu' }))
    await expect(await body.findByRole('button', { name: 'Recolher menu' })).toBeVisible()
  },
}

export const PapelEhSoTexto: Story = {
  render: () => <LayoutWithContent />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    // "Bolsista" é um rótulo informativo: nem botão, nem link.
    await expect(await body.findByText('Bolsista')).toBeVisible()
    await expect(body.queryByRole('button', { name: 'Bolsista' })).toBeNull()
    await expect(body.queryByRole('link', { name: 'Bolsista' })).toBeNull()
    await expect(body.getByRole('button', { name: 'Ativar alto contraste' })).toBeVisible()
  },
}

export const EscalaDeFonteFicaEntre100e130: Story = {
  render: () => <LayoutWithContent />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    // No Storybook o zoom vai no <body> (ver .storybook/accessibilityBridge.ts); no site, no #root.
    const page = canvasElement.ownerDocument.body
    const increase = await body.findByRole('button', { name: 'Aumentar fonte' })
    const decrease = body.getByRole('button', { name: 'Diminuir fonte' })

    await expect(decrease).toBeDisabled()
    await expect(page.style.zoom).toBe('1')
    for (let step = 0; step < 3; step++) await userEvent.click(increase)
    await expect(page.style.zoom).toBe('1.3')
    await expect(increase).toBeDisabled()
    await expect(window.localStorage.getItem('cais-font-scale')).toBe('1.3')
    for (let step = 0; step < 3; step++) await userEvent.click(decrease)
    await expect(page.style.zoom).toBe('1')
    await expect(decrease).toBeDisabled()
  },
}

export const AltoContrasteLigaEDesliga: Story = {
  render: () => <LayoutWithContent />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const root = canvasElement.ownerDocument.documentElement
    await expect(root.getAttribute('data-contrast')).toBeNull()
    await userEvent.click(await body.findByRole('button', { name: 'Ativar alto contraste' }))
    await expect(root.getAttribute('data-contrast')).toBe('high')
    await expect(window.localStorage.getItem('cais-high-contrast')).toBe('true')
    await userEvent.click(body.getByRole('button', { name: 'Desativar alto contraste' }))
    await expect(root.getAttribute('data-contrast')).toBeNull()
  },
}

export const TemaEscuroLigaEDesliga: Story = {
  render: () => <LayoutWithContent />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const root = canvasElement.ownerDocument.documentElement
    await expect(root.classList.contains('dark')).toBe(false)
    await userEvent.click(await body.findByRole('button', { name: 'Ativar tema escuro' }))
    await expect(root.classList.contains('dark')).toBe(true)
    await expect(window.localStorage.getItem('cais-theme')).toBe('dark')
    await userEvent.click(body.getByRole('button', { name: 'Ativar tema claro' }))
    await expect(root.classList.contains('dark')).toBe(false)
  },
}

export const GavetaNoMobile: Story = {
  render: () => <LayoutWithContent />,
  // O teste roda numa janela de mobile; na documentação a história aparece dentro de uma moldura de 375 px.
  parameters: { device: 'mobile' },
  globals: { viewport: { value: 'mobile', isRotated: false } },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const content = canvasElement.ownerDocument.querySelector('main section') as HTMLElement
    const positionBefore = content.getBoundingClientRect().left
    await userEvent.click(await body.findByRole('button', { name: 'Abrir menu' }))
    await expect(await body.findByRole('button', { name: 'Fechar menu' })).toBeVisible()
    // A gaveta fica por cima: o conteúdo não se mexe.
    await expect(content.getBoundingClientRect().left).toBe(positionBefore)
    await userEvent.keyboard('{Escape}')
    await expect(body.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false')
    await expect(canvasElement.ownerDocument.querySelector('aside')?.hasAttribute('inert')).toBe(true)
  },
}

export const PaginasFilhasAbremEFecham: Story = {
  args: { variant: 'admin', userName: 'Ana Ribeiro Costa', activeHref: '/rh/projetos' },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const toggle = await body.findByRole('button', { name: 'Gestão de Pessoas' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(body.getByRole('link', { name: 'Ver Todos os Colaboradores' })).toBeVisible()
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(body.queryByRole('link', { name: 'Ver Todos os Colaboradores' })).toBeNull()
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  },
}
