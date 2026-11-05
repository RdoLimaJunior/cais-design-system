import { AppLayout, type UserRole } from '../components/farol/AppLayout'
import { CollapsibleAlertSection } from '../components/farol/CollapsibleAlertSection'
import { PageSubtitle, PageTitle } from '../components/farol/PageHeading'
import { ReportCard, type ReportCardProps } from '../components/farol/ReportCard'

export interface HomePageProps {
  userName: string
  role?: UserRole
  onRoleChange?: (role: UserRole) => void
  onLogout?: () => void
  pendingReports: ReportCardProps[]
  pendingSummary: string
  alertSectionTitle: string
  alertSectionDescription: string
}

export function HomePage({
  userName,
  role,
  onRoleChange,
  onLogout,
  pendingReports,
  pendingSummary,
  alertSectionTitle,
  alertSectionDescription,
}: HomePageProps) {
  return (
    <AppLayout breadcrumb={[{ label: 'Home' }]} activeHref="/home" userName={userName} role={role} onRoleChange={onRoleChange} onLogout={onLogout}>
      <article className="rounded bg-white px-4 py-4 shadow-sm">
        <PageTitle>Bem-vindo ao Farol do Cais</PageTitle>
        <PageSubtitle>O gestor de pessoas e de projetos do Instituto Cais.</PageSubtitle>
      </article>
      <article className="overflow-hidden rounded bg-white shadow-sm">
        <header className="px-4 pt-4 pb-5">
          <PageTitle>Pendências</PageTitle>
          <PageSubtitle>{pendingSummary}</PageSubtitle>
        </header>
        <CollapsibleAlertSection title={alertSectionTitle} description={alertSectionDescription}>
          {pendingReports.map((report) => (
            <ReportCard key={report.title} {...report} />
          ))}
        </CollapsibleAlertSection>
      </article>
    </AppLayout>
  )
}
