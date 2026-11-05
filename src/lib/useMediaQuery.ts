import { useSyncExternalStore } from 'react'

/** Acompanha uma media query (por exemplo `(max-width: 47.99rem)` para telas abaixo de tablet). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', notify)
      return () => mediaQuery.removeEventListener('change', notify)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
