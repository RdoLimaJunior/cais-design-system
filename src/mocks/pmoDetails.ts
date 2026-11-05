/** Dados fictícios de apoio às telas do CAIS PMO. Nenhum nome, CPF, e-mail ou valor é real. */

export const PMO_INSTITUTOS = [
  { id: 1, nome: 'IDESCO', taxaAdministrativa: 10, projetos: 2 },
  { id: 2, nome: 'IEPRO', taxaAdministrativa: 8.5, projetos: 2 },
  { id: 3, nome: 'CAIS', taxaAdministrativa: 12, projetos: 1 },
]

export const PMO_USUARIOS = [
  { id: 1, nome: 'Gustavo Admin', email: 'admin@exemplo.org', perfil: 'ADMIN' },
  { id: 2, nome: 'Ana Gestora', email: 'gestora@exemplo.org', perfil: 'GESTOR' },
  { id: 3, nome: 'Carla Analista', email: 'analista@exemplo.org', perfil: 'ANALISTA' },
  { id: 4, nome: 'Leo Leitor', email: 'leitor@exemplo.org', perfil: 'LEITOR' },
]

export const PMO_RUBRICAS = [
  { nome: 'RH Direto', tipo: 'Custeio', descricao: 'Pessoal diretamente alocado ao projeto', ativa: true },
  { nome: 'RH Indireto', tipo: 'Custeio', descricao: 'Pessoal de apoio ao projeto', ativa: true },
  { nome: 'Equipamentos e Software', tipo: 'Investimento', descricao: 'Aquisição de equipamentos e licenças', ativa: true },
  { nome: 'Serviços de Terceiros - Tecnológicos', tipo: 'Custeio', descricao: 'Consultorias e serviços técnicos', ativa: true },
  { nome: 'Viagens', tipo: 'Custeio', descricao: 'Passagens e diárias', ativa: true },
  { nome: 'Treinamento', tipo: 'Custeio', descricao: 'Capacitação da equipe', ativa: false },
]

export const PMO_MODELOS_DE_PROJETO = [
  { id: 1, nome: 'Modelo padrão de P&D', versao: '3.1', abas: 9, projetos: 4, padrao: true, ativo: true },
  { id: 2, nome: 'Modelo simplificado', versao: '1.2', abas: 6, projetos: 1, padrao: false, ativo: true },
  { id: 3, nome: 'Modelo anterior (2024)', versao: '2.0', abas: 8, projetos: 0, padrao: false, ativo: false },
]

export const PMO_REGRAS_DE_ACESSO = [
  { chave: 'Projetos e Colaboradores', gestor: true, analista: true, leitor: false },
  { chave: 'Planejamento e Execução', gestor: true, analista: true, leitor: false },
  { chave: 'Financeiro', gestor: true, analista: false, leitor: false },
  { chave: 'Administração', gestor: false, analista: false, leitor: false },
]

export const PMO_APORTES = [
  { id: 1, data: '15/02/2026', documento: 'DEP-2026-0041', bruto: 300_000, taxa: 30_000 },
  { id: 2, data: '12/05/2026', documento: 'DEP-2026-0188', bruto: 300_000, taxa: 30_000 },
  { id: 3, data: '14/08/2026', documento: 'DEP-2026-0402', bruto: 250_000, taxa: 25_000 },
]

export const PMO_SERIE_MENSAL = [
  { mes: '01/2026', planejado: 82_000, executado: 79_400 },
  { mes: '02/2026', planejado: 82_000, executado: 84_100 },
  { mes: '03/2026', planejado: 90_000, executado: 88_300 },
  { mes: '04/2026', planejado: 90_000, executado: 91_900 },
  { mes: '05/2026', planejado: 95_000, executado: 93_200 },
  { mes: '06/2026', planejado: 95_000, executado: 97_500 },
  { mes: '07/2026', planejado: 98_000, executado: 0 },
  { mes: '08/2026', planejado: 98_000, executado: 0 },
]

export const PMO_ESPELHO_RH = [
  { colaborador: 'Marina Exemplo', secao: 'RH Direto', vinculo: 'CLT', meses: [8_400, 8_400, 8_400, 8_400, 8_400, 8_400] },
  { colaborador: 'Rafael Exemplo', secao: 'RH Direto', vinculo: 'RPA', meses: [9_800, 9_800, 9_800, 9_800, 9_800, 9_800] },
  { colaborador: 'Luísa Exemplo', secao: 'RH Direto', vinculo: 'Bolsista', meses: [3_600, 3_600, 3_600, 3_600, 3_600, 3_600] },
  { colaborador: 'Vaga em aberto', secao: 'RH Indireto', vinculo: 'CLT', meses: [0, 0, 6_200, 6_200, 6_200, 6_200] },
]

export const PMO_INCORRIDOS = [
  { item: 'Tarifas bancárias', rubrica: 'Custos Administrativos / Projetos Conveniados', meses: [420, 410, 430, 415, 440, 425] },
  { item: 'Taxa Administrativa do Instituto', rubrica: 'Taxa Administrativa do Instituto', meses: [9_000, 9_000, 9_000, 9_000, 9_000, 9_000] },
  { item: 'Fundo de reserva', rubrica: 'Fundo de Reserva (P&D)', meses: [3_000, 3_000, 3_000, 3_000, 3_000, 3_000] },
]

export const PMO_GASTOS = [
  { id: 1, data: '03/06/2026', descricao: 'Licença anual de software de análise', fornecedor: 'Fornecedor Exemplo Ltda.', valor: 18_400, status: 'Confirmado' },
  { id: 2, data: '17/06/2026', descricao: 'Estação de trabalho para a equipe', fornecedor: 'Equipamentos Modelo S.A.', valor: 12_900, status: 'Rascunho' },
  { id: 3, data: '24/06/2026', descricao: 'Treinamento técnico (2 vagas)', fornecedor: 'Instituto de Cursos Exemplo', valor: 4_800, status: 'Confirmado' },
]

export const PMO_FECHAMENTOS = [
  { mes: '01/2026', status: 'Fechado', quem: 'Ana Gestora, 05/02/2026' },
  { mes: '02/2026', status: 'Fechado', quem: 'Ana Gestora, 05/03/2026' },
  { mes: '03/2026', status: 'Reaberto', quem: 'Gustavo Admin, 20/04/2026' },
  { mes: '04/2026', status: 'Aberto', quem: '—' },
]

export const PMO_SALARIOS_HISTORICO = [
  { salario: 7_800, inicio: '01/03/2025', fim: '28/02/2026', motivo: 'Admissão' },
  { salario: 8_400, inicio: '01/03/2026', fim: '—', motivo: 'Dissídio' },
]
