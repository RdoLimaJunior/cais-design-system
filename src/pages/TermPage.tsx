import { useState } from 'react'
import { IconCheck } from '@tabler/icons-react'
import { AppLayout, type UserRole } from '../components/farol/AppLayout'
import { PageCard } from '../components/farol/PageCard'
import { StepOutlineButton, StepPrimaryButton, StepSection } from '../components/farol/StepSection'

export type TermKind = 'nda' | 'racial-self-declaration' | 'kinship-conflict-declaration' | 'grant-term'

const RACE_OPTIONS = ['Branco(a)', 'Preto(a)', 'Pardo(a)', 'Amarelo(a)', 'Indígena']
const PUBLIC_SERVANT_OPTIONS = [
  { value: 'no', label: 'NÃO sou servidor público (em qualquer esfera: federal, estadual ou municipal)' },
  {
    value: 'yes',
    label:
      'SOU servidor público e possuo autorização formal para recebimento de bolsa, a qual será apresentada em documento próprio',
  },
]

export const TERM_TITLES: Record<TermKind, string> = {
  nda: 'Termo de confidencialidade e propriedade intelectual',
  'racial-self-declaration': 'Autodeclaração Étnico-racial',
  'kinship-conflict-declaration': 'Declaração de Ausência de Parentesco e de Conflito de Interesses',
  'grant-term': 'Termo de outorga',
}

export interface TermPageProps {
  kind: TermKind
  userName: string
  projectsLabel?: string
  role?: UserRole
  onRoleChange?: (role: UserRole) => void
  onSubmit?: (answers: Record<string, string>) => void
  onAlreadySigned?: () => void
  onSign?: () => void
  onLogout?: () => void
}

const radioInputClasses = 'size-3.5 accent-[#0089E2]'
const textareaClasses = 'rounded border border-zinc-300 px-3 py-2 outline-none focus:border-[#0089E2]'

function ReadAndSignStep({ onAlreadySigned, onSign }: Pick<TermPageProps, 'onAlreadySigned' | 'onSign'>) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <StepOutlineButton onClick={onAlreadySigned}>Já assinei esse termo</StepOutlineButton>
      <StepPrimaryButton onClick={onSign}>
        Ler e Assinar <IconCheck className="size-3.5" />
      </StepPrimaryButton>
    </div>
  )
}

function SubmitAnswersActions({
  canSubmit,
  alreadySignedLabel,
  onAlreadySigned,
  onSubmit,
}: {
  canSubmit: boolean
  alreadySignedLabel: string
  onAlreadySigned?: () => void
  onSubmit: () => void
}) {
  return (
    <div className="mt-4 flex justify-end gap-2">
      <StepOutlineButton onClick={onAlreadySigned}>{alreadySignedLabel}</StepOutlineButton>
      <StepPrimaryButton disabled={!canSubmit} onClick={onSubmit}>
        Enviar resposta <IconCheck className="size-3.5" />
      </StepPrimaryButton>
    </div>
  )
}

