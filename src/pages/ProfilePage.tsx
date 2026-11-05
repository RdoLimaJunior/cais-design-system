import { useState } from 'react'
import { AppLayout, type UserRole } from '../components/farol/AppLayout'
import { EditFooterLink } from '../components/farol/EditFooterLink'
import { PageCard } from '../components/farol/PageCard'
import {
  AddressPanel,
  BankAccountPanel,
  ContractsPanel,
  DocumentsPanel,
  PasswordPanel,
  PersonalDataPanel,
  ReportsPanel,
  TermsPanel,
  type AddressData,
  type BankAccountData,
  type ProfileData,
} from '../components/farol/ProfileTabPanels'
import { SegmentedTabs } from '../components/farol/SegmentedTabs'
import type { MockContract, MockDocument, MockReport, MockTerm } from '../mocks/scholarship'

export const PROFILE_TABS = [
  'Perfil',
  'Endereço',
  'Dados bancários',
  'Informações de Contrato',
  'Documentos',
  'Termos',
  'Relatórios',
  'Senha',
] as const

export type ProfileTab = (typeof PROFILE_TABS)[number]

interface TabFooter {
  href: string
  label?: string
}

const TAB_FOOTERS: Partial<Record<ProfileTab, TabFooter>> = {
  Perfil: { href: '/perfil/editar' },
  Endereço: { href: '/perfil/editar/endereco' },
  'Dados bancários': { href: '/perfil/editar/dados-bancarios' },
  Senha: { href: '/perfil/alterar-senha', label: 'Mudar senha' },
}

export interface ProfilePageProps {
  userName: string
  role?: UserRole
  onRoleChange?: (role: UserRole) => void
  profile: ProfileData
  address: AddressData
  bankAccount: BankAccountData
  contracts: MockContract[]
  documents: MockDocument[]
  terms: MockTerm[]
  reports: MockReport[]
  projectName: string
  initialTab?: ProfileTab
  onDownloadDocuments?: (documentIds: string[]) => void
  onDownloadReport?: (reportId: string) => void
  onLogout?: () => void
}

export function ProfilePage({
  userName,
  role,
  onRoleChange,
  profile,
  address,
  bankAccount,
  contracts,
  documents,
  terms,
  reports,
  projectName,
  initialTab = 'Perfil',
  onDownloadDocuments,
  onDownloadReport,
  onLogout,
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab)
  const footer = TAB_FOOTERS[activeTab]

  return (
    <AppLayout
      frame="profile"
      breadcrumb={[{ label: 'Home', href: '/home' }, { label: 'Seu perfil' }]}
      activeHref="/perfil"
      userName={userName}
      role={role}
      onRoleChange={onRoleChange}
      onLogout={onLogout}
    >
      <PageCard
        title="Seu perfil"
        subtitle="Nenhuma pendência no perfil"
        footer={footer && <EditFooterLink href={footer.href} label={footer.label} />}
      >
        <SegmentedTabs tabs={[...PROFILE_TABS]} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as ProfileTab)} />
        {activeTab === 'Perfil' && <PersonalDataPanel profile={profile} />}
        {activeTab === 'Endereço' && <AddressPanel address={address} />}
        {activeTab === 'Dados bancários' && <BankAccountPanel account={bankAccount} />}
        {activeTab === 'Informações de Contrato' && <ContractsPanel contracts={contracts} />}
        {activeTab === 'Documentos' && <DocumentsPanel documents={documents} projectName={projectName} onDownload={onDownloadDocuments} />}
        {activeTab === 'Termos' && <TermsPanel terms={terms} />}
        {activeTab === 'Relatórios' && <ReportsPanel reports={reports} onDownload={onDownloadReport} />}
        {activeTab === 'Senha' && <PasswordPanel />}
      </PageCard>
    </AppLayout>
  )
}
