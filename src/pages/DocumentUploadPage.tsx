import { useState, type ChangeEvent, type DragEvent } from 'react'
import { IconCheck, IconUpload } from '@tabler/icons-react'
import { AppLayout, type UserRole } from '../components/farol/AppLayout'
import { PageCard } from '../components/farol/PageCard'
import { StepPrimaryButton, StepSection } from '../components/farol/StepSection'

export interface DocumentUploadPageProps {
  userName: string
  /** Nome do documento; sem ele a tela mostra "Documento não encontrado". */
  documentName?: string
  role?: UserRole
  onRoleChange?: (role: UserRole) => void
  onSubmit?: (file: File) => void
  onLogout?: () => void
}

const DOCUMENTS_TAB_HREF = '/perfil?tab=documentos'
// A mensagem de formato recusado não foi capturada do site; texto provisório.
const UNSUPPORTED_FORMAT_MESSAGE = 'Formato não aceito. Envie um PDF ou uma imagem.'

function isAcceptedFile(file: File): boolean {
  return file.type === 'application/pdf' || file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.pdf')
}

function DocumentDropzone({ file, onFileChange }: { file: File | null; onFileChange: (file: File) => void }) {
  const [rejectedFileName, setRejectedFileName] = useState<string | null>(null)

  function acceptOrReject(candidate: File | undefined) {
    if (!candidate) return
    if (isAcceptedFile(candidate)) {
      setRejectedFileName(null)
      onFileChange(candidate)
    } else {
      setRejectedFileName(candidate.name)
    }
  }

  function handleSelected(event: ChangeEvent<HTMLInputElement>) {
    acceptOrReject(event.target.files?.[0])
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    acceptOrReject(event.dataTransfer.files[0])
  }

  return (
    <label
      className="mt-5 flex min-h-44 w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#0089E2] bg-sky-50/40 p-5 text-center"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <IconUpload className="mb-4 size-8 rounded bg-white p-1.5 text-[#0089E2]" />
      <span className="text-sm font-medium">{file ? file.name : 'Arraste o arquivo ou clique para selecionar.'}</span>
      <span className="mt-2 text-xs text-zinc-500">Formato aceito: PDF ou imagem.</span>
      {rejectedFileName && (
        <span role="alert" className="mt-2 text-xs font-medium text-red-600">
          {UNSUPPORTED_FORMAT_MESSAGE}
        </span>
      )}
      <span className="mt-4 rounded border border-[#0089E2] bg-white px-3 py-1.5 text-xs text-[#0089E2]">
        Selecionar arquivo
      </span>
      <input type="file" accept=".pdf,image/*" className="sr-only" onChange={handleSelected} />
    </label>
  )
}

export function DocumentUploadPage({
  userName,
  documentName,
  role,
  onRoleChange,
  onSubmit,
  onLogout,
}: DocumentUploadPageProps) {
  const [file, setFile] = useState<File | null>(null)

  return (
    <AppLayout
      frame="document"
      breadcrumb={[
        { label: 'Home', href: '/home' },
        { label: 'Documentos', href: DOCUMENTS_TAB_HREF },
        { label: documentName ?? 'Documento' },
      ]}
      activeHref=""
      userName={userName}
      role={role}
      onRoleChange={onRoleChange}
      onLogout={onLogout}
    >
      {documentName ? (
        <PageCard title={documentName} bodyClassName="grid gap-3 p-5">
          <StepSection
            stepNumber={1}
            state="active"
            title="Faça upload do arquivo"
            descriptions={['Envie o documento para revisão do RH.']}
          >
            <DocumentDropzone file={file} onFileChange={setFile} />
            <div className="mt-5 flex justify-end">
              <StepPrimaryButton disabled={!file} onClick={() => file && onSubmit?.(file)}>
                Enviar <IconCheck className="size-3.5" />
              </StepPrimaryButton>
            </div>
          </StepSection>
          <StepSection stepNumber={2} state="upcoming" title="Aguarde a revisão" />
        </PageCard>
      ) : (
        <PageCard title="Documento não encontrado" bodyClassName="p-5">
          <a className="text-sm text-[#0089E2] hover:underline" href={DOCUMENTS_TAB_HREF}>
            Voltar aos documentos
          </a>
        </PageCard>
      )}
    </AppLayout>
  )
}
