/**
 * @fileoverview Dados mock para desenvolvimento sem backend
 * Remove este arquivo quando a API estiver pronta
 */

import type {
  Empresa,
  Utilizador,
  Fazenda,
  LoteProducao,
  Hub,
  Frete,
  Notificacao,
  APIResponse,
  KPIStats,
  MicroAgregador,
} from "../types";

import {
  PlanoEmpresa,
  StatusEmpresa,
  UserRole,
  TipoEmpresa,
  StatusUsuario,
  StatusFazenda,
  StatusLote,
  StatusFrete,
  StatusHub,
  TipoFrete,
  TipoNotificacao,
  CategoriaNotificacao,
  NivelQualidade,
  PapelEmpresa,
} from "../types";

// ========================
// FUNÇÕES DE TRANSFORMAÇÃO
// ========================

/**
 * Adiciona propriedades alias/computadas ao Hub para compatibilidade com UI
 */
function transformHub(hub: Hub): Hub {
  return {
    ...hub,
    name: hub.nome,
    location:
      hub.endereco ||
      (hub.localizacao
        ? `${hub.localizacao.provincia}, ${hub.localizacao.municipio}`
        : "N/A"),
    lat: hub.latitude,
    lng: hub.longitude,
    capacity: Math.round((hub.carga_atual / hub.capacidade_total) * 100),
    cargo: hub.carga_atual,
    nextTruck: hub.proxima_saida_prevista
      ? new Date(hub.proxima_saida_prevista).toLocaleString("pt-AO", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A",
    products: Array.isArray(hub.produtos_aceitos)
      ? hub.produtos_aceitos.map((p: any) => ({
          name: typeof p === "string" ? p : p.nome,
          quantity: p.quantidade || 0,
          unit: p.unidade || "Ton",
        }))
      : [],
    microAgents: hub.total_micro_agregadores,
  };
}

/**
 * Adiciona propriedades alias ao LoteProducao para compatibilidade com UI
 */
function transformLoteProducao(lote: LoteProducao): LoteProducao {
  return {
    ...lote,
    organic: lote.certificacao_organica,
    freightIncluded: lote.frete_incluido,
  };
}

// ========================
// MOCK: EMPRESAS
// ========================

export const mockEmpresas: Empresa[] = [
  {
    id: "1",
    nome: "AgriCorp Angola",
    nif: "5417890000",
    tipo_empresa: TipoEmpresa.PRIVADA,
    tipo: "PRIVADA",
    setor_atividade: "Agricultura",
    plano: PlanoEmpresa.ENTERPRISE,
    max_usuarios: 100,
    limite_usuarios: 100,
    logo_url: null,
    responsavel_nome: "João Silva",
    responsavel_telefone: "+244 923 456 789",
    responsavel_email: "joao@agricorp.ao",
    endereco_sede: "Rua Principal, Luanda",
    provincia: "Luanda",
    municipio: "Luanda",
    permissoes_modulos: { marketplace: true, logistics: true, analytics: true },
    status: StatusEmpresa.ATIVO,
    verificado: true,
    ultimo_login: new Date("2026-03-01"),
    created_at: new Date("2025-01-15"),
    updated_at: new Date("2026-03-01"),
  },
  {
    id: "2",
    nome: "FarmTech Huambo",
    nif: "5417890001",
    tipo_empresa: TipoEmpresa.PRIVADA,
    tipo: "PRIVADA",
    setor_atividade: "Tecnologia Agrícola",
    plano: PlanoEmpresa.PRO,
    max_usuarios: 50,
    limite_usuarios: 50,
    logo_url: null,
    responsavel_nome: "Maria Santos",
    responsavel_telefone: "+244 924 567 890",
    responsavel_email: "maria@farmtech.ao",
    endereco_sede: "Av. Central, Huambo",
    provincia: "Huambo",
    municipio: "Huambo",
    permissoes_modulos: { marketplace: true, logistics: true },
    status: StatusEmpresa.ATIVO,
    verificado: true,
    ultimo_login: new Date("2026-02-28"),
    created_at: new Date("2025-03-20"),
    updated_at: new Date("2026-02-28"),
  },
  {
    id: "3",
    nome: "Governo de Benguela",
    nif: "5417890002",
    tipo_empresa: TipoEmpresa.GOVERNAMENTAL,
    tipo: "GOVERNAMENTAL",
    setor_atividade: "Administração Pública",
    plano: PlanoEmpresa.ENTERPRISE,
    max_usuarios: 200,
    limite_usuarios: 200,
    logo_url: null,
    responsavel_nome: "Dr. António Costa",
    responsavel_telefone: "+244 925 678 901",
    responsavel_email: "antonio@gov.benguela.ao",
    endereco_sede: "Palácio do Governo, Benguela",
    provincia: "Benguela",
    municipio: "Benguela",
    permissoes_modulos: {
      marketplace: true,
      logistics: true,
      analytics: true,
      reports: true,
    },
    status: StatusEmpresa.ATIVO,
    verificado: true,
    ultimo_login: new Date("2026-03-02"),
    created_at: new Date("2024-11-10"),
    updated_at: new Date("2026-03-02"),
  },
];

// ========================
// MOCK: UTILIZADORES
// ========================

export const mockUtilizadores: Utilizador[] = [
  {
    id: "user1",
    nome_completo: "João Silva",
    email: "joao@agricorp.ao",
    telefone: "+244 923 456 789",
    tipo_usuario: UserRole.GOVERNMENT,
    status: StatusUsuario.APROVADO,
    verificado: true,
    avaliacao: 4.8,
    localizacao_id: "loc1",
    aldeia_localidade: null,
    endereco_completo: "Luanda, Angola",
    latitude: -8.8383,
    longitude: 13.2344,
    saldo_wallet: 15000.5,
    ultima_atividade: new Date("2026-03-02"),
    created_at: new Date("2025-01-15"),
    updated_at: new Date("2026-03-02"),
  },
];

// ========================
// MOCK: FAZENDAS
// ========================

export const mockFazendas: Fazenda[] = [
  {
    id: "farm1",
    codigo: "FAZ-001",
    produtor_id: "prod1",
    nome: "Fazenda Sol Nascente",
    descricao: "Fazenda de milho e feijão",
    localizacao_id: "loc1",
    aldeia: "Aldeia Central",
    latitude: -8.5,
    longitude: 13.5,
    area_total: 250.5,
    area_cultivada: 200.0,
    cultura_principal: "Milho",
    culturas_secundarias: ["Feijão", "Mandioca"],
    produtividade_media: 3.5,
    possui_irrigacao: true,
    tipo_irrigacao: "Gotejamento",
    possui_secagem: true,
    indice_ndvi: 0.75,
    humidade_solo: 65.3,
    ultima_analise_solo: new Date("2026-01-15"),
    status: StatusFazenda.VALIDADO,
    created_at: new Date("2025-05-10"),
    updated_at: new Date("2026-03-01"),
  },
];

// ========================
// MOCK: LOTES (MARKETPLACE)
// ========================

export const mockLotes: LoteProducao[] = [
  {
    id: "lote1",
    codigo: "LOT-2026-001",
    produtor_id: "prod1",
    fazenda_id: "farm1",
    produto_id: "prod1",
    nome_produto: "Milho",
    quantidade: 5000,
    unidade: "kg",
    nivel_qualidade: NivelQualidade.A_PLUS,
    certificacao_organica: true,
    data_colheita: new Date("2026-02-20"),
    periodo_colheita: "Fevereiro 2026",
    preco_unitario: 350,
    frete_incluido: false,
    local_retirada: "Hub Huambo Central",
    publicado_marketplace: true,
    data_publicacao: new Date("2026-02-21"),
    destaque: "true",
    urgente: false,
    status: StatusLote.DISPONIVEL,
    parecer_ia: "Lote de alta qualidade - Recomendado",
    created_at: new Date("2026-02-21"),
    updated_at: new Date("2026-03-01"),
  },
];

// ========================
// MOCK: HUBS
// ========================

export const mockHubs: Hub[] = [
  {
    id: "hub1",
    codigo: "HUB-HUA-001",
    nome: "Hub Huambo Central",
    descricao: "Centro logístico principal de Huambo",
    localizacao_id: "loc2",
    endereco: "Av. Principal, Huambo",
    latitude: -12.7767,
    longitude: 15.7389,
    capacidade_total: 10000,
    carga_atual: 6500,
    produtos_aceitos: ["Milho", "Feijão", "Soja", "Mandioca"],
    horario_funcionamento: "06:00-18:00 (Segunda a Sábado)",
    possui_balanca: true,
    possui_refrigeracao: true,
    numero_docas: 8,
    total_micro_agregadores: 24,
    proxima_saida_prevista: new Date("2026-03-05"),
    status: StatusHub.OPERACIONAL,
    data_inauguracao: new Date("2024-06-01"),
    created_at: new Date("2024-05-15"),
    updated_at: new Date("2026-03-02"),
  },
];

// ========================
// MOCK: FRETES
// ========================

export const mockFretes: Frete[] = [
  {
    id: "frete1",
    codigo: "FRT-2026-0345",
    produtor_id: "prod1",
    motorista_id: "driver1",
    veiculo_id: null,
    lote_id: "lote1",
    tipo_frete: TipoFrete.VIA_HUB,
    hub_destino_id: "hub1",
    produto: "Milho",
    quantidade: 5000,
    origem_nome: "Hub Huambo Central",
    origem_latitude: -12.7767,
    origem_longitude: 15.7389,
    destino_nome: "Luanda - Cliente Empresa",
    destino_latitude: -8.8383,
    destino_longitude: 13.2344,
    distancia_km: 320,
    duracao_estimada: 360,
    rota_planejada: null,
    valor_frete: 45000,
    taxa_plataforma: 4500,
    data_solicitacao: new Date("2026-03-03"),
    data_aceite: null,
    data_coleta_prevista: new Date("2026-03-05"),
    data_coleta_realizada: null,
    data_entrega_prevista: new Date("2026-03-06"),
    data_entrega_realizada: null,
    status: StatusFrete.PENDENTE,
    percentual_conclusao: 0,
    created_at: new Date("2026-03-03"),
    updated_at: new Date("2026-03-03"),
  },
];

// ========================
// MOCK: NOTIFICAÇÕES
// ========================

export const mockNotificacoes: Notificacao[] = [
  {
    id: "notif1",
    usuario_id: "user1",
    tipo: TipoNotificacao.INFO,
    categoria: CategoriaNotificacao.MARKETPLACE,
    titulo: "Novo lote disponível",
    mensagem: "Um novo lote de milho foi adicionado ao marketplace",
    link_acao: "/marketplace?lote=lote1",
    entidade_relacionada_id: "lote1",
    lida: false,
    data_leitura: null,
    created_at: new Date("2026-03-02T10:30:00"),
  },
  {
    id: "notif2",
    usuario_id: "user1",
    tipo: TipoNotificacao.ALERTA,
    categoria: CategoriaNotificacao.FRETE,
    titulo: "Frete aguardando confirmação",
    mensagem: "O frete FRT-2026-0345 está aguardando sua aprovação",
    link_acao: "/logistics?frete=frete1",
    entidade_relacionada_id: "frete1",
    lida: false,
    data_leitura: null,
    created_at: new Date("2026-03-02T14:15:00"),
  },
  {
    id: "notif3",
    usuario_id: "user1",
    tipo: TipoNotificacao.INFO,
    categoria: CategoriaNotificacao.SISTEMA,
    titulo: "Atualização do sistema",
    mensagem: "Nova versão do painel disponível com melhorias de performance",
    link_acao: null,
    entidade_relacionada_id: null,
    lida: true,
    data_leitura: new Date("2026-03-01T16:00:00"),
    created_at: new Date("2026-03-01T09:00:00"),
  },
];

// ========================
// MOCK: DADOS ESTATÍSTICOS
// ========================

export const mockProducaoRegional = [
  { name: "Huambo", milho: 4500, mandioca: 3200, feijao: 1200, soja: 900 },
  { name: "Benguela", milho: 3100, mandioca: 2800, feijao: 900, soja: 1500 },
  { name: "Huíla", milho: 5200, mandioca: 2100, feijao: 1800, soja: 1100 },
  { name: "Malanje", milho: 2800, mandioca: 4100, feijao: 1500, soja: 2000 },
  { name: "Uíge", milho: 1200, mandioca: 5600, feijao: 1100, soja: 400 },
];

export const mockKPIs: KPIStats[] = [
  {
    label: "Produção Total",
    value: "124.5k Ton",
    subValue: "+12% vs 2023",
    trend: "up" as const,
    color: "emerald",
    icon: "package",
  },
  {
    label: "Eficiência Logística",
    value: "87.4%",
    subValue: "-2.1% tempo médio",
    trend: "up" as const,
    color: "amber",
    icon: "truck",
  },
  {
    label: "Segurança Alimentar",
    value: "91/100",
    subValue: "Estável",
    trend: "neutral" as const,
    color: "blue",
    icon: "shield",
  },
  {
    label: "Risco de Quebra",
    value: "14.2%",
    subValue: "Alerta El Niño",
    trend: "down" as const,
    color: "rose",
    icon: "zap",
  },
];

export const mockVeiculos = [
  {
    id: "TRK-202",
    type: "truck" as const,
    cargo: "Milho Branco (Grão)",
    weight: "24 Ton",
    driver: "Mateus Cavungo",
    origin: "Fazenda Boa Esperança",
    destination: "Hub Malanje Alpha",
    eta: "22 min",
    status: "Selo Sanitário Ativo",
    lat: -9.42,
    lng: 16.03,
    rotation: 45,
  },
  {
    id: "KUP-88",
    type: "kupapata" as const,
    cargo: "Mandioca Seca",
    weight: "450 kg",
    driver: "João Bento",
    origin: "Aldeia B",
    destination: "Hub Cacuso",
    eta: "12 min",
    status: "Pequena Escala",
    lat: -9.45,
    lng: 15.95,
    rotation: 120,
  },
];

export const mockRankingComunas = [
  {
    rank: 1,
    nome: "Catumbela",
    provincia: "Benguela",
    producao: 12800,
    crescimento: 18.5,
    eficiencia: 94,
  },
  {
    rank: 2,
    nome: "Caála",
    provincia: "Huambo",
    producao: 11200,
    crescimento: 15.2,
    eficiencia: 91,
  },
  {
    rank: 3,
    nome: "Cacuso",
    provincia: "Malanje",
    producao: 9800,
    crescimento: 12.1,
    eficiencia: 88,
  },
];

// ========================
// MOCK: MICRO-AGREGADORES
// ========================

export const mockMicroAgregadores: MicroAgregador[] = [
  {
    id: "ma1",
    codigo: "MA-01",
    nome: "João Mandiocas",
    motorista_id: "driver1",
    hub_vinculado_id: "hub1",
    modelo_veiculo: "Kupapata 300",
    localizacao_atual: "Aldeia B → Hub Cacuso",
    latitude: -9.45,
    longitude: 15.95,
    carga_atual: "450kg",
    capacidade_maxima: 0.5,
    status: "EM_TRANSITO",
    bateria_percentual: 82,
    velocidade_atual: 24,
    eficiencia: "94%",
    ultima_sincronizacao: new Date("2026-03-02T14:30:00"),
    created_at: new Date("2025-08-15"),
    updated_at: new Date("2026-03-02T14:30:00"),
  },
  {
    id: "ma2",
    codigo: "MA-02",
    nome: "Carlos Bengue",
    motorista_id: "driver2",
    hub_vinculado_id: "hub1",
    modelo_veiculo: "Triciclo Cargo",
    localizacao_atual: "Hub Caála",
    latitude: -12.85,
    longitude: 15.56,
    carga_atual: "0kg",
    capacidade_maxima: 0.3,
    status: "DISPONIVEL",
    bateria_percentual: 45,
    velocidade_atual: 0,
    eficiencia: "88%",
    ultima_sincronizacao: new Date("2026-03-02T13:45:00"),
    created_at: new Date("2025-09-10"),
    updated_at: new Date("2026-03-02T13:45:00"),
  },
  {
    id: "ma3",
    codigo: "MA-03",
    nome: "Maria Kwanza",
    motorista_id: "driver3",
    hub_vinculado_id: "hub1",
    modelo_veiculo: "Kupapata 300",
    localizacao_atual: "Aldeia Delta",
    latitude: -11.75,
    longitude: 15.12,
    carga_atual: "200kg",
    capacidade_maxima: 0.5,
    status: "CARREGANDO",
    bateria_percentual: 95,
    velocidade_atual: 5,
    eficiencia: "91%",
    ultima_sincronizacao: new Date("2026-03-02T14:25:00"),
    created_at: new Date("2025-07-22"),
    updated_at: new Date("2026-03-02T14:25:00"),
  },
  {
    id: "ma4",
    codigo: "MA-04",
    nome: "Bento Reis",
    motorista_id: "driver4",
    hub_vinculado_id: "hub1",
    modelo_veiculo: "Micro-Van",
    localizacao_atual: "Mungo → Hub Huambo",
    latitude: -12.78,
    longitude: 15.74,
    carga_atual: "1.2 Ton",
    capacidade_maxima: 1.5,
    status: "EM_TRANSITO",
    bateria_percentual: 100,
    velocidade_atual: 48,
    eficiencia: "96%",
    ultima_sincronizacao: new Date("2026-03-02T14:35:00"),
    created_at: new Date("2025-06-05"),
    updated_at: new Date("2026-03-02T14:35:00"),
  },
];

// ========================
// MOCK: PRODUCTION FLOW (Blockchain Ledger)
// ========================

export const mockBlockchainLedger = [
  {
    id: "TX-9021",
    farm: "Boa Esperança",
    driver: "M. João",
    status: "Smart Contract Executed",
    type: "Pagamento" as const,
    amount: "450.000 AOA",
    time: "2m atrás",
    hash: "0x8f23...a9b2",
    volume: "12 Ton",
  },
  {
    id: "TX-9020",
    farm: "Coop Kudia",
    driver: "J. Bento",
    status: "Payment Escrowed",
    type: "Recolha" as const,
    amount: "120.000 AOA",
    time: "15m atrás",
    hash: "0x4c11...f822",
    volume: "4 Ton",
  },
  {
    id: "TX-9019",
    farm: "Agric. Suku",
    driver: "A. Silva",
    status: "Verification Pending",
    type: "Transporte" as const,
    amount: "890.000 AOA",
    time: "42m atrás",
    hash: "0xe231...11d5",
    volume: "22 Ton",
  },
  {
    id: "TX-9018",
    farm: "Fazenda Rio Manso",
    driver: "K. Pedro",
    status: "Delivered",
    type: "Transporte" as const,
    amount: "310.000 AOA",
    time: "1h atrás",
    hash: "0x1a2b...c3d4",
    volume: "8 Ton",
  },
  {
    id: "TX-9017",
    farm: "Unidade Catata",
    driver: "L. Gomes",
    status: "Collected",
    type: "Recolha" as const,
    amount: "55.000 AOA",
    time: "2h atrás",
    hash: "0x5e6f...g7h8",
    volume: "1.5 Ton",
  },
];

export const mockPriceHistory = [
  { month: "Jul", milho: 280, mandioca: 180, feijao: 850 },
  { month: "Ago", milho: 310, mandioca: 195, feijao: 880 },
  { month: "Set", milho: 300, mandioca: 210, feijao: 920 },
  { month: "Out", milho: 350, mandioca: 240, feijao: 1050 },
  { month: "Nov", milho: 390, mandioca: 265, feijao: 1180 },
  { month: "Dez", milho: 420, mandioca: 290, feijao: 1250 },
];

// ========================
// MOCK: RISK ANALYSIS
// ========================

export const mockCreditScore = [
  { subject: "Produtividade", A: 120, fullMark: 150 },
  { subject: "Logística", A: 98, fullMark: 150 },
  { subject: "Clima", A: 86, fullMark: 150 },
  { subject: "Transações", A: 99, fullMark: 150 },
  { subject: "Resiliência", A: 115, fullMark: 150 },
];

export const mockFarmerProfiles = [
  {
    id: "1",
    name: "António Silva",
    location: "Malanje",
    score: 840,
    status: "Premium" as const,
    harvestReliability: "98%",
    regionRisk: "Baixo",
    collateral: "14.5M AOA",
    validatedArea: "150 Ha",
    lastYield: "4.2 T/Ha",
  },
  {
    id: "2",
    name: "Maria João",
    location: "Huambo",
    score: 620,
    status: "Standard" as const,
    harvestReliability: "82%",
    regionRisk: "Médio",
    collateral: "5.2M AOA",
    validatedArea: "45 Ha",
    lastYield: "2.1 T/Ha",
  },
  {
    id: "3",
    name: "Carlos Bento",
    location: "Benguela",
    score: 450,
    status: "Risco" as const,
    harvestReliability: "65%",
    regionRisk: "Alto",
    collateral: "2.1M AOA",
    validatedArea: "210 Ha",
    lastYield: "1.4 T/Ha",
  },
];

// ========================
// MOCK: REPORTS BI
// ========================

export const mockReports = [
  {
    id: "INT-001",
    category: "Produção" as const,
    title: "Angola Grains & Cereals Market Outlook 2024-2030",
    icon: "FilePieChart",
    color: "emerald",
    format: "PDF",
    status: "ready" as const,
    desc: "Análise quantitativa de rendimento por hectare e projeções de consumo interno.",
    marketScope: "Análise de Safra",
    impact: "Crítico" as const,
  },
  {
    id: "INT-002",
    category: "Produção" as const,
    title: "Fertilizer & Agri-Inputs Regional Supply Chain",
    icon: "Microscope",
    color: "emerald",
    format: "PDF, XLSX",
    status: "ready" as const,
    desc: "Mapeamento de fornecedores, custos de importação e eficácia de fertilização.",
    marketScope: "Input Market",
    impact: "Alto" as const,
  },
  {
    id: "INT-003",
    category: "Logística" as const,
    title: "Strategic Cold Chain & Perishables Infrastructure",
    icon: "Box",
    color: "blue",
    format: "PDF",
    status: "ready" as const,
    desc: "Gargalos de refrigeração e perdas pós-colheita em corredores prioritários.",
    marketScope: "Infraestrutura",
    impact: "Crítico" as const,
  },
  {
    id: "INT-004",
    category: "Logística" as const,
    title: "SADC Export Corridors Efficiency Analysis",
    icon: "Globe",
    color: "blue",
    format: "PDF",
    status: "ready" as const,
    desc: "Competitividade do Porto de Lobito vs. rotas alternativas na África Austral.",
    marketScope: "Logística SADC",
    impact: "Médio" as const,
  },
  {
    id: "INT-005",
    category: "Financeiro" as const,
    title: "Agro-Fintech & Rural Credit Digitization Index",
    icon: "Coins",
    color: "amber",
    format: "PDF",
    status: "ready" as const,
    desc: "Penetração de pagamentos digitais e scoring de crédito via satélite.",
    marketScope: "Finanças Rurais",
    impact: "Alto" as const,
  },
  {
    id: "INT-006",
    category: "Estratégico" as const,
    title: "Climate Resilience & Adaptive Irrigation Policy",
    icon: "Waves",
    color: "rose",
    format: "PDF",
    status: "ready" as const,
    desc: "Mitigação de riscos de seca extrema e políticas hídricas estratégicas.",
    marketScope: "Resiliência Climática",
    impact: "Crítico" as const,
  },
];

// ========================
// MOCK: COMPANY DATA
// ========================

export const mockCompanyData = {
  id: "CMP-001",
  name: "Ministério da Agricultura e Pescas",
  nif: "5000123456",
  type: "Governamental" as const,
  tier: "Enterprise" as const,
  maxUsers: 25,
  lastLogin: "Agora",
};

// ========================
// MOCK: AI PREDICTIONS DATA
// ========================

export const mockHybridModelData = [
  { month: "Dez", ndvi: 0.62, transacoes: 2100, volume: 1800 },
  { month: "Jan", ndvi: 0.68, transacoes: 2500, volume: 2200 },
  { month: "Fev", ndvi: 0.75, transacoes: 3200, volume: 2900 },
  { month: "Mar", ndvi: 0.82, transacoes: 5100, volume: 4800 },
  { month: "Abr (P)", ndvi: 0.85, transacoes: 7800, volume: 7200 },
  { month: "Mai (P)", ndvi: 0.88, transacoes: 8200, volume: 8100 },
];

export const mockMLFeatures = [
  { name: "Índice NDVI (GEE)", weight: 42, color: "#10b981" },
  { name: "Volume de Fretes (Uber)", weight: 35, color: "#059669" },
  { name: "Histórico de Preços", weight: 15, color: "#64748b" },
  { name: "Dados Meteorológicos", weight: 8, color: "#3b82f6" },
];

export const mockAIPredictions = {
  demandForecast: {
    accuracy: "94.2%",
    nextPeak: "Abril 2026",
    confidence: "Alta",
    regions: ["Malanje", "Huambo", "Benguela"],
  },
  priceVariation: {
    commodity: "Milho",
    currentPrice: "420 AOA/kg",
    predictedChange: "+8.5%",
    timeframe: "30 dias",
  },
  riskAlerts: [
    {
      region: "Cunene",
      risk: "Stress Hídrico",
      level: "Médio",
      date: "15 Mar",
    },
    { region: "Benguela", risk: "Pragas", level: "Baixo", date: "22 Mar" },
  ],
};

// ========================
// MOCK: WEATHER & GEOINTEL DATA
// ========================

export const mockWeatherData = {
  nacional: {
    temperature: 26,
    humidity: 65,
    rainfall: 45,
    condition: "Parcialmente Nublado",
    forecast: [
      { day: "Seg", temp: 27, condition: "Ensolarado" },
      { day: "Ter", temp: 28, condition: "Nublado" },
      { day: "Qua", temp: 26, condition: "Chuva" },
    ],
  },
  luanda: {
    temperature: 28,
    humidity: 70,
    rainfall: 20,
    condition: "Ensolarado",
  },
  huambo: { temperature: 22, humidity: 55, rainfall: 80, condition: "Chuva" },
  benguela: {
    temperature: 25,
    humidity: 68,
    rainfall: 35,
    condition: "Nublado",
  },
};

export const mockAgriHealthData = {
  ndviAverage: 0.72,
  soilMoisture: 68,
  pestLevel: "Baixo",
  cropHealth: "Excelente",
  recommendations: [
    "Continuar monitoramento de umidade do solo",
    "Preparar para colheita em 45 dias",
    "Aplicar fertilizante nitrogenado nas próximas 2 semanas",
  ],
};

// ========================
// FUNÇÕES HELPER MOCK API
// ========================

/**
 * Simula delay de rede
 */
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Cria resposta de sucesso mock
 */
export function mockSuccess<T>(data: T, metadata?: any): APIResponse<T> {
  return {
    success: true,
    data,
    metadata,
  };
}

/**
 * Cria resposta de erro mock
 */
export function mockError(
  message: string,
  code: string = "MOCK_ERROR",
): APIResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}

