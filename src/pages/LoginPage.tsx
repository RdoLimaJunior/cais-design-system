import { useState, type FormEvent } from 'react'
import { AuthLayout } from '../components/farol/auth/AuthLayout'
import { AuthField, AuthPasswordField } from '../components/farol/auth/AuthField'
import { AuthSubmitButton } from '../components/farol/auth/AuthSubmitButton'
import { formatCpf } from '../lib/formatCpf'

type LoginMode = 'login' | 'recovery' | 'recovery-sent'

export interface LoginPageProps {
  initialMode?: LoginMode
  onLogin?: (cpf: string) => void
  onRequestPasswordRecovery?: (email: string) => void
}

function LoginForm({
  onSubmit,
  onForgotPassword,
}: {
  onSubmit: (cpf: string) => void
  onForgotPassword: () => void
}) {
  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setHasSubmitted(true)
    if (cpf && password) onSubmit(cpf)
  }

  return (
    <AuthLayout title="Entre na sua conta">
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="cpf"
          label="CPF"
          name="cpf"
          inputMode="numeric"
          autoComplete="username"
          placeholder="000.000.000-00"
          value={cpf}
          onChange={(event) => setCpf(formatCpf(event.target.value))}
          errorMessage={hasSubmitted && !cpf ? 'Informe seu CPF.' : undefined}
        />
        <AuthPasswordField
          id="password"
          label="Senha"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          errorMessage={hasSubmitted && !password ? 'Informe sua senha.' : undefined}
          labelAction={
            <button
              type="button"
              onClick={onForgotPassword}
              className="cursor-pointer text-[11px] font-medium text-zinc-600 transition hover:text-[#0089E2]"
            >
              Esqueceu a senha?
            </button>
          }
        />
        <AuthSubmitButton>Entrar</AuthSubmitButton>
      </form>
    </AuthLayout>
  )
}

function RecoveryForm({ onSubmit, onBack }: { onSubmit: (email: string) => void; onBack: () => void }) {
  const [email, setEmail] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit(email)
  }

  return (
    <AuthLayout
      title="Recupere sua senha"
      description="Será enviado um link de recuperação para o seu e-mail, caso ele esteja registrado."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField
          id="recovery-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <AuthSubmitButton className="flex items-center justify-center gap-2">Enviar link</AuthSubmitButton>
        <button
          type="button"
          onClick={onBack}
          className="block w-full cursor-pointer text-center text-[11px] font-semibold text-zinc-700 transition hover:text-[#0089E2]"
        >
          Voltar para o login
        </button>
      </form>
    </AuthLayout>
  )
}

// A confirmação de envio não foi capturada do site (exigiria disparar um e-mail real); texto provisório.
function RecoverySentNotice({ onBack }: { onBack: () => void }) {
  return (
    <AuthLayout
      title="Verifique seu e-mail"
      description="Se o e-mail informado estiver registrado, você receberá um link para redefinir a senha."
    >
      <button
        type="button"
        onClick={onBack}
        className="block w-full cursor-pointer text-center text-[11px] font-semibold text-zinc-700 transition hover:text-[#0089E2]"
      >
        Voltar para o login
      </button>
    </AuthLayout>
  )
}

export function LoginPage({ initialMode = 'login', onLogin, onRequestPasswordRecovery }: LoginPageProps) {
  const [mode, setMode] = useState<LoginMode>(initialMode)

  if (mode === 'recovery') {
    return (
      <RecoveryForm
        onBack={() => setMode('login')}
        onSubmit={(email) => {
          onRequestPasswordRecovery?.(email)
          setMode('recovery-sent')
        }}
      />
    )
  }

  if (mode === 'recovery-sent') return <RecoverySentNotice onBack={() => setMode('login')} />

  return <LoginForm onSubmit={(cpf) => onLogin?.(cpf)} onForgotPassword={() => setMode('recovery')} />
}
