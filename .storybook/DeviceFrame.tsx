import { useEffect, useRef, useState, type ReactNode } from 'react'
import { VIEWPORTS_DO_ECOSSISTEMA } from './viewports'

export type DeviceKey = keyof typeof VIEWPORTS_DO_ECOSSISTEMA

const NESTED_FRAME_PARAMETER = 'deviceFrame'
const MAX_FRAME_HEIGHT = 760

function pixelsOf(value: string): number {
  return Number.parseInt(value, 10)
}

function isInsideDeviceFrame(): boolean {
  return new URLSearchParams(window.location.search).get(NESTED_FRAME_PARAMETER) === 'off'
}

/** Nos testes (Vitest) a história precisa ficar na própria página, senão as interações não a alcançam. */
function isRunningTests(): boolean {
  return Boolean((import.meta as { env?: { VITEST?: unknown } }).env?.VITEST) || '__vitest_worker__' in window
}

interface DeviceFrameProps {
  device: DeviceKey
  storyId: string
  /** Na documentação a página é mais estreita que as faixas grandes, então a moldura aparece sempre (reduzida). */
  viewMode: string
  globals: Record<string, unknown>
  children: ReactNode
}

function serializeGlobals(globals: Record<string, unknown>): string {
  return ['fontScale', 'contrast', 'theme']
    .filter((key) => typeof globals[key] === 'string')
    .map((key) => `${key}:${String(globals[key])}`)
    .join(';')
}

/**
 * Mostra a história dentro de uma moldura com a largura real da faixa de tela (Mobile 375 px, Tablet 768 px...).
 * A moldura é um iframe, então as regras de tamanho de tela (md:, lg:...) respondem à largura dela, não à da página.
 * Se a janela já é do tamanho da faixa (ou menor), a história aparece direto.
 */
export function DeviceFrame({ device, storyId, viewMode, globals, children }: DeviceFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [availableWidth, setAvailableWidth] = useState(0)
  const viewport = VIEWPORTS_DO_ECOSSISTEMA[device]
  const width = pixelsOf(viewport.styles.width)
  const height = Math.min(pixelsOf(viewport.styles.height), MAX_FRAME_HEIGHT)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    const observer = new ResizeObserver(() => setAvailableWidth(element.clientWidth))
    observer.observe(element)
    setAvailableWidth(element.clientWidth)
    return () => observer.disconnect()
  }, [])

  const isNarrowerThanDevice = viewMode !== 'docs' && window.innerWidth <= width
  if (isInsideDeviceFrame() || isRunningTests() || isNarrowerThanDevice) return <>{children}</>

  const scale = availableWidth > 0 ? Math.min(1, availableWidth / width) : 1
  const source = `iframe.html?viewMode=story&id=${storyId}&${NESTED_FRAME_PARAMETER}=off&globals=${encodeURIComponent(serializeGlobals(globals))}`

  return (
    <div ref={containerRef} className="w-full">
      <p className="mb-2 text-center text-xs text-zinc-500">{viewport.name}</p>
      <div className="mx-auto overflow-hidden rounded-lg border border-zinc-300 shadow-sm" style={{ width: width * scale, height: height * scale }}>
        <iframe
          title={viewport.name}
          src={source}
          style={{ width, height, border: 0, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        />
      </div>
    </div>
  )
}
