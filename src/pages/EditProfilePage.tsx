import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { AppLayout, type UserRole } from '../components/farol/AppLayout'
import { DigitInput } from '../components/farol/forms/DigitInput'
import { EditFormCard } from '../components/farol/forms/EditFormCard'
import {
  FormErrorText,
  FormFieldLabel,
  FormHelperText,
  FormTextInput,
} from '../components/farol/forms/FormField'
import { PhotoUploadField } from '../components/farol/forms/PhotoUploadField'

const CPF_DIGIT_COUNT = 11
const PHONE_AREA_CODE_DIGITS = 2
const PHONE_NUMBER_DIGITS = 9

// As mensagens de validação desta tela não foram capturadas do site; textos provisórios.
const editProfileSchema = z.object({
  fullName: z.string().trim().min(1, 'Informe seu nome completo.'),
  socialName: z.string(),
  cpf: z.string().length(CPF_DIGIT_COUNT, 'Informe um CPF válido.'),
  // Fixo tem 10 dígitos (DDD + 8) e celular tem 11 (DDD + 9).
  phone: z.string().min(PHONE_AREA_CODE_DIGITS + PHONE_NUMBER_DIGITS - 1, 'Informe um telefone válido.'),
  personalEmail: z.string().trim().pipe(z.email('Informe um e-mail válido.')),
  corporateEmail: z.union([z.literal(''), z.string().trim().pipe(z.email('Informe um e-mail válido.'))]),
})

/** `photoFile` só vem preenchido quando a pessoa escolheu uma foto nova; `photoUrl` é só a prévia. */
export type EditProfileValues = z.infer<typeof editProfileSchema> & { photoUrl: string | null; photoFile?: File | null }

export interface EditProfilePageProps {
  userName: string
  initialValues: EditProfileValues
  role?: UserRole
  onRoleChange?: (role: UserRole) => void
  onSave?: (values: EditProfileValues) => void
  onLogout?: () => void
}

function releasePreviewUrl(previewUrlRef: { current: string | null }) {
  if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
  previewUrlRef.current = null
}

export function EditProfilePage({
  userName,
  initialValues,
  role,
  onRoleChange,
  onSave,
  onLogout,
}: EditProfilePageProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialValues.photoUrl)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const previewUrlRef = useRef<string | null>(null)

  // A prévia é uma URL temporária do navegador; precisa ser liberada ao trocar a foto e ao sair da tela.
  useEffect(() => () => releasePreviewUrl(previewUrlRef), [])
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(editProfileSchema), defaultValues: initialValues })

  function replacePhoto(file: File) {
    releasePreviewUrl(previewUrlRef)
    previewUrlRef.current = URL.createObjectURL(file)
    setPhotoUrl(previewUrlRef.current)
    setPhotoFile(file)
  }

  function removePhoto() {
    releasePreviewUrl(previewUrlRef)
    setPhotoUrl(null)
    setPhotoFile(null)
  }

  const submit = handleSubmit((values) => onSave?.({ ...values, photoUrl, photoFile }))

  return (
    <AppLayout
      frame="profile-edit"
      breadcrumb={[
        { label: 'Home', href: '/home' },
        { label: 'Seu perfil', href: '/perfil' },
      ]}
      breadcrumbVariant="edit"
      activeHref="/perfil"
      userName={userName}
      role={role}
      onRoleChange={onRoleChange}
      onLogout={onLogout}
    >
      <EditFormCard title="Editar perfil" cancelHref="/perfil" onSubmit={submit}>
        <div className="space-y-5">
          <div>
            <FormFieldLabel htmlFor="full-name">Nome completo</FormFieldLabel>
            <FormTextInput
              id="full-name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'full-name-error' : undefined}
              {...register('fullName')}
            />
            {errors.fullName ? (
              <FormErrorText id="full-name-error">{errors.fullName.message}</FormErrorText>
            ) : (
              <FormHelperText>Preencha conforme seu documento de identidade.</FormHelperText>
            )}
          </div>
          <div>
            <FormFieldLabel htmlFor="cpf">CPF</FormFieldLabel>
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <DigitInput
                  name="cpf"
                  groups={[CPF_DIGIT_COUNT]}
                  value={field.value}
                  onChange={field.onChange}
                  hasError={Boolean(errors.cpf)}
                />
              )}
            />
            {errors.cpf && <FormErrorText id="cpf-error">{errors.cpf.message}</FormErrorText>}
          </div>
          <div>
            <FormFieldLabel htmlFor="phone">Telefone</FormFieldLabel>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <DigitInput
                  name="phone"
                  groups={[PHONE_AREA_CODE_DIGITS, PHONE_NUMBER_DIGITS]}
                  inputMode="tel"
                  autoComplete="tel"
                  value={field.value}
                  onChange={field.onChange}
                  hasError={Boolean(errors.phone)}
                />
              )}
            />
            {errors.phone && <FormErrorText id="phone-error">{errors.phone.message}</FormErrorText>}
          </div>
          <div>
            <FormFieldLabel htmlFor="corporate-email">E-mail Corporativo</FormFieldLabel>
            <FormTextInput
              id="corporate-email"
              type="email"
              aria-invalid={Boolean(errors.corporateEmail)}
              {...register('corporateEmail')}
            />
            {errors.corporateEmail ? (
              <FormErrorText id="corporate-email-error">{errors.corporateEmail.message}</FormErrorText>
            ) : (
              <FormHelperText>Se ainda não tiver, deixe em branco.</FormHelperText>
            )}
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <FormFieldLabel htmlFor="social-name">Nome social</FormFieldLabel>
            <FormTextInput id="social-name" {...register('socialName')} />
            <FormHelperText>Caso use um nome social diferente do seu documento.</FormHelperText>
          </div>
          <div>
            <FormFieldLabel htmlFor="personal-email">E-mail Pessoal</FormFieldLabel>
            <FormTextInput
              id="personal-email"
              type="email"
              aria-invalid={Boolean(errors.personalEmail)}
              {...register('personalEmail')}
            />
            {errors.personalEmail && (
              <FormErrorText id="personal-email-error">{errors.personalEmail.message}</FormErrorText>
            )}
          </div>
          <PhotoUploadField
            photoUrl={photoUrl}
            altText="Foto para comunicação interna"
            onPhotoChange={replacePhoto}
            onPhotoRemove={removePhoto}
          />
        </div>
      </EditFormCard>
    </AppLayout>
  )
}
