// ============================================
// AGRI-CONNECT - TYPESCRIPT TYPE DEFINITIONS
// Painel Empresa - Clientes
// Sincronizado com schema.prisma
// ============================================

// ========================
// ENUMS DO PRISMA
// ========================

/**
 * Tipos de usuário (tipo_usuario no Prisma)
 */
export enum UserRole {
  GOVERNMENT = 'GOVERNMENT',  // Governo/Empresa
  STARTUP = 'STARTUP',        // Equipa Startup
  FARMER = 'FARMER',          // Camponês/Produtor
  DRIVER = 'DRIVER'           // Motorista
}

/**
 * Tipos de empresa
 */
export enum TipoEmpresa {
  GOVERNAMENTAL = 'GOVERNAMENTAL',
  PRIVADA = 'PRIVADA',
  ONG = 'ONG'
}

/**
 * Planos de empresa
 */
export enum PlanoEmpresa {
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

/**
 * Status de empresa
 */
export enum StatusEmpresa {
  ATIVO = 'ATIVO',
  SUSPENSO = 'SUSPENSO',
  INATIVO = 'INATIVO'
}

/**
 * Papel do usuário na empresa
 */
export enum PapelEmpresa {
  ADMIN = 'ADMIN',
  GESTOR = 'GESTOR',
  AUDITOR = 'AUDITOR',
  VISUALIZADOR = 'VISUALIZADOR'
}

/**
 * Status de usuário
 */
export enum StatusUsuario {
  APROVADO = 'APROVADO',
  PENDENTE = 'PENDENTE',
  SUSPENSO = 'SUSPENSO',
  INATIVO = 'INATIVO'
}

/**
 * Status de fazenda
 */
export enum StatusFazenda {
  VALIDADO = 'VALIDADO',
  PENDENTE = 'PENDENTE',
  REJEITADO = 'REJEITADO'
}

/**
 * Tipo de produtor
 */
export enum TipoProdutor {
  PEQUENO = 'PEQUENO',
  MEDIO = 'MEDIO',
  GRANDE = 'GRANDE'
}

/**
 * Nível de qualidade
 */
export enum NivelQualidade {
  A_PLUS = 'A_PLUS',
  A = 'A',
  B = 'B',
  C = 'C'
}

/**
 * Status de lote
 */
export enum StatusLote {
  DISPONIVEL = 'DISPONIVEL',
  RESERVADO = 'RESERVADO',
  EM_TRANSITO = 'EM_TRANSITO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO'
}

/**
 * Status de frete
 */
export enum StatusFrete {
  PENDENTE = 'PENDENTE',
  ACEITO = 'ACEITO',
  EM_COLETA = 'EM_COLETA',
  EM_TRANSITO = 'EM_TRANSITO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO'
}

/**
 * Tipo de frete
 */
export enum TipoFrete {
  DIRETO = 'DIRETO',
  VIA_HUB = 'VIA_HUB',
  MARKETPLACE = 'MARKETPLACE'
}

/**
 * Status de hub
 */
export enum StatusHub {
  OPERACIONAL = 'OPERACIONAL',
  SATURADO = 'SATURADO',
  MANUTENCAO = 'MANUTENCAO',
  INATIVO = 'INATIVO'
}

/**
 * Status de transação
 */
export enum StatusTransacao {
  PENDENTE = 'PENDENTE',
  PROCESSANDO = 'PROCESSANDO',
  CONCLUIDO = 'CONCLUIDO',
  FALHADO = 'FALHADO',
  CANCELADO = 'CANCELADO'
}

/**
 * Tipo de transação
 */
export enum TipoTransacao {
  PAGAMENTO_PRODUTOR = 'PAGAMENTO_PRODUTOR',
  FRETE_MOTORISTA = 'FRETE_MOTORISTA',
  TAXA_PLATAFORMA = 'TAXA_PLATAFORMA',
  REEMBOLSO = 'REEMBOLSO'
}

/**
 * Método de pagamento
 */
export enum MetodoPagamento {
  MULTICAIXA_EXPRESS = 'MULTICAIXA_EXPRESS',
  WALLET_AGRI = 'WALLET_AGRI',
  TRANSFERENCIA_BANCARIA = 'TRANSFERENCIA_BANCARIA',
  DINHEIRO = 'DINHEIRO'
}

/**
 * Tipo de notificação
 */
export enum TipoNotificacao {
  INFO = 'INFO',
  SUCESSO = 'SUCESSO',
  ALERTA = 'ALERTA',
  ERRO = 'ERRO'
}

/**
 * Categoria de notificação
 */
export enum CategoriaNotificacao {
  FRETE = 'FRETE',
  PAGAMENTO = 'PAGAMENTO',
  MARKETPLACE = 'MARKETPLACE',
  SISTEMA = 'SISTEMA',
  CHAT = 'CHAT'
}

// ========================
// ABAS/SEÇÕES DO PAINEL
// ========================

/**
 * Enum para as diferentes abas/seções do painel
 */
export enum AppTab {
  // Abas do Governo/Empresa
  VISAO_ESTRATEGICA = 'visao_estrategica',
  MARKETPLACE = 'marketplace',
  FAZENDAS = 'fazendas',
  RANKING_COMUNAS = 'ranking_comunas',
  FLUXO_PRODUCAO = 'fluxo_producao',
  GEOINTELIGENCIA = 'geointeligencia',
  PREDICOES_IA = 'predicoes_ia',
  RISCO = 'risco',
  LOGISTICA_RADAR = 'logistica_radar',
  HUBS = 'hubs',
  MICRO_AGREGADORES = 'micro_agregadores',
  RELATORIOS = 'relatorios',
  UTILIZADORES = 'utilizadores',
  
