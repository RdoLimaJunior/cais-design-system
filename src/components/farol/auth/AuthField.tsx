import { useState, type ComponentProps } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { cn } from '../../../lib/utils'

const INPUT_CLASSES =
  'ring-offset-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus-visible:ring-2 focus-visible:ring-[#0089E2] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'

const DEFAULT_LABEL_CLASSES = 'text-xs font-semibold text-zinc-700'

export interface AuthFieldProps extends Omit<ComponentProps<'input'>, 'id'> {
  id: string
  label: string
  errorMessage?: string
}

export function AuthField({ id, label, errorMessage, className, ...inputProps }: AuthFieldProps) {
  const errorId = `${id}-error`
  return (
    <div className="space-y-2">
      <label data-slot="label" className={DEFAULT_LABEL_CLASSES} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        data-slot="input"
        className={cn(INPUT_CLASSES, className)}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? errorId : undefined}
        {...inputProps}
      />
      {errorMessage && (
        <p id={errorId} className="text-xs font-medium text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export interface AuthPasswordFieldProps extends Omit<AuthFieldProps, 'type'> {
  labelAction?: React.ReactNode
  labelClassName?: string
}

export function AuthPasswordField({
  id,
  label,
  errorMessage,
  labelAction,
  labelClassName = DEFAULT_LABEL_CLASSES,
  className,
  ...inputProps
}: AuthPasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)
  const errorId = `${id}-error`
  const toggleLabel = isVisible ? 'Ocultar senha' : 'Mostrar senha'
  const ToggleIcon = isVisible ? IconEyeOff : IconEye
  const passwordLabel = (
    <label data-slot="label" className={labelClassName} htmlFor={id}>
      {label}
    </label>
  )

  return (
    <div className="space-y-2">
      {labelAction ? (
        <div className="flex items-center justify-between gap-4">
          {passwordLabel}
          {labelAction}
        </div>
      ) : (
        passwordLabel
      )}
      <div className="relative">
        <input
          id={id}
          data-slot="input"
          className={cn(INPUT_CLASSES, 'pr-10', className)}
          type={isVisible ? 'text' : 'password'}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? errorId : undefined}
          {...inputProps}
        />
        <button
          type="button"
          aria-label={toggleLabel}
          title={toggleLabel}
          onClick={() => setIsVisible((current) => !current)}
          className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-zinc-500 transition hover:text-[#0089e2] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0089e2]"
        >
          <ToggleIcon className="size-4" />
        </button>
      </div>
      {errorMessage && (
        <p id={errorId} className="text-xs font-medium text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
