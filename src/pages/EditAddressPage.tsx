import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { AppLayout, type UserRole } from '../components/farol/AppLayout'
import { DigitInput } from '../components/farol/forms/DigitInput'
import { EditFormCard } from '../components/farol/forms/EditFormCard'
import { FormErrorText, FormFieldLabel, FormTextInput } from '../components/farol/forms/FormField'

const POSTAL_CODE_DIGITS = 8
const ADDRESS_NUMBER_DIGITS = 6
const STATE_ABBREVIATION_LENGTH = 2

// As mensagens de validação desta tela não foram capturadas do site; textos provisórios.
const editAddressSchema = z.object({
  postalCode: z.string().length(POSTAL_CODE_DIGITS, 'Informe um CEP válido.'),
  street: z.string().trim().min(1, 'Informe o logradouro.'),
  number: z.string().min(1, 'Informe o número.'),
  complement: z.string(),
  neighborhood: z.string().trim().min(1, 'Informe o bairro.'),
  city: z.string().trim().min(1, 'Informe a cidade.'),
  state: z.string().length(STATE_ABBREVIATION_LENGTH, 'Informe a UF.'),
})

export type EditAddressValues = z.infer<typeof editAddressSchema>

export interface EditAddressPageProps {
  userName: string
  initialValues: EditAddressValues
  role?: UserRole
  onRoleChange?: (role: UserRole) => void
  onSave?: (values: EditAddressValues) => void
  onLogout?: () => void
}

function TextField({
  id,
  label,
  error,
  ...inputProps
}: { id: string; label: string; error?: string } & React.ComponentProps<'input'>) {
  return (
    <div>
      <FormFieldLabel htmlFor={id} size="compact">
        {label}
      </FormFieldLabel>
      <FormTextInput id={id} fieldSize="compact" aria-invalid={Boolean(error)} {...inputProps} />
      {error && <FormErrorText id={`${id}-error`}>{error}</FormErrorText>}
    </div>
  )
}

export function EditAddressPage({
  userName,
  initialValues,
  role,
  onRoleChange,
  onSave,
  onLogout,
}: EditAddressPageProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(editAddressSchema), defaultValues: initialValues })

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
        title="Editar endereço"
        headerStyle="compact"
        cancelHref="/perfil"
        onSubmit={handleSubmit((values) => onSave?.(values))}
      >
        <div className="space-y-5">
          <div>
            <FormFieldLabel htmlFor="zip-code" size="compact">
              CEP
            </FormFieldLabel>
            <Controller
              name="postalCode"
              control={control}
              render={({ field }) => (
                <DigitInput
                  name="zip-code"
                  groups={[POSTAL_CODE_DIGITS]}
                  value={field.value}
                  onChange={field.onChange}
                  hasError={Boolean(errors.postalCode)}
                />
              )}
            />
            {errors.postalCode && <FormErrorText id="zip-code-error">{errors.postalCode.message}</FormErrorText>}
          </div>
          <TextField id="street" label="Logradouro" error={errors.street?.message} {...register('street')} />
          <div>
            <FormFieldLabel htmlFor="address-number" size="compact">
              Número
            </FormFieldLabel>
            <Controller
              name="number"
              control={control}
              render={({ field }) => (
                <DigitInput
                  name="address-number"
                  groups={[ADDRESS_NUMBER_DIGITS]}
                  value={field.value}
                  onChange={field.onChange}
                  hasError={Boolean(errors.number)}
                />
              )}
            />
            {errors.number && <FormErrorText id="address-number-error">{errors.number.message}</FormErrorText>}
          </div>
          <TextField id="complement" label="Complemento" {...register('complement')} />
        </div>
        <div className="space-y-5">
          <TextField id="neighborhood" label="Bairro" error={errors.neighborhood?.message} {...register('neighborhood')} />
          <TextField id="city" label="Cidade" error={errors.city?.message} {...register('city')} />
          <TextField
            id="state"
            label="Estado (UF)"
            maxLength={STATE_ABBREVIATION_LENGTH}
            error={errors.state?.message}
            {...register('state')}
          />
        </div>
      </EditFormCard>
    </AppLayout>
  )
}
