import { AuthLayout } from '../components/farol/auth/AuthLayout'
import { Button } from '../components/ui/button'

export type InviteProblem = 'invalid' | 'expired'

const INVITE_MESSAGES: Record<InviteProblem, { title: string; description: string }> = {
  invalid: {
    title: 'Convite indisponível',
    description: 'Este link de convite é inválido. Entre em contato com a administração para solicitar um novo convite.',
  },
  expired: {
    title: 'Convite expirado',
    description: 'Este convite expirou. Entre em contato com a administração para solicitar um novo convite.',
  },
}

export function InviteStatusPage({ problem }: { problem: InviteProblem }) {
  const { title, description } = INVITE_MESSAGES[problem]

  return (
    <AuthLayout title={title}>
      <div className="text-center">
        <p className="text-sm leading-5 text-zinc-500">{description}</p>
        <Button
          asChild
          className="mt-6 h-10 w-full cursor-pointer rounded-md border-transparent bg-[#0089E2] text-xs font-semibold text-white shadow-sm transition hover:bg-[#007bcf]"
        >
          <a href="/login">Ir para o login</a>
        </Button>
      </div>
    </AuthLayout>
  )
}