  // Abas da Startup
  STARTUP_DASHBOARD = 'startup_dashboard',
  STARTUP_COMPANIES_MGMT = 'startup_companies_mgmt',
  STARTUP_HUBS_MGMT = 'startup_hubs_mgmt',
  STARTUP_MICRO_AGREGADORES_MGMT = 'startup_micro_agregadores_mgmt',
  STARTUP_USERS = 'startup_users',
  STARTUP_TEAM = 'startup_team',
  STARTUP_FREIGHTS = 'startup_freights',
  STARTUP_VERIFICATION = 'startup_verification',
  STARTUP_TRANSACTIONS = 'startup_transactions',
  STARTUP_SUPPORT = 'startup_support'
}

// ========================
// INTERFACES PRINCIPAIS
// ========================

/**
 * Localização (Província, Município, Comuna)
 */
export interface Localizacao {
  id: string;
  provincia: string;
  municipio: string;
  comuna: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Utilizador (Usuário base)
 */
export interface Utilizador {
  id: string;
  nome_completo: string;
  email: string | null;
  telefone: string;
  tipo_usuario: UserRole;
  status: StatusUsuario;
  verificado: boolean;
  avaliacao: number;
  localizacao_id: string | null;
  localizacao?: Localizacao;
  aldeia_localidade: string | null;
  endereco_completo: string | null;
  latitude: number | null;
  longitude: number | null;
  saldo_wallet: number;
  ultima_atividade: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Empresa
 */
export interface Empresa {
  id: string;
  nome: string;
  nif: string;
  tipo_empresa: TipoEmpresa;
  tipo?: string; // alias para tipo_empresa (legacy)
  setor_atividade: string | null;
  plano: PlanoEmpresa;
  max_usuarios: number;
  limite_usuarios?: number; // alias para max_usuarios (legacy)
  logo_url?: string | null;
  responsavel_nome: string | null;
  responsavel_telefone: string | null;
  responsavel_email: string | null;
  endereco_sede: string | null;
  provincia: string | null;
  municipio?: string | null;
  permissoes_modulos: any | null;
  status: StatusEmpresa;
  verificado: boolean;
  ultimo_login: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Relação Usuário-Empresa
 */
export interface UsuarioEmpresa {
  id: string;
  usuario_id: string;
  empresa_id: string;
  papel: PapelEmpresa;
  permissoes_especificas: any | null;
  ativo: boolean;
  created_at: Date;
  utilizador?: Utilizador;
  empresa?: Empresa;
}

/**
 * Produtor
 */
export interface Produtor {
  id: string;
  usuario_id: string;
  utilizador?: Utilizador;
  tipo_produtor: TipoProdutor;
  produtos_principais: any | null;
  capacidade_producao_anual: number | null;
  area_total_cultivada: number | null;
  possui_armazem: boolean;
  capacidade_armazenamento: number | null;
  certificacao_organica: boolean;
  total_entregas_realizadas: number;
  volume_total_escoado: number;
  receita_total: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Fazenda
 */
export interface Fazenda {
  id: string;
  codigo: string;
  produtor_id: string;
  produtor?: Produtor;
  nome: string;
  descricao: string | null;
  localizacao_id: string | null;
  localizacao?: Localizacao;
  aldeia: string | null;
  latitude: number | null;
  longitude: number | null;
  area_total: number;
  area_cultivada: number | null;
  cultura_principal: string | null;
  culturas_secundarias: any | null;
  produtividade_media: number | null;
  possui_irrigacao: boolean;
  tipo_irrigacao: string | null;
  possui_secagem: boolean;
  indice_ndvi: number | null;
  humidade_solo: number | null;
  ultima_analise_solo: Date | null;
  status: StatusFazenda;
  created_at: Date;
  updated_at: Date;
}

/**
 * Produto
 */
export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  nome_cientifico: string | null;
  categoria: string | null;
  unidade_medida: string;
  preco_referencia_min: number | null;
  preco_referencia_max: number | null;
  preco_medio_mercado: number | null;
  perecivel: boolean;
  tempo_validade_dias: number | null;
  requer_refrigeracao: boolean;
  periodo_safra: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Lote de Produção (Marketplace)
 */
export interface LoteProducao {
  id: string;
  codigo: string;
  produtor_id: string;
  produtor?: Produtor;
  fazenda_id: string;
  fazenda?: Fazenda;
  produto_id: string;
  produto?: Produto;
  nome_produto: string;
  quantidade: number;
  unidade: string;
  nivel_qualidade: NivelQualidade;
  certificacao_organica: boolean;
  data_colheita: Date;
  periodo_colheita: string | null;
  preco_unitario: number;
  frete_incluido: boolean;
  local_retirada: string | null;
  publicado_marketplace: boolean;
  data_publicacao: Date | null;
  destaque: string;
  urgente: boolean;
  status: StatusLote;
  parecer_ia: string | null;
  created_at: Date;
  updated_at: Date;
  
