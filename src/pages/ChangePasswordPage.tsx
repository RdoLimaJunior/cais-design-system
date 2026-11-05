import { zodResolver } from '@hookform/resolvers/zod'
import { IconCheck } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AppLayout, type UserRole } from '../components/farol/AppLayout'
import { AuthPasswordField } from '../components/farol/auth/AuthField'
import { PageTitle } from '../components/farol/PageHeading'
import { Button } from '../components/ui/button'
import { isStrongPassword } from '../lib/password'

const FIELD_LABEL_CLASSES = 'text-sm leading-5 font-medium text-zinc-950'

// As mensagens de validação desta tela não foram capturadas do site; textos provisórios.
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe sua senha atual.'),
    newPassword: z.string().refine(isStrongPassword, 'A senha não atende aos requisitos.'),
    newPasswordConfirmation: z.string(),
  })
  .refine((values) => values.newPassword === values.newPasswordConfirmation, {
    path: ['newPasswordConfirmation'],
    message: 'As senhas não conferem.',
  })

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>

export interface ChangePasswordPageProps {
  userName: string
  role?: UserRole
  onRoleChange?: (role: UserRole) => void
  onSave?: (values: ChangePasswordValues) => void
  onLogout?: () => void
}

export function ChangePasswordPage({ userName, role, onRoleChange, onSave, onLogout }: ChangePasswordPageProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(changePasswordSchema) })

  return (
    <AppLayout
      frame="profile-edit"
      breadcrumb={[]}
      activeHref="/perfil"
      userName={userName}
      role={role}
      onRoleChange={onRoleChange}
      onLogout={onLogout}
    >
      <article className="min-h-[calc(100dvh-52px)] overflow-hidden rounded bg-white shadow-sm">
        <header className="border-b border-zinc-100 px-5 py-5">
          <PageTitle>Alterar senha</PageTitle>
        </header>
        <form className="max-w-[360px] space-y-5 px-5 py-5" onSubmit={handleSubmit((values) => onSave?.(values))}>
          <AuthPasswordField
            id="current-password"
            label="Senha atual"
            labelClassName={FIELD_LABEL_CLASSES}
            autoComplete="current-password"
            errorMessage={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <AuthPasswordField
            id="new-password"
            label="Nova senha"
            labelClassName={FIELD_LABEL_CLASSES}
            autoComplete="new-password"
            errorMessage={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <AuthPasswordField
            id="new-password-confirmation"
            label="Confirme a nova senha"
            labelClassName={FIELD_LABEL_CLASSES}
            autoComplete="new-password"
            errorMessage={errors.newPasswordConfirmation?.message}
            {...register('newPasswordConfirmation')}
          />
          <p className="text-sm leading-5 text-[#64748B]">
            Use pelo menos 8 caracteres, com maiúscula, minúscula, número e caractere especial.
          </p>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="h-8 rounded border-zinc-200 bg-white px-4 text-[10px] text-zinc-950 hover:bg-zinc-100"
            >
              <a href="/perfil">Cancelar</a>
            </Button>
            <Button
              type="submit"
              className="h-8 rounded border-transparent bg-[#0089e2] px-4 text-[10px] font-semibold text-white hover:bg-[#0077c5]"
            >
              <IconCheck className="size-3.5" />
              Salvar senha
            </Button>
          </div>
        </form>
      </article>
    </AppLayout>
  )
}
