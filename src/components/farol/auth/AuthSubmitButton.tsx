import type { ComponentProps } from 'react'
import { Button } from '../../ui/button'
import { cn } from '../../../lib/utils'

export function AuthSubmitButton({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      type="submit"
      className={cn(
        'h-10 w-full cursor-pointer rounded-md border-transparent bg-[#0089E2] text-xs font-semibold text-white shadow-sm transition hover:bg-[#007bcf]',
        className,
      )}
      {...props}
    />
  )
}
