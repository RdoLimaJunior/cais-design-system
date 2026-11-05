import type { ReactNode } from 'react'
import logoUrl from '../../../assets/farol/logo-cais.png'
import backgroundUrl from '../../../assets/farol/login-background.jpg'

export interface AuthLayoutProps {
  title: string
  description?: string
  descriptionMaxWidthClassName?: string
  children: ReactNode
}

/** Esqueleto das telas públicas: fundo de rede, logo, card central e "Powered by". */
export function AuthLayout({
  title,
  description,
  descriptionMaxWidthClassName = 'max-w-62.5',
  children,
}: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#eef1f7] px-4 py-10 font-sans">
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10"
        src={backgroundUrl}
      />
      <section className="relative z-10 flex w-full max-w-[360px] flex-col items-center">
        <img alt="Instituto CAIS" className="h-auto w-[260px]" src={logoUrl} />
        <div
          data-slot="card"
          className="mt-4 flex w-full flex-col gap-4 overflow-hidden rounded-xl border-none bg-white/95 py-4 text-sm text-card-foreground shadow-[0_18px_45px_rgba(15,23,42,0.12)] ring-1 ring-foreground/10 backdrop-blur-sm"
        >
          <div data-slot="card-header" className="grid auto-rows-min items-start gap-1 rounded-t-xl px-4 pt-8 pb-4 text-center">
            <div data-slot="card-title" className="text-xl font-semibold text-zinc-900">
              {title}
            </div>
            {description && (
              <p className={`mx-auto ${descriptionMaxWidthClassName} text-sm leading-5 font-medium text-zinc-500`}>
                {description}
              </p>
            )}
          </div>
          <div data-slot="card-content" className="px-8 pb-8">
            {children}
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center text-center">
          <p className="text-[10px] font-semibold text-zinc-500">Powered by</p>
          <div className="mt-1 flex w-full justify-center overflow-visible">
            <img alt="Instituto CAIS" className="block h-auto w-32 translate-x-1 object-contain" src={logoUrl} />
          </div>
        </div>
      </section>
    </main>
  )
}
