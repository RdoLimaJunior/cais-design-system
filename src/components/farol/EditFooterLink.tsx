import { IconPencil } from '@tabler/icons-react'

export interface EditFooterLinkProps {
  href: string
  label?: string
}

export function EditFooterLink({ href, label = 'Editar' }: EditFooterLinkProps) {
  return (
    <a
      className="flex h-8 items-center gap-2 rounded-lg border border-[#0089E2] px-4 text-xs text-[#0089E2] hover:bg-[#e8f5ff]"
      href={href}
    >
      <IconPencil className="size-3.5" /> {label}
    </a>
  )
}
