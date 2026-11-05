import { useState, type FormEvent } from 'react'
import { AuthLayout } from '../components/farol/auth/AuthLayout'
import { AuthPasswordField } from '../components/farol/auth/AuthField'
import { AuthSubmitButton } from '../components/farol/auth/AuthSubmitButton'
import { isStrongPassword } from '../lib/password'

export interface ResetPasswordPageProps {
  onSubmit?: (newPassword: string) => void
}

// As mensagens de erro desta tela não foram capturadas do site (exigiriam um token válido); textos provisórios.
const WEAK_PASSWORD_MESSAGE = 'A senha não atende aos requisitos.'
const PASSWORD_MISMATCH_MESSAGE = 'As senhas não conferem.'

export function ResetPasswordPage({ onSubmit }: ResetPasswordPageProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const passwordError = hasSubmitted && !isStrongPassword(newPassword) ? WEAK_PASSWORD_MESSAGE : undefined
  const confirmationError = hasSubmitted && confirmation !== newPassword ? PASSWORD_MISMATCH_MESSAGE : undefined

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setHasSubmitted(true)
    if (isStrongPassword(newPassword) && confirmation === newPassword) onSubmit?.(newPassword)
  }

  return (
    <AuthLayout
      title="Defina uma nova senha"
      description="Use pelo menos 8 caracteres, com maiúscula, minúscula, número e caractere especial."
      descriptionMaxWidthClassName="max-w-[250px]"
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthPasswordField
          id="new-password"
          label="Nova senha"
          name="newPassword"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          errorMessage={passwordError}
        />
        <AuthPasswordField
          id="new-password-confirmation"
          label="Confirme a nova senha"
          name="newPasswordConfirmation"
          autoComplete="new-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          errorMessage={confirmationError}
        />
        <AuthSubmitButton>Definir nova senha</AuthSubmitButton>
      </form>
    </AuthLayout>
  )
}
