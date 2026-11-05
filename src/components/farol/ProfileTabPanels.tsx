import { useMemo, useState } from 'react'
import { IconArrowRight, IconDownload } from '@tabler/icons-react'
import {
  type MockContract,
  type MockDocument,
  type MockReport,
  type MockTerm,
  MOCK_ADDRESS,
  MOCK_BANK_ACCOUNT,
  MOCK_PROFILE,
} from '../../mocks/scholarship'
import { DataTable, type DataTableColumn, type SortDirection } from './DataTable'
import { Pagination } from './Pagination'
import { ProfileFieldList } from './ProfileFields'
import { REPORT_STATUS } from './reportStatus'
import { RowActionButton } from './RowActionButton'
import { StatusTag, type StatusTagTone } from './StatusTag'

const EMPTY_VALUE = '—'
const REPORTS_PAGE_SIZE = 5
const ICON_LINK_CLASSES =
  'flex size-8 items-center justify-center rounded-lg text-[#0078C8] hover:bg-sky-50 disabled:cursor-not-allowed disabled:text-zinc-400'
const BULK_DOWNLOAD_CLASSES =
  'flex h-8 items-center gap-2 rounded bg-[#0089E2] px-4 text-xs text-white disabled:opacity-50'

export type ProfileData = typeof MOCK_PROFILE
export type AddressData = typeof MOCK_ADDRESS
export type BankAccountData = typeof MOCK_BANK_ACCOUNT

export function PersonalDataPanel({ profile }: { profile: ProfileData }) {
  return (
    <div className="grid max-w-4xl grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2">
      <ProfileFieldList
        fields={[
          { label: 'Nome completo', value: profile.fullName },
          { label: 'Nome social', value: profile.socialName },
          { label: 'CPF', value: profile.cpf },
          { label: 'Telefone', value: profile.phone },
        ]}
      />
      <div>
        <ProfileFieldList
          fields={[
            { label: 'E-mail Pessoal', value: profile.personalEmail },
            { label: 'E-mail Corporativo', value: profile.corporateEmail },
          ]}
        />
        <p className="mt-5 text-base leading-6 font-medium text-[#0F172A]">Foto para comunicação interna</p>
        <img alt={profile.fullName} className="mt-1 size-20 rounded object-cover" src={profile.photoUrl} />
      </div>
    </div>
  )
}

export function AddressPanel({ address }: { address: AddressData }) {
  return (
    <ProfileFieldList
      className="max-w-4xl grid-cols-1 gap-x-12 sm:grid-cols-2"
      fields={[
        { label: 'CEP', value: address.postalCode },
        { label: 'Bairro', value: address.neighborhood },
        { label: 'Logradouro', value: address.street },
        { label: 'Cidade', value: address.city },
        { label: 'Número', value: address.number },
        { label: 'Estado (UF)', value: address.state },
        { label: 'Complemento', value: address.complement },
      ]}
    />
  )
}

export function BankAccountPanel({ account }: { account: BankAccountData }) {
  return (
    <div className="grid max-w-4xl grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2">
      <ProfileFieldList
        fields={[
          { label: 'Banco', value: account.bankName },
          { label: 'Código do Banco', value: account.bankCode },
          { label: 'Agência (com dígito)', value: account.branch },
          { label: 'Número da Conta (com dígito)', value: account.accountNumber },
        ]}
      />
      <ProfileFieldList
        fields={[
          { label: 'Chave Pix', value: account.pixKey },
          { label: 'Tipo de chave Pix', value: account.pixKeyType },
        ]}
      />
    </div>
  )
}

