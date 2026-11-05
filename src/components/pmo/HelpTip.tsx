import { IconInfoCircle } from '@tabler/icons-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

/** Ícone de ajuda que explica um título ou um número. Precisa de um TooltipProvider acima (um por aplicação). */
export function HelpTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label="Ajuda" className="text-muted-foreground">
          <IconInfoCircle size={14} aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px]">{text}</TooltipContent>
    </Tooltip>
  )
}
