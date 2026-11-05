import type { FormEventHandler, ReactNode } from 'react'
import { IconCheck } from '@tabler/icons-react'
import { Button } from '../../ui/button'
import { PageTitle } from '../PageHeading'

/** `large` é o cabeçalho do Editar perfil; `compact`, o das telas de endereço e dados bancários. */
export type EditFormHeaderStyle = 'large' | 'compact'

const FOOTER_BUTTON_BASE = 'h-8 rounded px-4 text-[10px]'

export interface EditFormCardProps {
  title: string
  headerStyle?: EditFormHeaderStyle
  cancelHref: string
  onSubmit: FormEventHandler<HTMLFormElement>
  children: ReactNode
}

export function EditFormCard({ title, headerStyle = 'large', cancelHref, onSubmit, children }: EditFormCardProps) {
  const isLarge = headerStyle === 'large'

  return (
    <article className="min-h-[calc(100dvh-52px)] overflow-hidden rounded bg-white shadow-sm">
      <header className={isLarge ? 'border-b border-zinc-200 px-5 py-6' : 'border-b border-zinc-100 px-5 py-5'}>
        {isLarge ? <PageTitle>{title}</PageTitle> : <h1 className="text-sm font-black text-[#0089e2]">{title}</h1>}
      </header>
      <form noValidate onSubmit={onSubmit} className="flex min-h-[calc(100dvh-111px)] flex-col">
        <div className="flex-1 bg-[#fbfcfd] px-5 py-5">
          <div className="grid max-w-[820px] gap-x-12 gap-y-5 md:grid-cols-2">{children}</div>
        </div>
        <footer className="flex justify-end gap-2 border-t border-zinc-200 px-5 py-4">
          <Button
            asChild
            variant="outline"
            className={`${FOOTER_BUTTON_BASE} border-red-500 bg-white text-red-600 hover:bg-red-50 hover:text-red-700`}
          >
            <a href={cancelHref}>Cancelar edição</a>
          </Button>
          <Button
            type="submit"
            className={`${FOOTER_BUTTON_BASE} border-transparent bg-[#0089e2] font-semibold text-white hover:bg-[#0077c5]`}
          >
            Salvar edição
            <IconCheck className="size-3.5" />
          </Button>
        </footer>
      </form>
    </article>
  )
}