export function ContractsPanel({ contracts }: { contracts: MockContract[] }) {
  return (
    <div className="grid max-w-4xl gap-4">
      <div className="grid gap-6">
        {contracts.map((contract) => (
          <section key={contract.title} className="rounded-lg border border-zinc-200 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm leading-5 font-medium text-[#0F172A]">{contract.title}</p>
            </div>
            <div className="grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2">
              <ProfileFieldList
                fields={[
                  { label: 'Projeto', value: contract.projectName },
                  { label: 'Função', value: contract.roleName, valueClassName: 'text-amber-600' },
                  { label: 'Data de Início da Bolsa', value: contract.startDate },
                  { label: 'Data de Término da Bolsa', value: contract.endDate },
                  { label: 'Valor da Bolsa', value: contract.scholarshipAmount },
                  { label: 'Número do Contrato', value: contract.contractNumber },
                  { label: 'Supervisor no CAIS', value: contract.supervisor },
                ]}
              />
              <ProfileFieldList
                fields={[
                  { label: 'Carga horária semanal', value: contract.weeklyHours },
                  { label: 'Horário do Expediente', value: contract.workSchedule },
                ]}
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export function PasswordPanel() {
  return (
    <dl className="max-w-[220px] space-y-5">
      <div>
        <dt className="text-base leading-6 font-medium text-[#0F172A]">Senha atual</dt>
        <dd className="mt-0.5 text-base leading-6 font-normal text-[#64748B]">********</dd>
      </div>
    </dl>
  )
}

const DOCUMENT_TONES: Record<MockDocument['status'], { tone: StatusTagTone; label: string }> = {
  received: { tone: 'received', label: 'Recebido' },
  pending: { tone: 'danger', label: 'Pendente' },
  optional: { tone: 'neutral', label: 'Opcional' },
}

type DocumentSortColumn = 'name' | 'project' | 'status'

function sortDocuments(documents: MockDocument[], columnId: DocumentSortColumn, direction: SortDirection) {
  const sortKey = (document: MockDocument) =>
    columnId === 'name' ? document.name : columnId === 'status' ? DOCUMENT_TONES[document.status].label : ''
  const directionFactor = direction === 'ascending' ? 1 : -1
  return [...documents].sort(
    (first, second) => directionFactor * sortKey(first).localeCompare(sortKey(second), 'pt-BR'),
  )
}

export interface DocumentsPanelProps {
  documents: MockDocument[]
  projectName: string
  onDownload?: (documentIds: string[]) => void
}

export function DocumentsPanel({ documents, projectName, onDownload }: DocumentsPanelProps) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [sortColumn, setSortColumn] = useState<DocumentSortColumn>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending')

  const sortedDocuments = useMemo(
    () => sortDocuments(documents, sortColumn, sortDirection),
    [documents, sortColumn, sortDirection],
  )

  function handleSortChange(columnId: string) {
    const nextColumn = columnId as DocumentSortColumn
    setSortDirection(nextColumn === sortColumn && sortDirection === 'ascending' ? 'descending' : 'ascending')
    setSortColumn(nextColumn)
  }

  const columns: DataTableColumn<MockDocument>[] = [
    {
      id: 'name',
      header: 'Documento',
      isSortable: true,
      render: (document) => (
        <>
          {document.name}
          {(document.isOptional || document.status === 'optional') && <span className="ml-1 text-xs text-zinc-500">(opcional)</span>}
        </>
      ),
    },
    { id: 'project', header: 'Projeto', isSortable: true, render: () => projectName },
    {
      id: 'status',
      header: 'Status',
      isSortable: true,
      render: (document) => (
        <StatusTag tone={DOCUMENT_TONES[document.status].tone}>{DOCUMENT_TONES[document.status].label}</StatusTag>
      ),
    },
    { id: 'sentAt', header: 'Data de envio', render: (document) => document.sentAt ?? EMPTY_VALUE },
    {
      id: 'action',
      headerClassName: 'w-28',
      render: (document) =>
        document.status === 'received' ? (
          <RowActionButton label="Baixar" ariaLabel={`Baixar ${document.name}`} onClick={() => onDownload?.([document.id])} />
        ) : (
          <RowActionButton label="Enviar" ariaLabel={`Enviar ${document.name}`} href={document.uploadHref} />
        ),
    },
  ]

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          disabled={selectedKeys.length === 0}
          onClick={() => onDownload?.(selectedKeys)}
          className={BULK_DOWNLOAD_CLASSES}
        >
          <IconDownload className="size-3.5" /> Baixar arquivos
        </button>
      </div>
      <DataTable
        columns={columns}
        rows={sortedDocuments}
        getRowKey={(document) => document.id}
        selection={{
          selectAllLabel: 'Selecionar todos os documentos recebidos',
          getRowLabel: (key) => `Selecionar ${documents.find((document) => document.id === key)?.name}`,
          isRowSelectable: (key) => documents.find((document) => document.id === key)?.status === 'received',
          selectedKeys,
          onSelectionChange: setSelectedKeys,
        }}
        sort={{ columnId: sortColumn, direction: sortDirection, onSortChange: handleSortChange }}
      />
    </div>
  )
}

export function TermsPanel({ terms }: { terms: MockTerm[] }) {
  const columns: DataTableColumn<MockTerm>[] = [
    { id: 'name', header: 'Termo', render: (term) => term.name },
    { id: 'project', header: 'Projeto', render: (term) => term.projectName },
    {
      id: 'status',
      header: 'Status',
      render: (term) => <StatusTag tone={term.signedAt ? 'success' : 'danger'}>{term.signedAt ? 'Assinado' : 'Pendente'}</StatusTag>,
    },
    { id: 'signedAt', header: 'Data de assinatura', render: (term) => term.signedAt ?? EMPTY_VALUE },
    {
      id: 'action',
      headerClassName: 'w-28',
      render: (term) => <RowActionButton label="Enviar" ariaLabel={`Enviar ${term.name}`} href={term.submitHref} />,
    },
  ]

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button type="button" disabled className={BULK_DOWNLOAD_CLASSES}>
          <IconDownload className="size-3.5" /> Baixar arquivos
        </button>
      </div>
      <DataTable
        columns={columns}
        rows={terms}
        getRowKey={(term) => term.id}
        selection={{
          selectAllLabel: 'Selecionar todos os termos recebidos',
          getRowLabel: (key) => `Selecionar ${terms.find((term) => term.id === key)?.name}`,
          isRowSelectable: () => false,
          selectedKeys: [],
          onSelectionChange: () => {},
        }}
      />
    </div>
  )
}

export interface ReportsPanelProps {
  reports: MockReport[]
  onDownload?: (reportId: string) => void
}

export function ReportsPanel({ reports, onDownload }: ReportsPanelProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(reports.length / REPORTS_PAGE_SIZE))
  const visibleReports = reports.slice((currentPage - 1) * REPORTS_PAGE_SIZE, currentPage * REPORTS_PAGE_SIZE)

  const columns: DataTableColumn<MockReport>[] = [
    { id: 'competence', header: 'Competência', cellClassName: 'truncate', render: (report) => report.competence },
    { id: 'project', header: 'Projeto', cellClassName: 'truncate', render: (report) => report.projectName },
    { id: 'period', header: 'Período de envio', cellClassName: 'truncate', render: (report) => report.submissionPeriod },
    {
      id: 'status',
      header: 'Status',
      render: (report) => (
        <StatusTag tone={REPORT_STATUS[report.status].tone}>{REPORT_STATUS[report.status].label}</StatusTag>
      ),
    },
    {
      id: 'actions',
      headerClassName: 'w-56',
      render: (report) => {
        const isCompleted = report.status === 'completed'
        const label = isCompleted ? 'Visualizar' : 'Preencher'
        return (
          <div className="flex justify-end gap-2">
            {isCompleted && (
              <button
                type="button"
                title="Baixar relatório"
                aria-label="Baixar relatório"
                className={ICON_LINK_CLASSES}
                onClick={() => onDownload?.(report.id)}
              >
                <IconDownload className="size-3.5" />
              </button>
            )}
            <a
              title={label}
              aria-label={`${label} relatório`}
              className={ICON_LINK_CLASSES}
              href={`/relatorio-mensal/${report.id}`}
            >
              <IconArrowRight className="size-3.5" />
            </a>
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col">
      <DataTable
        columns={columns}
        rows={visibleReports}
        getRowKey={(report) => report.id}
        minWidthClassName="min-w-[900px]"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        ariaLabel="Paginação dos relatórios"
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
