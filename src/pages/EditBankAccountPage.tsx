import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { AppLayout, type UserRole } from '../components/farol/AppLayout'
import { DigitInput } from '../components/farol/forms/DigitInput'
import { EditFormCard } from '../components/farol/forms/EditFormCard'
import { FormErrorText, FormFieldLabel, FormTextInput } from '../components/farol/forms/FormField'

const BANK_CODE_DIGITS = 3
const BRANCH_MAX_LENGTH = 6
const ACCOUNT_MAX_LENGTH = 20
const PIX_KEY_TYPES = ['CPF', 'Celular', 'E-mail', 'Chave aleatória'] as const

// As mensagens de validação desta tela não foram capturadas do site; textos provisórios.
const editBankAccountSchema = z.object({
  bankName: z.string(),
  bankCode: z.string(),
  branch: z.string().trim().min(1, 'Informe a agência.'),
  accountNumber: z.string().trim().min(1, 'Informe o número da conta.'),
  pixKey: z.string().trim().min(1, 'Informe a chave Pix.'),
  pixKeyType: z.enum(PIX_KEY_TYPES, 'Escolha o tipo de chave Pix.'),
})

export type EditBankAccountValues = z.infer<typeof editBankAccountSchema>
type EditBankAccountInput = z.input<typeof editBankAccountSchema>

export interface EditBankAccountPageProps {
  userName: string
  initialValues: Partial<EditBankAccountValues> & Pick<EditBankAccountValues, 'bankName' | 'bankCode'>
  role?: UserRole
  onRoleChange?: (role: UserRole) => void
  onSave?: (values: EditBankAccountValues) => void
  onLogout?: () => void
}

export function EditBankAccountPage({
  userName,
  initialValues,
  role,
  onRoleChange,
  onSave,
  onLogout,
}: EditBankAccountPageProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditBankAccountInput, unknown, EditBankAccountValues>({
    resolver: zodResolver(editBankAccountSchema),
    defaultValues: { branch: '', accountNumber: '', pixKey: '', ...initialValues },
  })

  return (
    <AppLayout
      frame="profile-edit"
      breadcrumb={[
        { label: 'Home', href: '/home' },
        { label: 'Seu perfil', href: '/perfil' },
      ]}
      breadcrumbVariant="edit-compact"
      activeHref="/perfil"
      userName={userName}
      role={role}
      onRoleChange={onRoleChange}
      onLogout={onLogout}
    >
      <EditFormCard
        title="Editar dados bancários"
        headerStyle="compact"
        cancelHref="/perfil"
        onSubmit={handleSubmit((values) => onSave?.(values))}
      >
        <div className="space-y-5">
          <div>
            <FormFieldLabel htmlFor="bank-name" size="compact">
              Banco
            </FormFieldLabel>
            <FormTextInput id="bank-name" fieldSize="compact" readOnly disabled aria-invalid={false} {...register('bankName')} />
          </div>
          <div>
            <FormFieldLabel htmlFor="bank-code" size="compact">
              Código do Banco
            </FormFieldLabel>
            <Controller
              name="bankCode"
              control={control}
              render={({ field }) => (
                <DigitInput name="bank-code" groups={[BANK_CODE_DIGITS]} value={field.value} onChange={field.onChange} isDisabled />
              )}
            />
          </div>
          <div>
            <FormFieldLabel htmlFor="agency-number" size="compact">
              Agência (com dígito)
            </FormFieldLabel>
            <FormTextInput
              id="agency-number"
              fieldSize="compact"
              inputMode="text"
              autoComplete="off"
              maxLength={BRANCH_MAX_LENGTH}
              placeholder="Números e letras"
              aria-invalid={Boolean(errors.branch)}
              {...register('branch')}
            />
            {errors.branch && <FormErrorText id="agency-number-error">{errors.branch.message}</FormErrorText>}
          </div>
          <div>
            <FormFieldLabel htmlFor="account-number" size="compact">
              Número da Conta (com dígito)
            </FormFieldLabel>
            <FormTextInput
              id="account-number"
              fieldSize="compact"
              inputMode="text"
              autoComplete="off"
              maxLength={ACCOUNT_MAX_LENGTH}
              placeholder="Números e letras"
              aria-invalid={Boolean(errors.accountNumber)}
              {...register('accountNumber')}
            />
            {errors.accountNumber && <FormErrorText id="account-number-error">{errors.accountNumber.message}</FormErrorText>}
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <FormFieldLabel htmlFor="pix-key" size="compact">
              Chave Pix
            </FormFieldLabel>
            <FormTextInput id="pix-key" fieldSize="compact" aria-invalid={Boolean(errors.pixKey)} {...register('pixKey')} />
            {errors.pixKey && <FormErrorText id="pix-key-error">{errors.pixKey.message}</FormErrorText>}
          </div>
          <fieldset>
            <legend className="text-sm leading-5 font-medium text-zinc-950">Tipo de chave Pix</legend>
            <div className="mt-2 space-y-2">
              {PIX_KEY_TYPES.map((keyType) => (
                <label key={keyType} className="flex items-center gap-2.5 text-base leading-6 text-zinc-950">
                  <input type="radio" value={keyType} className="size-4.5 accent-[#0089e2]" {...register('pixKeyType')} />
                  <span>{keyType}</span>
                </label>
              ))}
            </div>
            {errors.pixKeyType && <FormErrorText id="pix-key-type-error">{errors.pixKeyType.message}</FormErrorText>}
          </fieldset>
        </div>
      </EditFormCard>
    </AppLayout>
  )
}
