import { useState, type FormEvent } from 'react'
import { AuthField, AuthPasswordField } from '../../components/farol/auth/AuthField'
import { AuthLayout } from '../../components/farol/auth/AuthLayout'
import { AuthSubmitButton } from '../../components/farol/auth/AuthSubmitButton'
import { Button } from '../../components/ui/button'
import { Checkbox } from '../../components/ui/checkbox'
import { Label } from '../../components/ui/label'

const PLATFORM_TITLE = 'Plataforma de Governança e Gestão de Projetos'
const MINIMUM_PASSWORD_LENGTH = 8

export interface PmoLoginPageProps {
  onLogin?: (email: string) => void
  onForgotPassword?: () => void
}

/** Login do CAIS PMO: e-mail e senha, "lembrar-me" e entrada com Google. */
export function PmoLoginPage({ onLogin, onForgotPassword }: PmoLoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setHasSubmitted(true)
    if (email && password) onLogin?.(email)
  }

  return (
    <AuthLayout title="Entre na sua conta" description={PLATFORM_TITLE}>
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="email"
          label="E-mail *"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="seu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          errorMessage={hasSubmitted && !email ? 'Informe o e-mail.' : undefined}
        />
        <AuthPasswordField
          id="password"
          label="Senha *"
          name="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          errorMessage={hasSubmitted && !password ? 'Informe a senha.' : undefined}
        />
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="font-normal">
              Lembrar-me
            </Label>
          </div>
          <button type="button" className="text-primary hover:underline" onClick={onForgotPassword}>
            Esqueceu a senha?
          </button>
        </div>
        <AuthSubmitButton>Acessar Sistema</AuthSubmitButton>
        <Button type="button" variant="outline" className="w-full">
          Entrar com Google
        </Button>
      </form>
    </AuthLayout>
  )
}

export function PmoRecoverPasswordPage({ onBack }: { onBack?: () => void }) {
  return (
    <AuthLayout title="Recuperar senha" description={PLATFORM_TITLE}>
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">A redefinição de senha ainda não é feita por aqui.</p>
        <Button type="button" variant="outline" className="w-full" onClick={onBack}>
          Voltar para o Login
        </Button>
      </div>
    </AuthLayout>
  )
}

export interface PmoForcePasswordChangePageProps {
  onSubmit?: () => void
  onLogout?: () => void
}

/** Primeiro acesso: o usuário novo nasce com senha padrão e precisa trocá-la antes de usar qualquer outra tela. */
export function PmoForcePasswordChangePage({ onSubmit, onLogout }: PmoForcePasswordChangePageProps) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const isTooShort = next.length < MINIMUM_PASSWORD_LENGTH
  const doesNotMatch = next !== confirmation

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setHasSubmitted(true)
    if (current && !isTooShort && !doesNotMatch) onSubmit?.()
  }

  return (
    <AuthLayout title="Troque sua senha" description={PLATFORM_TITLE}>
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthPasswordField
          id="current-password"
          label="Senha atual *"
          autoComplete="current-password"
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          errorMessage={hasSubmitted && !current ? 'Informe a senha atual.' : undefined}
        />
        <AuthPasswordField
          id="new-password"
          label="Nova senha *"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          value={next}
          onChange={(event) => setNext(event.target.value)}
          errorMessage={hasSubmitted && isTooShort ? 'A nova senha precisa ter ao menos 8 caracteres.' : undefined}
        />
        <AuthPasswordField
          id="confirm-password"
          label="Confirmar nova senha *"
          autoComplete="new-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          errorMessage={hasSubmitted && doesNotMatch ? 'As senhas não conferem.' : undefined}
        />
        <p className="text-xs text-muted-foreground">
          Até trocar a senha, nenhuma outra tela do sistema fica disponível.
        </p>
        <AuthSubmitButton>Trocar senha e continuar</AuthSubmitButton>
        <Button type="button" variant="ghost" className="w-full" onClick={onLogout}>
          Sair
        </Button>
      </form>
    </AuthLayout>
  )
}