function RacialDeclarationForm({ onSubmit, onAlreadySigned }: Pick<TermPageProps, 'onSubmit' | 'onAlreadySigned'>) {
  const [race, setRace] = useState('')
  return (
    <>
      <fieldset className="mt-5">
        <legend className="mb-1 text-sm font-medium">Raça</legend>
        <div className="grid gap-1">
          {RACE_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm">
              <input type="radio" name="race" value={option} className={radioInputClasses} onChange={() => setRace(option)} />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
      <SubmitAnswersActions
        canSubmit={Boolean(race)}
        alreadySignedLabel="Já assinei"
        onAlreadySigned={onAlreadySigned}
        onSubmit={() => onSubmit?.({ race })}
      />
    </>
  )
}

function KinshipDeclarationForm({ onSubmit, onAlreadySigned }: Pick<TermPageProps, 'onSubmit' | 'onAlreadySigned'>) {
  const [notes, setNotes] = useState('')
  const [isPublicServant, setIsPublicServant] = useState('')
  return (
    <>
      <label className="mt-5 block text-sm font-medium" htmlFor="additional-notes">
        Observações adicionais
      </label>
      <textarea
        id="additional-notes"
        rows={4}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        className={`mt-1 w-full resize-y text-sm ${textareaClasses}`}
      />
      <p className="mt-1 text-xs text-zinc-500">
        Caso exista alguma situação que possa ser interpretada como parentesco ou conflito de interesses, descreva aqui.
      </p>
      <fieldset className="mt-5">
        <legend className="mb-1 text-sm font-medium">Você é servidor público?</legend>
        <div className="grid gap-1">
          {PUBLIC_SERVANT_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-start gap-2 text-sm">
              <input
                type="radio"
                name="public-servant"
                value={value}
                className={`mt-0.5 shrink-0 ${radioInputClasses}`}
                onChange={() => setIsPublicServant(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <SubmitAnswersActions
        canSubmit={Boolean(isPublicServant)}
        alreadySignedLabel="Já assinei"
        onAlreadySigned={onAlreadySigned}
        onSubmit={() => onSubmit?.({ notes, isPublicServant })}
      />
    </>
  )
}

function GrantTermForm({ onSubmit, onAlreadySigned }: Pick<TermPageProps, 'onSubmit' | 'onAlreadySigned'>) {
  const [objective, setObjective] = useState('')
  const [activities, setActivities] = useState('')
  return (
    <>
      <label className="mt-4 grid gap-1 text-sm">
        <span className="font-medium">Objetivo da bolsa no projeto</span>
        <textarea rows={3} value={objective} onChange={(event) => setObjective(event.target.value)} className={textareaClasses} />
      </label>
      <label className="mt-4 grid gap-1 text-sm">
        <span className="font-medium">Atividades principais</span>
        <textarea rows={4} value={activities} onChange={(event) => setActivities(event.target.value)} className={textareaClasses} />
      </label>
      <SubmitAnswersActions
        canSubmit={Boolean(objective.trim() && activities.trim())}
        alreadySignedLabel="Já assinei esse termo"
        onAlreadySigned={onAlreadySigned}
        onSubmit={() => onSubmit?.({ objective, activities })}
      />
    </>
  )
}

function TermSteps({ kind, ...actions }: Pick<TermPageProps, 'kind' | 'onSubmit' | 'onAlreadySigned' | 'onSign'>) {
  if (kind === 'nda') {
    return (
      <>
        <StepSection
          stepNumber={1}
          state="active"
          title="Leia e assine o termo"
          descriptions={[
            'Clique em “Ler e Assinar” para acessar o documento no serviço de assinatura.',
            'Caso já tenha assinado, use a opção abaixo para atualizar o fluxo.',
          ]}
        >
          <ReadAndSignStep onAlreadySigned={actions.onAlreadySigned} onSign={actions.onSign} />
        </StepSection>
        <StepSection stepNumber={2} state="upcoming" title="Aguarde a revisão e outras assinaturas" />
      </>
    )
  }

  if (kind === 'grant-term') {
    return (
      <>
        <StepSection
          stepNumber={1}
          state="active"
          title="Preencha os campos necessários"
          descriptions={[
            'Informe os dados adicionais da bolsa de inovação.',
            'Se já assinou o termo anteriormente, envie o documento pela opção abaixo.',
          ]}
        >
          <GrantTermForm onSubmit={actions.onSubmit} onAlreadySigned={actions.onAlreadySigned} />
        </StepSection>
        <StepSection stepNumber={2} state="upcoming" title="Aguarde a revisão e outras assinaturas" isTitleWrapped />
        <StepSection stepNumber={3} state="upcoming" title="Leia e assine o termo" />
      </>
    )
  }

  const Form = kind === 'racial-self-declaration' ? RacialDeclarationForm : KinshipDeclarationForm
  return (
    <>
      <StepSection
        stepNumber={1}
        state="active"
        title="Preencha os campos necessários"
        descriptions={['Se já assinou o termo anteriormente, clique em “Já assinei” para fazer upload do documento.']}
      >
        <Form onSubmit={actions.onSubmit} onAlreadySigned={actions.onAlreadySigned} />
      </StepSection>
      <StepSection stepNumber={2} state="upcoming" title="Leia e assine o termo" />
      <StepSection stepNumber={3} state="upcoming" title="Aguarde a revisão e outras assinaturas" />
    </>
  )
}

export function TermPage({
  kind,
  userName,
  projectsLabel = 'Geral',
  role,
  onRoleChange,
  onLogout,
  ...actions
}: TermPageProps) {
  const title = TERM_TITLES[kind]

  return (
    <AppLayout
      frame="document"
      breadcrumb={[{ label: 'Home', href: '/home' }, { label: 'Termos', href: '/perfil?tab=termos' }, { label: title }]}
      activeHref=""
      userName={userName}
      role={role}
      onRoleChange={onRoleChange}
      onLogout={onLogout}
    >
      <PageCard title={title} subtitle={`Referente ao(s) projeto(s): ${projectsLabel}`} bodyClassName="grid gap-3 p-5">
        <TermSteps kind={kind} {...actions} />
      </PageCard>
    </AppLayout>
  )
}
