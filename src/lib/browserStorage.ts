/** Leitura e escrita que não quebram quando o navegador bloqueia o armazenamento local. */
export function readStoredValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function removeStoredValue(key: string) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Sem armazenamento disponível: nada a remover.
  }
}

export function writeStoredValue(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Sem armazenamento disponível: a preferência vale só até recarregar a página.
  }
}