/**
 * Simula paginação
 */
export function mockPaginate<T>(
  items: T[],
  page: number = 1,
  limit: number = 20,
): { data: T[]; metadata: any } {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedItems = items.slice(start, end);

  return {
    data: paginatedItems,
    metadata: {
      page,
      perPage: limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
    },
  };
}

/**
 * Mock API para desenvolvimento
 */
export const mockAPI = {
  empresas: {
    list: async (filters?: any) => {
      await delay();
      const { data, metadata } = mockPaginate(
        mockEmpresas,
        filters?.page || 1,
        filters?.limit || 20,
      );
      return mockSuccess(data, metadata);
    },
    getById: async (id: string) => {
      await delay();
      const empresa = mockEmpresas.find((e) => e.id === id);
      return empresa
        ? mockSuccess(empresa)
        : mockError("Empresa não encontrada", "NOT_FOUND");
    },
    delete: async (id: string) => {
      await delay();
      const index = mockEmpresas.findIndex((e) => e.id === id);
      if (index === -1) {
        return mockError("Empresa não encontrada", "NOT_FOUND");
      }
      mockEmpresas.splice(index, 1);
      return mockSuccess({ id, deleted: true });
    },
  },

  fazendas: {
    list: async (filters?: any) => {
      await delay();
      const { data, metadata } = mockPaginate(
        mockFazendas,
        filters?.page || 1,
        filters?.limit || 20,
      );
      return mockSuccess(data, metadata);
    },
  },

  lotes: {
    list: async (filters?: any) => {
      await delay();
      const { data, metadata } = mockPaginate(
        mockLotes,
        filters?.page || 1,
        filters?.limit || 20,
      );
      // Transformar lotes para incluir aliases
      const transformedData = data.map(transformLoteProducao);
      return mockSuccess(transformedData, metadata);
    },
  },

  hubs: {
    list: async (filters?: any) => {
      await delay();
      const { data, metadata } = mockPaginate(
        mockHubs,
        filters?.page || 1,
        filters?.limit || 20,
      );
      // Transformar hubs para incluir aliases e propriedades computadas
      const transformedData = data.map(transformHub);
      return mockSuccess(transformedData, metadata);
    },
  },

  fretes: {
    list: async (filters?: any) => {
      await delay();
      const { data, metadata } = mockPaginate(
        mockFretes,
        filters?.page || 1,
        filters?.limit || 20,
      );
      return mockSuccess(data, metadata);
    },
  },

  notificacoes: {
    list: async (filters?: any) => {
      await delay();
      const { data, metadata } = mockPaginate(
        mockNotificacoes,
        filters?.page || 1,
        filters?.limit || 20,
      );
      return mockSuccess(data, metadata);
    },
    getUnreadCount: async () => {
      await delay();
      const count = mockNotificacoes.filter((n) => !n.lida).length;
      return mockSuccess({ count });
    },
  },

  estatisticas: {
    getProducaoRegional: async () => {
      await delay();
      return mockSuccess(mockProducaoRegional);
    },
    getKPIs: async () => {
      await delay();
      return mockSuccess(mockKPIs);
    },
    getRankingComunas: async () => {
      await delay();
      return mockSuccess(mockRankingComunas);
    },
  },

  veiculos: {
    getAtivos: async () => {
      await delay();
      return mockSuccess(mockVeiculos);
    },
  },

  microAgregadores: {
    list: async (filters?: any) => {
      await delay();
      const { data, metadata } = mockPaginate(
        mockMicroAgregadores,
        filters?.page || 1,
        filters?.limit || 50,
      );
      return mockSuccess(data, metadata);
    },
    getById: async (id: string) => {
      await delay();
      const microAgregador = mockMicroAgregadores.find((m) => m.id === id);
      if (!microAgregador) {
        return {
          success: false,
          data: null,
          error: {
            message: "Micro-agregador não encontrado",
            code: "NOT_FOUND",
          },
        };
      }
      return mockSuccess(microAgregador);
    },
  },

  blockchain: {
    getLedger: async (filters?: any) => {
      await delay();
      const { data, metadata } = mockPaginate(
        mockBlockchainLedger,
        filters?.page || 1,
        filters?.limit || 20,
      );
      return mockSuccess(data, metadata);
    },
    getPriceHistory: async () => {
      await delay();
      return mockSuccess(mockPriceHistory);
    },
  },

  risco: {
    getCreditScore: async () => {
      await delay();
      return mockSuccess(mockCreditScore);
    },
    getFarmerProfiles: async (filters?: any) => {
      await delay();
      const { data, metadata } = mockPaginate(
        mockFarmerProfiles,
        filters?.page || 1,
        filters?.limit || 10,
      );
      return mockSuccess(data, metadata);
    },
    getProfileById: async (id: string) => {
      await delay();
      const profile = mockFarmerProfiles.find((p) => p.id === id);
      if (!profile) {
        return {
          success: false,
          data: null,
          error: { message: "Perfil não encontrado", code: "NOT_FOUND" },
        };
      }
      return mockSuccess(profile);
    },
  },

  relatorios: {
    list: async (filters?: any) => {
      await delay();
      let data = mockReports;
      if (filters?.category && filters.category !== "Todos") {
        data = data.filter((r) => r.category === filters.category);
      }
      const { data: paginatedData, metadata } = mockPaginate(
        data,
        filters?.page || 1,
        filters?.limit || 20,
      );
      return mockSuccess(paginatedData, metadata);
    },
    getById: async (id: string) => {
      await delay();
      const report = mockReports.find((r) => r.id === id);
      if (!report) {
        return {
          success: false,
          data: null,
          error: { message: "Relatório não encontrado", code: "NOT_FOUND" },
        };
      }
      return mockSuccess(report);
    },
  },

  company: {
    getData: async () => {
      await delay();
      return mockSuccess(mockCompanyData);
    },
  },

  ia: {
    getModelData: async () => {
      await delay();
      return mockSuccess(mockHybridModelData);
    },
    getFeatures: async () => {
      await delay();
      return mockSuccess(mockMLFeatures);
    },
    getPredictions: async () => {
      await delay();
      return mockSuccess(mockAIPredictions);
    },
  },

  geointel: {
    getWeather: async (province?: string) => {
      await delay();
      if (province) {
        const weatherData =
          mockWeatherData[
            province.toLowerCase() as keyof typeof mockWeatherData
          ];
        return weatherData
          ? mockSuccess(weatherData)
          : mockError("Província não encontrada", "NOT_FOUND");
      }
      return mockSuccess(mockWeatherData.nacional);
    },
    getAgriHealth: async () => {
      await delay();
      return mockSuccess(mockAgriHealthData);
    },
  },
};

// Exportar modo desenvolvimento
export const IS_DEV_MODE = import.meta.env.DEV;
export const USE_MOCK_API =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;
