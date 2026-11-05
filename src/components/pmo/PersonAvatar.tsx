import { Avatar, AvatarFallback } from '../ui/avatar'

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')
}

/** Avatar de pessoa com as iniciais. Cor única do master (nunca uma cor por pessoa). */
export function PersonAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
        {initialsOf(name).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
