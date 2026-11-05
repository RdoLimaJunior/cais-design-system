import type { ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'

export interface LogoutDialogProps {
  /** Elemento que abre o modal. Omita quando o modal for controlado por `open`. */
  trigger?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  onConfirm?: () => void
  /** Nome do sistema citado no texto do modal. */
  systemName?: string
}

export function LogoutDialog({ trigger, open, defaultOpen, onOpenChange, onConfirm, systemName = 'Farol' }: LogoutDialogProps) {
  return (
    <AlertDialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="max-w-sm gap-4 rounded-xl border-zinc-200 bg-white p-6 shadow-lg duration-150 data-[size=default]:sm:max-w-sm">
        <AlertDialogHeader className="gap-1.5 text-center sm:text-left">
          <AlertDialogTitle className="text-base text-zinc-950">Sair do sistema?</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-500">
            Sua sessão será encerrada e você precisará entrar novamente para acessar o {systemName}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-lg border-zinc-200 bg-white text-sm text-zinc-950 hover:bg-zinc-100 hover:text-zinc-950">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="h-8 rounded-lg border-0 bg-red-600 px-3.5 text-sm text-white transition-colors hover:bg-red-700 focus-visible:ring-3 focus-visible:ring-red-400/30"
          >
            Sair
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
