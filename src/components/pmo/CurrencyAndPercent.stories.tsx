import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../ui/table'
import { CurrencyCell } from './CurrencyCell'
import { CurrencyInput } from './CurrencyInput'
import { PercentInput } from './PercentInput'

const meta = {
  title: 'Sistemas/CAIS PMO/Componentes/Valores e campos financeiros',
  component: CurrencyInput,
  parameters: {
    docs: {
      description: {
        component: [
          'Campos e células para dinheiro e percentual. Todo valor financeiro do PMO passa por eles.',
          '',
          '| Componente | Regra |',
          '| --- | --- |',
          '| `CurrencyInput` | Os dígitos entram pela direita, sempre com 2 casas. Só aceita número. Colar segue a regra brasileira ("1.234,56") |',
          '| `CurrencyInput allowNegative` | A tecla `-` alterna o sinal (descontos) |',
          '| `CurrencyInput max` | Digitar além do máximo é ignorado |',
          '| `PercentInput` | Trava as casas decimais digitadas (padrão 2); a tecla que estouraria a precisão é ignorada |',
          '| `CurrencyCell` | "R$ 1.234,56" à direita, dígitos alinhados; zero vira "—"; `redIfNegative` pinta o negativo |',
          '',
          'Eles são construídos sobre o `Input` e a `Table` do design system, sem estilo próprio.',
          'O valor financeiro nunca é `float` no servidor (Decimal); aqui o campo entrega um número em reais.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof CurrencyInput>

export default meta
type Story = StoryObj<typeof meta>

function ContributionField() {
  const [value, setValue] = useState(1234.56)
  return (
    <div className="w-64 space-y-1">
      <label htmlFor="aporte" className="text-sm font-medium">
        Valor do aporte
      </label>
      <CurrencyInput id="aporte" value={value} onChange={setValue} />
      <p className="text-xs text-muted-foreground">Valor guardado: {value}</p>
    </div>
  )
}

export const ValorEmReais: Story = {
  args: { value: 0, onChange: () => undefined },
  render: () => <ContributionField />,
  play: async ({ canvasElement }) => {
    const field = await within(canvasElement).findByLabelText('Valor do aporte')
    await userEvent.clear(field)
    await userEvent.type(field, '250099')
    // O formato brasileiro separa "R$" do número com espaço não separável (U+00A0).
    await expect(field).toHaveValue('R$ 2.500,99')
  },
}

function CappedField() {
  const [value, setValue] = useState(0)
  return (
    <div className="w-64 space-y-1">
      <label htmlFor="teto" className="text-sm font-medium">
        Valor (máximo R$ 1.000,00)
      </label>
      <CurrencyInput id="teto" value={value} onChange={setValue} max={1000} />
    </div>
  )
}

export const ComValorMaximo: Story = {
  args: { value: 0, onChange: () => undefined },
  render: () => <CappedField />,
}

function PercentField() {
  const [value, setValue] = useState(10.4)
  return (
    <div className="w-40 space-y-1">
      <label htmlFor="taxa" className="text-sm font-medium">
        Taxa administrativa (%)
      </label>
      <PercentInput id="taxa" value={value} onChange={setValue} />
    </div>
  )
}

export const Percentual: Story = {
  args: { value: 0, onChange: () => undefined },
  render: () => <PercentField />,
  play: async ({ canvasElement }) => {
    const field = await within(canvasElement).findByLabelText('Taxa administrativa (%)')
    await userEvent.clear(field)
    await userEvent.type(field, '10,12345')
    await expect(field).toHaveValue('10,12')
  },
}

export const CelulasDeTabela: Story = {
  args: { value: 0, onChange: () => undefined },
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Linha</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHead>Previsto</TableHead>
          <CurrencyCell value={48000} />
        </TableRow>
        <TableRow>
          <TableHead>Executado no mês</TableHead>
          <CurrencyCell value={0} />
        </TableRow>
        <TableRow>
          <TableHead>Diferença</TableHead>
          <CurrencyCell value={-1250.5} redIfNegative />
        </TableRow>
        <TableRow>
          <TableHead>Total</TableHead>
          <CurrencyCell value={46749.5} strong />
        </TableRow>
      </TableBody>
    </Table>
  ),
}
