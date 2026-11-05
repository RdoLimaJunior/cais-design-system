import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { SegmentedTabs } from './SegmentedTabs'

const PROFILE_TAB_LABELS = ['Perfil', 'Endereço', 'Dados bancários', 'Informações de Contrato', 'Documentos', 'Termos', 'Relatórios', 'Senha']

function InteractiveTabs({ tabs, initialTab }: { tabs: string[]; initialTab: string }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  return (
    <div>
      <SegmentedTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <p className="text-sm text-zinc-500">Aba ativa: {activeTab}</p>
    </div>
  )
}

const meta = {
  title: 'Componentes/Navegação/Abas segmentadas',
  component: InteractiveTabs,
  parameters: {
    docs: {
      description: {
        component: [
          'Abas em "pílula" usadas no Ver perfil. A aba ativa fica com fundo branco e sombra; as demais ficam sobre o cinza claro.',
          '',
          '| Quando | Então |',
          '| --- | --- |',
          '| Clica numa aba | Ela vira a ativa (`aria-current="page"`) e o conteúdo muda sem recarregar a página |',
          '| Há mais abas do que cabem na largura | A faixa rola na horizontal |',
        ].join('\n'),
      },
    },
  },
  args: { tabs: PROFILE_TAB_LABELS, initialTab: 'Perfil' },
} satisfies Meta<typeof InteractiveTabs>

export default meta
type Story = StoryObj<typeof meta>

export const AbasDoPerfil: Story = {}
export const AbaDocumentosAtiva: Story = { args: { initialTab: 'Documentos' } }

export const TrocaDeAba: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Senha' }))
    await expect(canvas.getByRole('button', { name: 'Senha' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByText('Aba ativa: Senha')).toBeVisible()
  },
}
