import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProfileFieldList } from './ProfileFields'

const meta = {
  title: 'Componentes/Dados/Campos de leitura',
  component: ProfileFieldList,
  parameters: {
    docs: {
      description: {
        component: [
          'Lista de "rótulo e valor" usada nas abas do perfil (Perfil, Endereço, Dados bancários, Contrato, Senha). Usa `<dl>`, `<dt>` e `<dd>` para a semântica correta.',
          '',
          '| Elemento | Estilo |',
          '| --- | --- |',
          '| Rótulo (`dt`) | 16px, medium, `#0F172A` |',
          '| Valor (`dd`) | 16px, regular, `#64748B`; pode receber outra cor (ex.: âmbar para "Pendente") |',
          '| Espaço entre campos | 20px |',
        ].join('\n'),
      },
    },
  },
  args: {
    fields: [
      { label: 'Nome completo', value: 'Maria Souza Andrade' },
      { label: 'Nome social', value: '' },
      { label: 'Função', value: 'Pendente', valueClassName: 'text-amber-600' },
    ],
  },
} satisfies Meta<typeof ProfileFieldList>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}
