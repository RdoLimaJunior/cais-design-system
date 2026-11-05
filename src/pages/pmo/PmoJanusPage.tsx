import { useEffect, useRef, useState } from 'react'
import { IconBrain, IconSend } from '@tabler/icons-react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Spinner } from '../../components/ui/spinner'
import { Textarea } from '../../components/ui/textarea'
import type { PmoRole } from '../../components/pmo/navigation'
import { PersonAvatar } from '../../components/pmo/PersonAvatar'
import { PmoShell } from '../../components/pmo/PmoShell'
import { PageSubtitle, PageTitle } from '../../components/farol/PageHeading'
import { cn } from '../../lib/utils'

interface Message {
  id: number
  author: 'user' | 'janus'
  content: string
  time: string
}

const SUGGESTIONS = [
  'Qual é a saúde financeira geral dos meus projetos?',
  'Como funciona a Lei de Informática 8.248/91?',
  'Quais são as 11 rubricas oficiais permitidas?',
  'Como evitar glosas de compliance?',
  'Qual é o teto máximo para Taxa Administrativa?',
  'Como funciona o Motor RH para cálculo de custos?',
]

const EXAMPLE_ANSWER =
  'Esta é uma resposta de exemplo do Storybook. Na aplicação, o Janus responde com base nos dados dos seus projetos e na Lei 8.248/91.'

function nowLabel(): string {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function JanusAvatar({ className }: { className?: string }) {
  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground', className)}>
      <IconBrain size={16} aria-hidden="true" />
    </span>
  )
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2" role="status" aria-label="Janus está respondendo">
      <JanusAvatar className="size-7" />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    </div>
  )
}

export interface PmoJanusPageProps {
  role?: PmoRole
  userName?: string
  initialMessages?: Message[]
}

/** Janus IA: conversa com o consultor de compliance e planejamento financeiro, com perguntas sugeridas. */
export function PmoJanusPage({ role = 'GESTOR', userName = 'Ana Gestora', initialMessages = [] }: PmoJanusPageProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isAnswering, setIsAnswering] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: 'smooth' })
  }, [messages, isAnswering])

  function send(text?: string) {
    const content = (text ?? input).trim()
    if (!content || isAnswering) return
    setMessages((previous) => [...previous, { id: previous.length + 1, author: 'user', content, time: nowLabel() }])
    setInput('')
    setIsAnswering(true)
    window.setTimeout(() => {
      setMessages((previous) => [...previous, { id: previous.length + 1, author: 'janus', content: EXAMPLE_ANSWER, time: nowLabel() }])
      setIsAnswering(false)
    }, 900)
  }

  return (
    <PmoShell activeHref="/app/janus" breadcrumb={[{ label: 'Janus IA' }]} role={role} userName={userName}>
      <div className="flex min-h-[calc(100dvh-100px)] flex-col gap-4">
        <div className="flex items-center gap-3">
          <JanusAvatar className="size-11" />
          <div className="min-w-0 flex-1">
            <PageTitle>
              <span className="flex flex-wrap items-center gap-2">
                Janus IA
                <Badge variant="info">IA Híbrida</Badge>
              </span>
            </PageTitle>
            <PageSubtitle>Seu consultor especialista em compliance e planejamento financeiro</PageSubtitle>
          </div>
        </div>

        <Card className="min-h-0 flex-1 gap-0 overflow-hidden py-0">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            {messages.length === 0 ? (
              <div className="mx-auto max-w-2xl py-6 text-center">
                <JanusAvatar className="mx-auto mb-4 size-14" />
                <h2 className="text-lg font-semibold">Bem-vindo ao Janus</h2>
                <p className="mx-auto mt-1 mb-6 max-w-md text-sm text-muted-foreground">
                  Especialista em Lei 8.248/91, compliance MCTI e gestão financeira de P&amp;D. Pergunte qualquer coisa, ou comece por uma destas:
                </p>
                <div className="grid grid-cols-1 gap-2.5 text-left sm:grid-cols-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <Button
                      key={suggestion}
                      type="button"
                      variant="outline"
                      className="h-auto justify-start rounded-xl p-3.5 text-left font-normal whitespace-normal"
                      onClick={() => send(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4" aria-live="polite">
                {messages.map((message) => (
                  <div key={message.id} className={cn('flex items-end gap-2', message.author === 'user' && 'flex-row-reverse')}>
                    {message.author === 'janus' ? <JanusAvatar className="size-7" /> : <PersonAvatar name={userName} className="size-7" />}
                    <div
                      className={cn(
                        'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                        message.author === 'user' ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-muted text-foreground',
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={cn('mt-1 text-xs', message.author === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
                {isAnswering && <TypingBubble />}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="shrink-0 border-t p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-input px-3 py-2 focus-within:ring-[3px] focus-within:ring-ring/50">
              <Textarea
                aria-label="Mensagem para o Janus"
                rows={1}
                placeholder="Pergunte sobre compliance, rubricas, planejamento RH, aportes..."
                value={input}
                disabled={isAnswering}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    send()
                  }
                }}
                className="max-h-40 min-h-9 flex-1 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              />
              <Button
                type="button"
                size="icon"
                className="shrink-0 rounded-full"
                aria-label="Enviar mensagem"
                disabled={!input.trim() || isAnswering}
                onClick={() => send()}
              >
                {isAnswering ? <Spinner /> : <IconSend aria-hidden="true" />}
              </Button>
            </div>
            <p className="mt-1.5 px-1 text-xs text-muted-foreground">Enter para enviar · Shift+Enter para quebrar linha</p>
          </div>
        </Card>
      </div>
    </PmoShell>
  )
}
