/** Dados fictícios do FAROL. Nenhum valor aqui pertence a uma pessoa real. */

export const MOCK_PROJECT_NAME =
  'AI Advanced - Projeto P&D de Agente Autônomo de IA para Análise Avançada de Simulações Digitais do Processo de Fabricação de Semicondutores na Adata Integration Brazil S/A'

export const MOCK_USER = {
  fullName: 'Maria Souza Andrade',
  role: 'Bolsista',
}

export const MOCK_PROFILE = {
  fullName: MOCK_USER.fullName,
  socialName: '',
  cpf: '123.456.789-09',
  phone: '(85) 99999-0000',
  personalEmail: 'maria.andrade@example.com',
  corporateEmail: 'maria.andrade@institutocais.example',
  photoUrl:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="%23cbd5e1"/><circle cx="40" cy="32" r="14" fill="%2394a3b8"/><rect x="14" y="52" width="52" height="28" rx="14" fill="%2394a3b8"/></svg>',
}

export const MOCK_ADDRESS = {
  postalCode: '60000000',
  neighborhood: 'Centro',
  street: 'Rua das Flores',
  city: 'Fortaleza',
  number: '100',
  state: 'CE',
  complement: 'Apartamento 12',
}

export const MOCK_BANK_ACCOUNT = {
  bankName: 'Banco do Brasil',
  bankCode: '001',
  branch: '1234-5',
  accountNumber: '12345-6',
  pixKey: '00000000-0000-4000-8000-000000000000',
  pixKeyType: 'Chave aleatória',
}

export interface MockContract {
  title: string
  projectName: string
  roleName: string
  startDate: string
  endDate: string
  scholarshipAmount: string
  contractNumber: string
  supervisor: string
  weeklyHours: string
  workSchedule: string
}

export const MOCK_CONTRACTS: MockContract[] = [
  {
    title: 'Contrato 1 — Bolsa de Inovação (Outorga)',
    projectName: MOCK_PROJECT_NAME,
    roleName: 'Pendente',
    startDate: '01/06/2026',
    endDate: '31/12/2026',
    scholarshipAmount: 'R$ 3.200,00',
    contractNumber: '0',
    supervisor: 'Carlos Pereira Lima',
    weeklyHours: '20 horas',
    workSchedule: '13:00 às 17:00',
  },
]

export type DocumentStatus = 'received' | 'pending' | 'optional'

export interface MockDocument {
  id: string
  name: string
  status: DocumentStatus
  /** Documento dispensável, mesmo quando já foi recebido. */
  isOptional?: boolean
  sentAt?: string
  uploadHref: string
}

export const MOCK_DOCUMENTS: MockDocument[] = [
  { id: 'admission-medical-certificate', name: 'ASO admissional', status: 'optional', uploadHref: '/documentos/admission-medical-certificate' },
  { id: 'degree-certificate', name: 'Certificado ou diploma de graduação', status: 'received', isOptional: true, sentAt: '18/08/2026', uploadHref: '/documentos/degree-certificate' },
  { id: 'bank-proof', name: 'Comprovante bancário', status: 'received', sentAt: '18/08/2026', uploadHref: '/documentos/bank-proof' },
  { id: 'address-proof', name: 'Comprovante de residência', status: 'received', sentAt: '18/08/2026', uploadHref: '/documentos/address-proof' },
  { id: 'cpf', name: 'CPF', status: 'received', sentAt: '18/08/2026', uploadHref: '/documentos/cpf' },
  { id: 'lattes', name: 'Currículo Lattes', status: 'received', sentAt: '18/08/2026', uploadHref: '/documentos/lattes' },
  { id: 'enrollment-statement', name: 'Declaração de matrícula', status: 'pending', uploadHref: '/documentos/enrollment-statement' },
  { id: 'identity', name: 'Documento de identificação', status: 'received', sentAt: '18/08/2026', uploadHref: '/documentos/identity' },
  { id: 'photo', name: 'Foto para comunicação interna', status: 'received', sentAt: '18/08/2026', uploadHref: '/documentos/photo' },
  { id: 'academic-transcript', name: 'Histórico escolar', status: 'pending', uploadHref: '/documentos/academic-transcript' },
]

export interface MockTerm {
  id: string
  name: string
  projectName: string
  signedAt?: string
  submitHref: string
}

export const MOCK_TERMS: MockTerm[] = [
  { id: 'nda', name: 'Termo de confidencialidade e propriedade intelectual', projectName: MOCK_PROJECT_NAME, submitHref: '/termos/nda' },
  { id: 'racial-self-declaration', name: 'Autodeclaração Étnico-racial', projectName: MOCK_PROJECT_NAME, submitHref: '/termos/racial-self-declaration' },
  { id: 'kinship-conflict-declaration', name: 'Declaração de Ausência de Parentesco e de Conflito de Interesses', projectName: MOCK_PROJECT_NAME, submitHref: '/termos/kinship-conflict-declaration' },
  { id: 'grant-term', name: 'Termo de outorga', projectName: MOCK_PROJECT_NAME, submitHref: '/termos/grant-term' },
]

export type ReportStatus = 'not-started' | 'completed'

export interface MockReport {
  id: string
  competence: string
  projectName: string
  submissionPeriod: string
  status: ReportStatus
}

export const MOCK_REPORTS: MockReport[] = [
  { id: '678', competence: 'Novembro de 2026', projectName: MOCK_PROJECT_NAME, submissionPeriod: '02/11 até 20/11/2026', status: 'not-started' },
  { id: '493', competence: 'Outubro de 2026', projectName: MOCK_PROJECT_NAME, submissionPeriod: '01/10 até 20/10/2026', status: 'completed' },
  { id: '303', competence: 'Setembro de 2026', projectName: MOCK_PROJECT_NAME, submissionPeriod: '01/09 até 20/09/2026', status: 'completed' },
  { id: '188', competence: 'Agosto de 2026', projectName: MOCK_PROJECT_NAME, submissionPeriod: '03/08 até 20/08/2026', status: 'completed' },
]
