import { useEffect } from 'react'
import { useNavigate } from 'react-router'

function isPlainInternalLinkClick(event: MouseEvent, anchor: HTMLAnchorElement | null): anchor is HTMLAnchorElement {
  if (!anchor || event.defaultPrevented || event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  if (anchor.target && anchor.target !== '_self') return false
  return anchor.origin === window.location.origin && !anchor.hasAttribute('download')
}

/** Os componentes do design system usam `<a href>` simples; aqui os cliques viram navegação do React Router. */
export function useInternalLinks() {
  const navigate = useNavigate()

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest('a') ?? null
      if (!isPlainInternalLinkClick(event, anchor)) return
      event.preventDefault()
      navigate(anchor.pathname + anchor.search + anchor.hash)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [navigate])
}
