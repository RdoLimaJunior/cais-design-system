import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

/** `large` é o campo do Editar perfil (rótulo 16px, caixa de 44px); `compact`, o das telas de endereço e banco. */
export type FormFieldSize = 'large' | 'compact'

const INPUT_BASE_CLASSES =
  'ring-offset-background file:text-foreground placeholder:text-muted-foreground flex w-full border py-2 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-zinc-300 bg-white shadow-none focus-visible:border-[#0089e2] focus-visible:ring-1 focus-visible:ring-[#0089e2]'

const SIZE_CLASSES: Record<FormFieldSize, { label: string; input: string }> = {
  large: { label: 'text-base leading-6 font-medium text-zinc-950', input: 'mt-2 h-11 rounded-lg px-3 text-lg' },
  compact: { label: 'text-sm leading-5 font-medium text-zinc-950', input: 'mt-1 h-8 rounded px-2 text-sm' },
}

export interface FormFieldLabelProps {
  htmlFor?: string
  size?: FormFieldSize
  children: ReactNode
}

export function FormFieldLabel({ htmlFor, size = 'large', children }: FormFieldLabelProps) {
  return (
    <label data-slot="label" className={SIZE_CLASSES[size].label} htmlFor={htmlFor}>
      {children}
    </label>
  )
}

export function FormHelperText({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('mt-1 text-sm leading-5 text-[#64748B]', className)}>{children}</p>
}

export function FormErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1 text-sm leading-5 font-medium text-red-600">
      {children}
    </p>
  )
}

export interface FormTextInputProps extends ComponentProps<'input'> {
  fieldSize?: FormFieldSize
}

export function FormTextInput({ fieldSize = 'large', className, ...props }: FormTextInputProps) {
  return (
    <input data-slot="input" className={cn(INPUT_BASE_CLASSES, SIZE_CLASSES[fieldSize].input, className)} {...props} />
  )
}
