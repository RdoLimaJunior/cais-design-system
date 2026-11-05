/**
 * API pública do design system CAIS.
 *
 * O CSS (tokens, fonte, Tailwind) NÃO é importado aqui: cada sistema o importa no próprio `index.css`
 * com `@import '@cais/design-system/globals.css'`. Veja o guia "Como criar um novo sistema" no Storybook.
 */

// Base shadcn
export { Button, buttonVariants } from './components/ui/button'
export { Badge, badgeVariants } from './components/ui/badge'
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
export { Input } from './components/ui/input'
export { Label } from './components/ui/label'
export { Textarea } from './components/ui/textarea'
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion'
export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from './components/ui/avatar'
export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants } from './components/ui/tabs'
export { Alert, AlertDescription, AlertTitle } from './components/ui/alert'
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './components/ui/alert-dialog'
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog'
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip'
export { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu'
export { Progress } from './components/ui/progress'
export { Switch } from './components/ui/switch'
export { RadioGroup, RadioGroupItem } from './components/ui/radio-group'
export { Separator } from './components/ui/separator'
export { Skeleton } from './components/ui/skeleton'
export { Spinner } from './components/ui/spinner'
export { Checkbox } from './components/ui/checkbox'
export { Toaster } from './components/ui/sonner'
export { toast } from 'sonner'
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './components/ui/table'

// Layout e navegação
export { AppLayout, type AppFrame, type AppLayoutProps, type UserRole } from './components/farol/AppLayout'
export { AppSidebar, type AppSidebarProps, type SidebarNavItem, type SidebarSubitem, type SidebarVariant } from './components/farol/AppSidebar'
export { ADMIN_NAV_ITEMS, SCHOLARSHIP_NAV_ITEMS } from './components/farol/navigation'
export { PageBreadcrumb, type BreadcrumbItem, type BreadcrumbVariant } from './components/farol/PageBreadcrumb'
export { SegmentedTabs, type SegmentedTabsProps } from './components/farol/SegmentedTabs'
export { Pagination, type PaginationProps } from './components/farol/Pagination'
export { PageCard, type PageCardProps } from './components/farol/PageCard'
export { PageSubtitle, PageTitle } from './components/farol/PageHeading'
export { EditFooterLink } from './components/farol/EditFooterLink'
export { StepOutlineButton, StepPrimaryButton, StepSection, type StepState } from './components/farol/StepSection'

// Dados
export { DataTable, type DataTableColumn, type DataTableProps, type SortDirection } from './components/farol/DataTable'
export { RowActionButton } from './components/farol/RowActionButton'
export { StatusPill } from './components/farol/StatusPill'
export { StatusTag, type StatusTagTone } from './components/farol/StatusTag'
export { ReportCard, type ReportCardProps } from './components/farol/ReportCard'
export { CollapsibleAlertSection } from './components/farol/CollapsibleAlertSection'
export { ProfileField, ProfileFieldList, type ProfileFieldProps } from './components/farol/ProfileFields'

// Formulários
export { DigitInput, type DigitInputProps } from './components/farol/forms/DigitInput'
export { EditFormCard, type EditFormCardProps } from './components/farol/forms/EditFormCard'
export { FormErrorText, FormFieldLabel, FormHelperText, FormTextInput, type FormFieldSize } from './components/farol/forms/FormField'
export { PhotoUploadField, type PhotoUploadFieldProps } from './components/farol/forms/PhotoUploadField'
export { AuthField, AuthPasswordField } from './components/farol/auth/AuthField'
export { AuthLayout, type AuthLayoutProps } from './components/farol/auth/AuthLayout'
export { AuthSubmitButton } from './components/farol/auth/AuthSubmitButton'

// Feedback
export { LogoutDialog, type LogoutDialogProps } from './components/farol/LogoutDialog'

// Preferências de acessibilidade (escala de fonte e menu recolhido, salvos no navegador)
export {
  DEFAULT_FONT_SCALE,
  FONT_SCALE_STEP,
  FONT_SCALE_STORAGE_KEY,
  MAXIMUM_FONT_SCALE,
  MINIMUM_FONT_SCALE,
  SIDEBAR_COLLAPSED_STORAGE_KEY,
} from './components/farol/fontScale'

// Utilitários
export { cn } from './lib/utils'
export { formatCpf } from './lib/formatCpf'
export { isStrongPassword } from './lib/password'
export { readStoredValue, removeStoredValue, writeStoredValue } from './lib/browserStorage'

// Páginas do FAROL
export { ChangePasswordPage, type ChangePasswordPageProps } from './pages/ChangePasswordPage'
export { EditAddressPage, type EditAddressPageProps } from './pages/EditAddressPage'
export { EditBankAccountPage, type EditBankAccountPageProps } from './pages/EditBankAccountPage'
export { EditProfilePage, type EditProfilePageProps, type EditProfileValues } from './pages/EditProfilePage'
export { HomePage, type HomePageProps } from './pages/HomePage'
export { InviteStatusPage, type InviteProblem } from './pages/InviteStatusPage'
export { LoginPage, type LoginPageProps } from './pages/LoginPage'
export { DocumentUploadPage, type DocumentUploadPageProps } from './pages/DocumentUploadPage'
export { MonthlyReportPage, type MonthlyReportPageProps, type MonthlyReportStatus } from './pages/MonthlyReportPage'
export { ReportsListPage, type ReportsListPageProps } from './pages/ReportsListPage'
export { PROFILE_TABS, ProfilePage, type ProfilePageProps, type ProfileTab } from './pages/ProfilePage'
export { TERM_TITLES, TermPage, type TermKind, type TermPageProps } from './pages/TermPage'
export { ResetPasswordPage, type ResetPasswordPageProps } from './pages/ResetPasswordPage'

// Dados fictícios para demonstração
export * from './mocks/scholarship'

export {
  HIGH_CONTRAST_ATTRIBUTE,
  HIGH_CONTRAST_STORAGE_KEY,
  HIGH_CONTRAST_VALUE,
  changeFontScale,
  setFontScale,
  setHighContrast,
  setTheme,
  useAccessibilityPreferences,
  type AccessibilityPreferences,
  type Theme,
} from './lib/accessibilityPreferences'

// CAIS PMO: componentes de domínio financeiro
export { CurrencyCell } from './components/pmo/CurrencyCell'
export { CurrencyInput } from './components/pmo/CurrencyInput'
export { PercentInput } from './components/pmo/PercentInput'
export { RUBRIC_GROUPS, RubricBadge } from './components/pmo/RubricBadge'
export { ProjectStatusBadge, type ProjectStatus } from './components/pmo/ProjectStatusBadge'
export {
  INCURRED_COSTS_ALERT_PERCENT,
  INCURRED_COSTS_CAP_PERCENT,
  IncurredCostsCap,
} from './components/pmo/IncurredCostsCap'
export { formatCurrency, formatPercent, readReais } from './lib/finance'
