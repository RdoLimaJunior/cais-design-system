import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface ProfileFieldProps {
  label: string
  value?: ReactNode
  valueClassName?: string
}

export function ProfileField({ label, value, valueClassName }: ProfileFieldProps) {
  return (
    <div>
      <dt className="text-base leading-6 font-medium text-[#0F172A]">{label}</dt>
      <dd className={cn('mt-0.5 text-base leading-6 font-normal text-[#64748B]', valueClassName)}>{value}</dd>
    </div>
  )
}

export function ProfileFieldList({ fields, className }: { fields: ProfileFieldProps[]; className?: string }) {
  return (
    <dl className={cn('grid content-start gap-5', className)}>
      {fields.map((field) => (
        <ProfileField key={field.label} {...field} />
      ))}
    </dl>
  )
}
