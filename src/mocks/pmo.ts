/** Dados fictícios do CAIS PMO. Nenhum nome, valor ou projeto aqui é real. */

export type HealthScore = 'green' | 'yellow' | 'red'
export type StatusProjeto = 'Planejamento' | 'Execução'

export interface RubricaDoProjeto {
  nome: string
  previsto: number
  executado: number
}

export interface ProjetoMock {
  id: number
  titulo: string
  instituto: string
  status: StatusProjeto
  arquivado: boolean
  responsavel: string
  vigencia: string
  orcamento: number
  gasto: number
  /** Desvio entre previsto e executado no mês, em pontos percentuais. */
  desvio: number
  saude: HealthScore
  /** Custos incorridos sobre a base de aportes, em %. */
  incorridosPercent: number
  rubricas: RubricaDoProjeto[]
}

export interface RemanejamentoMock {
  id: number
  projetoId: number
  de: string
  para: string
  valor: number
  data: string
}

export const PMO_PROJETOS: ProjetoMock[] = [
  {
    id: 1,
    titulo: 'Plataforma de análise de dados (exemplo)',
    instituto: 'IDESCO',
    status: 'Execução',
    arquivado: false,
    responsavel: 'Ana Gestora',
    vigencia: '01/2026 a 12/2026',
    orcamento: 1_200_000,
    gasto: 468_300,
    desvio: 3.2,
    saude: 'green',
    incorridosPercent: 11.4,
    rubricas: [
      { nome: 'RH Direto', previsto: 640_000, executado: 301_200 },
      { nome: 'RH Indireto', previsto: 120_000, executado: 52_800 },
      { nome: 'Equipamentos e Software', previsto: 210_000, executado: 64_900 },
      { nome: 'Serviços de Terceiros - Tecnológicos', previsto: 150_000, executado: 49_400 },
      { nome: 'Viagens', previsto: 80_000, executado: 0 },
    ],
  },
  {
    id: 2,
    titulo: 'Laboratório de testes automatizados (exemplo)',
    instituto: 'IEPRO',
    status: 'Execução',
    arquivado: false,
    responsavel: 'Bruno Coordenador',
    vigencia: '03/2026 a 02/2027',
    orcamento: 860_000,
    gasto: 702_000,
    desvio: 8.7,
    saude: 'yellow',
    incorridosPercent: 17.2,
    rubricas: [
      { nome: 'RH Direto', previsto: 420_000, executado: 366_500 },
      { nome: 'Equipamentos e Software', previsto: 230_000, executado: 218_000 },
      { nome: 'Serviços de Terceiros - Outros', previsto: 110_000, executado: 92_300 },
      { nome: 'Treinamento', previsto: 40_000, executado: 25_200 },
    ],
  },
  {
    id: 3,
    titulo: 'Gestão de portfólio de inovação (exemplo)',
    instituto: 'CAIS',
    status: 'Execução',
    arquivado: false,
    responsavel: 'Carla Analista',
    vigencia: '01/2026 a 06/2026',
    orcamento: 430_000,
    gasto: 447_800,
    desvio: 14.1,
    saude: 'red',
    incorridosPercent: 21.6,
    rubricas: [
      { nome: 'RH Direto', previsto: 260_000, executado: 284_100 },
      { nome: 'Serviços de Terceiros - Outros', previsto: 90_000, executado: 96_700 },
      { nome: 'Material de Consumo para Protótipos', previsto: 80_000, executado: 67_000 },
    ],
  },
  {
    id: 4,
    titulo: 'Plano de capacitação técnica (exemplo)',
    instituto: 'IDESCO',
    status: 'Planejamento',
    arquivado: false,
    responsavel: 'Ana Gestora',
    vigencia: '09/2026 a 08/2027',
    orcamento: 320_000,
    gasto: 0,
    desvio: 0,
    saude: 'green',
    incorridosPercent: 0,
    rubricas: [
      { nome: 'RH Direto', previsto: 190_000, executado: 0 },
      { nome: 'Treinamento', previsto: 90_000, executado: 0 },
    ],
  },
  {
    id: 5,
    titulo: 'Projeto encerrado de pesquisa (exemplo)',
    instituto: 'IEPRO',
    status: 'Execução',
    arquivado: true,
    responsavel: 'Bruno Coordenador',
    vigencia: '01/2025 a 12/2025',
    orcamento: 540_000,
    gasto: 538_900,
    desvio: 0.4,
    saude: 'green',
    incorridosPercent: 12.9,
    rubricas: [
      { nome: 'RH Direto', previsto: 380_000, executado: 379_800 },
      { nome: 'Equipamentos e Software', previsto: 120_000, executado: 119_400 },
    ],
  },
]

export const PMO_REMANEJAMENTOS: RemanejamentoMock[] = [
  { id: 1, projetoId: 2, de: 'Treinamento', para: 'Serviços de Terceiros - Outros', valor: 12_000, data: '02/11/2026' },
  { id: 2, projetoId: 1, de: 'Viagens', para: 'Equipamentos e Software', valor: 25_000, data: '28/10/2026' },
  { id: 3, projetoId: 3, de: 'Material de Consumo para Protótipos', para: 'RH Direto', valor: 18_500, data: '21/10/2026' },
]

export interface ColaboradorMock {
  id: number
  nome: string
  vinculo: 'CLT' | 'RPA' | 'Bolsista'
  projeto: string
  horasPorMes: number
  valorHora: number
}

export const PMO_COLABORADORES: ColaboradorMock[] = [
  { id: 1, nome: 'Marina Exemplo', vinculo: 'CLT', projeto: 'Plataforma de análise de dados (exemplo)', horasPorMes: 220, valorHora: 58.4 },
  { id: 2, nome: 'Rafael Exemplo', vinculo: 'RPA', projeto: 'Laboratório de testes automatizados (exemplo)', horasPorMes: 220, valorHora: 72.1 },
  { id: 3, nome: 'Luísa Exemplo', vinculo: 'Bolsista', projeto: 'Plataforma de análise de dados (exemplo)', horasPorMes: 160, valorHora: 31.25 },
  { id: 4, nome: 'Vaga em aberto', vinculo: 'CLT', projeto: 'Plano de capacitação técnica (exemplo)', horasPorMes: 220, valorHora: 0 },
]