  // Aliases para compatibilidade com UI
  organic?: boolean;  // alias para certificacao_organica
  freightIncluded?: boolean;  // alias para frete_incluido
}

/**
 * Hub de Armazenamento
 */
export interface Hub {
  id: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  localizacao_id: string;
  localizacao?: Localizacao;
  endereco: string | null;
  latitude: number;
  longitude: number;
  capacidade_total: number;
  carga_atual: number;
  produtos_aceitos: any | null;
  horario_funcionamento: string | null;
  possui_balanca: boolean;
  possui_refrigeracao: boolean;
  numero_docas: number;
  total_micro_agregadores: number;
  proxima_saida_prevista: Date | null;
  status: StatusHub;
  data_inauguracao: Date | null;
  created_at: Date;
  updated_at: Date;
  
  // Aliases/propriedades computadas para compatibilidade com UI
  // Estas são preenchidas pela função transformHub() em mockData.ts
  // São opcionais aqui, mas sempre presentes quando retornadas pela API
  name?: string;  // alias para nome
  location?: string;  // alias para endereco/localizacao (sempre disponível via transform)
  lat?: number;  // alias para latitude
  lng?: number;  // alias para longitude
  capacity?: number;  // percentual calculado de carga (sempre disponível via transform)
  cargo?: number;  // alias para carga_atual
  nextTruck?: string;  // alias formatado de proxima_saida_prevista
  products?: Array<{ name: string; quantity: number; unit: string }>;  // produtos formatados
  microAgents?: number;  // alias para total_micro_agregadores
}

/**
 * Frete
 */
export interface Frete {
  id: string;
  codigo: string;
  produtor_id: string;
  produtor?: Produtor;
  motorista_id: string | null;
  veiculo_id: string | null;
  lote_id: string | null;
  lote?: LoteProducao;
  tipo_frete: TipoFrete;
  hub_destino_id: string | null;
  hub?: Hub;
  produto: string;
  quantidade: number;
  origem_nome: string;
  origem_latitude: number | null;
  origem_longitude: number | null;
  destino_nome: string;
  destino_latitude: number | null;
  destino_longitude: number | null;
  distancia_km: number | null;
  duracao_estimada: number | null;
  rota_planejada: any | null;
  valor_frete: number;
  taxa_plataforma: number | null;
  data_solicitacao: Date;
  data_aceite: Date | null;
  data_coleta_prevista: Date | null;
  data_coleta_realizada: Date | null;
  data_entrega_prevista: Date | null;
  data_entrega_realizada: Date | null;
  status: StatusFrete;
  percentual_conclusao: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Transação (Blockchain)
 */
export interface Transacao {
  id: string;
  codigo: string;
  usuario_origem_id: string;
  usuario_destino_id: string;
  frete_id: string | null;
  frete?: Frete;
  tipo_transacao: TipoTransacao;
  valor_bruto: number;
  taxa_servico: number;
  metodo_pagamento: MetodoPagamento;
  hash_transacao: string;
  bloco_numero: number | null;
  confirmacoes: number;
  status: StatusTransacao;
  created_at: Date;
  data_processamento: Date | null;
  data_conclusao: Date | null;
  descricao: string | null;
  metadata_adicional: any | null;
}

/**
 * Notificação
 */
export interface Notificacao {
  id: string;
  usuario_id: string;
  titulo: string;
  mensagem: string;
  tipo: TipoNotificacao;
  categoria: CategoriaNotificacao;
  link_acao: string | null;
  entidade_relacionada_id: string | null;
  lida: boolean;
  data_leitura: Date | null;
  created_at: Date;
}

/**
 * Estatísticas de Comuna
 */
export interface EstatisticaComuna {
  id: string;
  nome_comuna: string;
  municipio: string;
  provincia: string;
  ano: number;
  safra: string | null;
  volume_total: number;
  mix_producao: any | null;
  numero_produtores: number;
  eficiencia_logistica: number;
  crescimento_ano_anterior: number;
  ndvi_medio: number | null;
  humidade_solo_media: number | null;
  hubs_associados: any | null;
  created_at: Date;
}

/**
 * Interface para filtros de contexto (legacy - mantida para compatibilidade)
 */
export interface FilterContext {
  province: string;         // Província selecionada
  municipality: string;     // Município selecionado
  commune: string;          // Comuna selecionada
  timeRange: string;        // Intervalo temporal (7d, 30d, 90d, 1y)
}

/**
 * Interface para estatísticas de KPI (Key Performance Indicators)
 */
export interface KPIStats {
  label: string;              // Nome do indicador
  value: string;             // Valor principal
  subValue: string;          // Valor secundário/comparativo
  trend: 'up' | 'down' | 'neutral';  // Tendência
  color: string;             // Cor temática (emerald, amber, blue, rose)
  icon: string;              // Nome do ícone a ser exibido
}

/**
 * Interface para dados de produção por região
 */
export interface ProductionData {
  name: string;              // Nome da região
  milho: number;            // Produção de milho (toneladas)
  mandioca: number;         // Produção de mandioca (toneladas)
  feijao: number;           // Produção de feijão (toneladas)
  soja: number;             // Produção de soja (toneladas)
}

/**
 * Interface para dados de fazenda/produtor
 */
export interface FarmData {
  id: string;
  name: string;
  location: string;
  province: string;
  totalArea: number;        // Área total em hectares
  cultivatedArea: number;   // Área cultivada
  mainCrops: string[];      // Principais culturas
  production: number;       // Produção total
  status: 'active' | 'inactive' | 'pending';
}

/**
 * Interface para hub de armazenamento (legacy - use interface Hub alinhada com Prisma)
 * @deprecated Use a interface Hub principal
 */
export interface HubLegacy {
  id: string;
  name: string;
  location: string;
  province: string;
  capacity: number;         // Capacidade em toneladas
  currentStock: number;     // Estoque atual
  status: 'operational' | 'maintenance' | 'closed';
  temperature?: number;     // Temperatura em °C
}

/**
 * Micro-Agregador (baseado no schema Prisma)
 */
export interface MicroAgregador {
  id: string;
  codigo: string;
  nome: string | null;
  motorista_id: string | null;
  hub_vinculado_id: string | null;
  hub?: Hub;
  modelo_veiculo: string | null;
  localizacao_atual: string | null;
  latitude: number | null;
  longitude: number | null;
  carga_atual: string | null;
  capacidade_maxima: number;
  status: string;
  bateria_percentual: number | null;
  velocidade_atual: number | null;
  eficiencia: string | null;
  ultima_sincronizacao: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Interface legada para micro-agregador (manter para compatibilidade)
 * @deprecated Use MicroAgregador do Prisma
 */
export interface MicroAgregadorLegacy {
  id: string;
  name: string;
  location: string;
  province: string;
  municipality: string;
  farmsConnected: number;   // Número de fazendas conectadas
  totalVolume: number;      // Volume total agregado
  rating: number;           // Avaliação (0-5)
}

/**
 * Interface para notificação
 */
export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Interface para dados de risco climático
 */
export interface ClimateRisk {
  region: string;
  province: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  prediction: string;
  probability: number;      // Probabilidade em percentual (0-100)
}

/**
 * Interface para dados de transporte/logística
 */
export interface LogisticsData {
  id: string;
  driver: string;
  route: string;
  origin: string;
  destination: string;
  cargo: string;
  weight: number;           // Peso em toneladas
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  eta: Date;                // Estimated Time of Arrival
  progress: number;         // Progresso em percentual (0-100)
}

/**
 * Interface para dados do marketplace (legacy - mape para LoteProducao)
 */
export interface MarketplaceLot {
  id: string;
  seller: string;
  product: string;
  quantity: number;         // Quantidade em toneladas
  pricePerTon: number;      // Preço por tonelada (Kz)
  location: string;
  province: string;
  quality: 'A' | 'B' | 'C';
  harvestDate: Date;
  available: boolean;
  images?: string[];
}

/**
 * Interface para usuário da empresa (legacy - mapeia para UsuarioEmpresa)
 */
export interface CompanyUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Gestor' | 'Auditor' | 'Visualizador';
  status: 'Ativo' | 'Inativo' | 'Pendente';
  permissions: AppTab[];
  lastLogin?: Date;
}

/**
 * Interface para empresa/organização (legacy - mapeia para Empresa)
 */
export interface Company {
  id: string;
  name: string;
  nif: string;  // Número de Identificação Fiscal
  type: 'Governamental' | 'Privada' | 'ONG' | 'Cooperativa';
  tier: 'Basic' | 'Professional' | 'Enterprise';
  permissions: AppTab[];      // Módulos disponíveis para a empresa
  maxUsers: number;           // Número máximo de usuários
  users: CompanyUser[];       // Usuários da empresa
  lastLogin: string;
}

/**
 * Interface para dados de previsão de IA
 */
export interface AIPrediction {
  region: string;
  province: string;
  crop: string;
  predictedYield: number;   // Rendimento previsto
  confidence: number;       // Confiança (0-100)
  factors: {
    climate: number;
    soil: number;
    historical: number;
  };
  recommendations: string[];
}

// ========================
// TIPOS PARA API
// ========================

/**
 * Resposta padrão da API
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    page?: number;
    perPage?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filtros para consultas
 */
export interface QueryFilters extends PaginationParams {
  search?: string;
  status?: string;
  provincia?: string;
  municipio?: string;
  comuna?: string;
  dataInicio?: string;
  dataFim?: string;
  [key: string]: any;
}

