import React, { useState, useMemo } from "react";
import { FilterContext, LoteProducao } from "../../types";
import { useFetch } from "../../services/hooks";
import { mockAPI } from "../../services/mockData";
import { exportReport } from "../../utils/exportUtils";
import {
  ShoppingBag,
  Search,
  MapPin,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Package,
  Zap,
  Activity,
  X,
  CheckCircle2,
  Info,
  Calendar,
  Truck,
  Building2,
  DollarSign,
  Award,
  ArrowUpDown,
  ChevronDown,
  Heart,
  ShoppingCart,
  Scale,
  BadgeCheck,
  Download,
  Loader2,
} from "lucide-react";

const cropTypes = [
  "Todos",
  "Milho",
  "Mandioca",
  "Batata",
  "Feijão",
  "Soja",
  "Arroz",
  "Frutas",
];
const qualityLevels = ["Todos", "A+", "A", "B"];

type SortOption =
  | "price-asc"
  | "price-desc"
  | "date-newest"
  | "date-oldest"
  | "quality-best"
  | "quantity-desc";

const Marketplace: React.FC<{ filters: FilterContext }> = ({
  filters: _filters,
}) => {
  const [selectedLot, setSelectedLot] = useState<LoteProducao | null>(null);
  const [activeCrop, setActiveCrop] = useState("Todos");
  const [activeQuality, setActiveQuality] = useState("Todos");
  const [sortBy, setSortBy] = useState<SortOption>("date-newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [savedLots, setSavedLots] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<
    { id: string; quantity: number }[]
  >([]);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: lotesData, loading } = useFetch(() => mockAPI.lotes.list(), []);

  const mockLots: LoteProducao[] = useMemo(() => lotesData || [], [lotesData]);

  // Helper para extrair dados dos lotes
  const getLotProduct = (lot: LoteProducao) =>
    lot.nome_produto || lot.produto?.nome || "";
  const getLotQuantity = (lot: LoteProducao) =>
    `${lot.quantidade} ${lot.unidade}`;
  const getLotQuality = (lot: LoteProducao) => {
    const map: Record<string, string> = {
      A_PLUS: "A+",
      A: "A",
      B: "B",
      C: "C",
    };
    return map[lot.nivel_qualidade] || "B";
  };

  const filteredLots = useMemo(() => {
    const result = mockLots.filter((lot) => {
      const product = getLotProduct(lot);
      const matchesCrop =
        activeCrop === "Todos" ||
        product.toLowerCase().includes(activeCrop.toLowerCase());
      const matchesQuality =
        activeQuality === "Todos" || getLotQuality(lot) === activeQuality;
      const matchesSearch =
        product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCrop && matchesQuality && matchesSearch;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.preco_unitario - b.preco_unitario;
        case "price-desc":
          return b.preco_unitario - a.preco_unitario;
        case "date-newest":
          return (
            new Date(b.data_colheita).getTime() -
            new Date(a.data_colheita).getTime()
          );
        case "date-oldest":
          return (
            new Date(a.data_colheita).getTime() -
            new Date(b.data_colheita).getTime()
          );
        case "quality-best":
          return getLotQuality(b).localeCompare(getLotQuality(a));
        case "quantity-desc":
          return b.quantidade - a.quantidade;
        default:
          return 0;
      }
    });

    return result;
  }, [mockLots, activeCrop, activeQuality, sortBy, searchTerm]);

  const toggleSaveLot = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedLots((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const addToCart = (lotId: string, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === lotId);
      if (existing) {
        return prev.map((item) =>
          item.id === lotId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { id: lotId, quantity }];
    });
  };

  const removeFromCart = (lotId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== lotId));
  };

  const updateCartQuantity = (lotId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === lotId ? { ...item, quantity } : item)),
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const lot = mockLots.find((l) => l.id === item.id);
      return total + (lot ? lot.preco_unitario * item.quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const marketStats = useMemo(() => {
    const totalVol = filteredLots.reduce((acc, l) => acc + l.quantidade, 0);
    const avgPrice =
      filteredLots.length > 0
        ? filteredLots.reduce((acc, l) => acc + l.preco_unitario, 0) /
          filteredLots.length
        : 0;
    return { totalVol, avgPrice };
  }, [filteredLots]);

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case "price-asc":
        return "Menor Preço";
      case "price-desc":
        return "Maior Preço";
      case "date-newest":
        return "Mais Recente";
      case "date-oldest":
        return "Mais Antigo";
      case "quality-best":
        return "Qualidade Superior";
      case "quantity-desc":
        return "Maior Volume";
      default:
        return "Ordenar por";
    }
  };

  const handleExportProductReport = (lot: LoteProducao) => {
    const content = `
RELATÓRIO DE LOTE DE PRODUÇÃO

Informações do Produto:
• Produto: ${lot.nome_produto}
• Quantidade Disponível: ${lot.quantidade} ${lot.unidade}
• Preço Unitário: ${lot.preco_unitario.toLocaleString("pt-AO")} AOA/${lot.unidade}
• Valor Total: ${(lot.quantidade * lot.preco_unitario).toLocaleString("pt-AO")} AOA

Qualidade e Certificação:
• Nível de Qualidade: ${lot.nivel_qualidade}
• Certificação Orgânica: ${lot.certificacao_organica ? "Sim" : "Não"}

Informações de Origem:
• Fazenda Produtora: ${lot.fazenda?.nome || "N/A"}
• Local de Retirada: ${lot.local_retirada || "A combinar"}

Logística:
• Data de Colheita: ${lot.data_colheita}
• Período: ${lot.periodo_colheita || "N/A"}
• Frete Incluído: ${lot.frete_incluido ? "Sim" : "Não"}
• Tempo Estimado de Entrega: 2-5 dias úteis
• Condições de Armazenamento: Temperatura controlada

ANÁLISE DE QUALIDADE:
O lote apresenta nível de qualidade ${lot.nivel_qualidade}, atendendo aos padrões estabelecidos pelo Ministério da Agricultura. Produto ${lot.certificacao_organica ? "certificado organicamente" : "convencional"} e inspecionado, pronto para comercialização.

RECOMENDAÇÕES DE COMPRA:
1. Verificar capacidade de armazenamento antes da compra
2. Confirmar detalhes de entrega com a fazenda
3. Solicitar certificados de qualidade completos
4. Negociar condições de pagamento
`;

    const tables = [
      {
        headers: ["Item", "Especificação"],
        rows: [
          ["Produto", lot.nome_produto],
          ["Quantidade", `${lot.quantidade} ${lot.unidade}`],
          [
            "Preço Unitário",
            `${lot.preco_unitario.toLocaleString("pt-AO")} AOA`,
          ],
          ["Qualidade", lot.nivel_qualidade],
          ["Certificação Orgânica", lot.certificacao_organica ? "Sim" : "Não"],
          ["Fazenda", lot.fazenda?.nome || "N/A"],
          ["Local Retirada", lot.local_retirada || "A combinar"],
          ["Data Colheita", lot.data_colheita.toString()],
          ["Status", lot.status],
        ],
      },
    ];

    exportReport(
      "pdf",
      {
        title: `Relatório de Lote - ${lot.nome_produto}`,
        category: "Marketplace",
        province: _filters.province,
        municipality: _filters.municipality,
        commune: _filters.commune,
        additionalInfo: {
          "Código do Lote": lot.codigo,
          "ID do Lote": lot.id,
          "Fazenda Produtora": lot.fazenda?.nome || "N/A",
          "Valor Total do Lote": `${(lot.quantidade * lot.preco_unitario).toLocaleString("pt-AO")} AOA`,
          Status: lot.status,
          "Publicado em": lot.data_publicacao?.toString() || "N/A",
        },
      },
      content,
      tables,
    );
  };

  return (
    <div className="space-y-10 animate-fluid pb-32 relative">
      {/* SEÇÃO DE TÍTULO E BUSCA */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-agriYellow/20 rounded-2xl border border-agriYellow/30">
              <ShoppingBag className="w-6 h-6 text-agriYellow" />
            </div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
              Marketplace de Produção
            </h2>
          </div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
            <Activity className="w-4 h-4 text-emerald-500" /> Bolsa de
            Commodities Agrícolas • Angola 2025
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="relative flex-grow sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-agriYellow transition-colors" />
            <input
              type="text"
              placeholder="Pesquisar Produto, Fazenda ou ID do Lote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[30px] text-sm font-bold focus:ring-4 focus:ring-agriYellow/20 focus:border-agriYellow outline-none dark:text-white transition-all shadow-sm"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full sm:w-auto h-full bg-slate-950 dark:bg-slate-800 text-white px-8 py-5 rounded-[28px] shadow-xl hover:bg-agriYellow hover:text-slate-950 transition-all active:scale-95 flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-widest border border-white/5"
            >
              <ArrowUpDown className="w-4 h-4" /> {getSortLabel(sortBy)}{" "}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-4 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[35px] shadow-2xl z-[500] p-3 animate-in fade-in zoom-in-95 duration-200">
                {(
                  [
                    "date-newest",
                    "quality-best",
                    "price-asc",
                    "price-desc",
                    "quantity-desc",
                  ] as SortOption[]
                ).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${sortBy === option ? "bg-agriYellow text-slate-950 shadow-lg" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                  >
                    {getSortLabel(option)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BARRA DE ESTATÍSTICAS RÁPIDAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[35px] border border-slate-100 dark:border-slate-800 flex items-center gap-6 shadow-sm group">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Volume Disponível
            </p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white">
              {marketStats.totalVol.toLocaleString()}{" "}
              <span className="text-sm">Ton</span>
            </h4>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[35px] border border-slate-100 dark:border-slate-800 flex items-center gap-6 shadow-sm group">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Preço Médio / Ton
            </p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white">
              {Math.round(marketStats.avgPrice).toLocaleString()}{" "}
              <span className="text-sm">AOA</span>
            </h4>
          </div>
        </div>
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-gradient-to-br from-agriYellow to-yellow-600 p-6 rounded-[35px] text-slate-900 flex items-center gap-6 shadow-2xl relative overflow-hidden group hover:scale-105 transition-all cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-14 h-14 bg-slate-900 rounded-3xl flex items-center justify-center text-agriYellow group-hover:scale-110 transition-transform shadow-lg relative">
            <ShoppingCart className="w-7 h-7" />
            {getCartItemCount() > 0 && (
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-black animate-bounce shadow-lg">
                {getCartItemCount()}
              </div>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
              Carrinho de Compras
            </p>
            <h4 className="text-2xl font-black">
              {getCartItemCount()}{" "}
              <span className="text-sm font-bold opacity-60">Items</span>
            </h4>
          </div>
        </button>
      </div>

      {/* FILTROS DE CULTURA E QUALIDADE (STICKY) */}
      <div className="sticky top-0 z-40 space-y-4 py-4 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl -mx-8 px-8">
        <div className="bg-white dark:bg-slate-900 backdrop-blur-xl p-3 rounded-[35px] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-wrap items-center justify-center gap-2">
          {cropTypes.map((crop) => (
            <button
              key={crop}
              onClick={() => setActiveCrop(crop)}
              className={`px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCrop === crop ? "bg-agriYellow text-slate-950 shadow-lg scale-105 border-transparent" : "bg-transparent text-slate-500 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              {crop}
            </button>
          ))}
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />
          {qualityLevels.map((q) => (
            <button
              key={q}
              onClick={() => setActiveQuality(q)}
              className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeQuality === q ? "bg-emerald-500 text-white shadow-lg scale-105" : "bg-transparent text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"}`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DE LOTES APRIMORADO */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 transition-all duration-500 ${selectedLot ? "xl:pr-[480px]" : ""}`}
      >
        {filteredLots.length > 0 ? (
          filteredLots.map((lot) => (
            <div
              key={lot.id}
              onClick={() => setSelectedLot(lot)}
              className={`bg-white dark:bg-slate-900 p-10 rounded-[55px] border-2 transition-all cursor-pointer group relative overflow-hidden flex flex-col hover:-translate-y-3 ${selectedLot?.id === lot.id ? "border-agriYellow bg-agriYellow/5 ring-8 ring-agriYellow/5 shadow-2xl" : "border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl"}`}
            >
              {/* Badge Orgânico */}
              {lot.organic && (
                <div className="absolute top-10 left-10 z-10 bg-emerald-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                  <BadgeCheck size={10} /> Orgânico Cert.
                </div>
              )}

              {/* Botão de Salvar */}
              <button
                onClick={(e) => toggleSaveLot(e, lot.id)}
                className={`absolute top-10 right-10 z-10 p-4 rounded-2xl transition-all ${savedLots.includes(lot.id) ? "bg-rose-500 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 shadow-sm"}`}
              >
                <Heart
                  className={`w-5 h-5 ${savedLots.includes(lot.id) ? "fill-current" : ""}`}
                />
              </button>

              {/* Background Icon Decor */}
              <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
                <Package className="w-64 h-64" />
              </div>

              <div className="flex justify-center mb-10 pt-4">
                <div
                  className={`w-24 h-24 rounded-[40px] flex items-center justify-center text-5xl shadow-2xl transition-all duration-500 ${selectedLot?.id === lot.id ? "bg-agriYellow scale-110 rotate-6" : "bg-slate-50 dark:bg-slate-800 group-hover:scale-105"}`}
                >
                  {getLotProduct(lot).includes("Milho")
                    ? "🌽"
                    : getLotProduct(lot).includes("Mandioca")
                      ? "🥔"
                      : getLotProduct(lot).includes("Batata")
                        ? "🥔"
                        : getLotProduct(lot).includes("Soja")
                          ? "🫛"
                          : getLotProduct(lot).includes("Arroz")
                            ? "🌾"
                            : "🥭"}
                </div>
              </div>

              <div className="space-y-2 mb-10 text-center">
                <div className="flex justify-center gap-3 mb-2">
                  <div
                    className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${lot.status === "DISPONIVEL" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}
                  >
                    {lot.status}
                  </div>
                  <div className="bg-slate-900 text-white px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                    <Award
                      className={`w-3.5 h-3.5 ${getLotQuality(lot) === "A+" ? "text-agriYellow" : "text-slate-400"}`}
                    />
                    <span className="text-[10px] font-black">
                      {getLotQuality(lot)}
                    </span>
                  </div>
                </div>
                <h4 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none group-hover:text-agriYellow transition-colors">
                  {getLotProduct(lot)}
                </h4>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                  {lot.codigo}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 py-8 border-y border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 px-4 -mx-4">
                <div className="text-center border-r dark:border-slate-800">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Stock Disponível
                  </p>
                  <p className="text-2xl font-black text-slate-800 dark:text-white">
                    {getLotQuantity(lot)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Preço Unitário
                  </p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 uppercase leading-none">
                    {lot.preco_unitario.toLocaleString()} <br />{" "}
                    <span className="text-[9px] text-slate-400">
                      AOA / {lot.unidade}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-agriYellow" />
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                        {lot.local_retirada}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-tighter w-fit ${lot.frete_incluido ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}
                    >
                      <Truck size={12} />{" "}
                      {lot.frete_incluido
                        ? "Frete Incluído"
                        : "Recolha na Origem"}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLot(lot);
                    }}
                    className="h-16 w-16 bg-slate-950 text-white rounded-[24px] hover:bg-agriYellow hover:text-slate-950 shadow-xl transition-all group-hover:scale-110 flex items-center justify-center border border-white/5 active:scale-90"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(lot.id, 1);
                  }}
                  className="w-full bg-gradient-to-r from-agriYellow to-yellow-600 text-slate-900 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                >
                  <ShoppingCart className="w-4 h-4 group-hover:animate-bounce" />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          ))
        ) : loading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-agriYellow animate-spin" />
          </div>
        ) : (
          <div className="col-span-full py-40 text-center bg-white dark:bg-slate-900 rounded-[60px] border-4 border-dashed border-slate-100 dark:border-slate-800 shadow-inner">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-10">
              <Package className="w-12 h-12 text-slate-200 dark:text-slate-700" />
            </div>
            <h3 className="text-3xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">
              Nenhum lote compatível
            </h3>
            <p className="text-sm text-slate-400 mt-4 uppercase tracking-tighter font-medium max-w-md mx-auto">
              Tente redefinir os filtros geográficos ou de tipo de cultura para
              expandir os resultados da bolsa.
            </p>
          </div>
        )}
      </div>

      {/* PAINEL LATERAL DE DETALHES (FULL FEATURED DRAWER) */}
      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-[480px] bg-white dark:bg-slate-950 z-[2000] shadow-[-30px_0_80px_rgba(0,0,0,0.4)] transition-transform duration-700 border-l-4 border-agriYellow overflow-hidden flex flex-col ${selectedLot ? "translate-x-0" : "translate-x-full"}`}
      >
        {selectedLot && (
          <>
            <div className="p-12 bg-slate-900 text-white relative shrink-0">
              <button
                onClick={() => setSelectedLot(null)}
                className="absolute top-10 right-10 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/50 hover:text-white z-20"
              >
                <X className="w-7 h-7" />
              </button>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="w-6 h-6 text-agriYellow" />
                  <span className="text-[11px] font-black text-agriYellow uppercase tracking-[0.4em]">
                    Certificação Digital SIG v4.0
                  </span>
                </div>
                <h3 className="text-5xl font-black uppercase tracking-tighter leading-tight">
                  {getLotProduct(selectedLot)}
                </h3>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-agriYellow" />
                    <span className="text-xs font-black uppercase text-slate-300">
                      {selectedLot.codigo}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] font-black uppercase tracking-widest">
                    #{selectedLot.id}
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                <TrendingUp className="absolute -right-16 -bottom-16 w-80 h-80" />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar p-12 space-y-12 bg-slate-50/50 dark:bg-slate-950">
              {/* Resumo de Negociação */}
              <div className="p-10 bg-white dark:bg-slate-900 rounded-[50px] border-2 border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
                <DollarSign className="absolute -right-6 -top-6 w-32 h-32 text-emerald-500 opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Investimento Total Estimado
                </p>
                <h4 className="text-5xl font-black text-slate-950 dark:text-white tracking-tighter leading-none mb-10">
                  {(
                    selectedLot.quantidade * selectedLot.preco_unitario
                  ).toLocaleString()}{" "}
                  <span className="text-lg opacity-50">AOA</span>
                </h4>

                <div className="grid grid-cols-1 gap-4 border-t dark:border-slate-800 pt-8 mt-8">
                  <div className="flex items-center gap-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    <TrendingUp className="w-4 h-4" /> Preço 4.2% abaixo da
                    média de Malanje
                  </div>
                  <div
                    className={`flex items-center gap-4 p-5 rounded-[30px] border-2 ${selectedLot.frete_incluido ? "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-amber-50 border-amber-100 dark:bg-emerald-950/20 dark:border-emerald-900/30 text-amber-700 dark:text-amber-400"}`}
                  >
                    <div
                      className={`p-3 rounded-2xl ${selectedLot.frete_incluido ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"} shadow-lg`}
                    >
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[12px] font-black uppercase leading-tight">
                        {selectedLot.frete_incluido
                          ? "Entrega Centralizada AgriConnect"
                          : "Recolha Necessária (FOB)"}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-70">
                        {selectedLot.freightIncluded
                          ? "Frete incluso até ao seu HUB de eleição."
                          : "O comprador deve providenciar transporte próprio ou contratar via AgriConnect."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Especificações Técnicas */}
              <div className="space-y-8">
                <h5 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] border-b-2 dark:border-slate-800 pb-4 flex items-center gap-4">
                  <Info className="w-6 h-6 text-agriYellow" /> Ficha Técnica do
                  Lote
                </h5>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      label: "Colheita",
                      val: new Date(
                        selectedLot.data_colheita,
                      ).toLocaleDateString(),
                      icon: Calendar,
                      color: "text-blue-500",
                    },
                    {
                      label: "Rating Qualidade",
                      val: getLotQuality(selectedLot),
                      icon: Award,
                      color: "text-agriYellow",
                    },
                    {
                      label: "Localidade Origem",
                      val: selectedLot.local_retirada,
                      icon: MapPin,
                      color: "text-rose-500",
                    },
                    {
                      label: "Volume Líquido",
                      val: getLotQuantity(selectedLot),
                      icon: Scale,
                      color: "text-emerald-500",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
                    >
                      <div
                        className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 w-fit mb-6 group-hover:scale-110 transition-transform ${item.color}`}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                        {item.label}
                      </p>
                      <p className="text-base font-black text-slate-800 dark:text-white uppercase leading-tight">
                        {item.val}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Painel IA de Análise Global */}
              <div className="p-10 bg-slate-950 text-white rounded-[55px] border-4 border-agriYellow shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-6 transition-transform duration-1000">
                  <Zap className="w-64 h-64 text-agriYellow" />
                </div>
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-agriYellow rounded-[24px] flex items-center justify-center text-slate-950 shadow-[0_0_40px_rgba(251,191,36,0.3)] group-hover:scale-110 transition-transform">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div>
                      <h5 className="text-xl font-black uppercase tracking-tighter">
                        Parecer do Estrategista{" "}
                        <span className="text-agriYellow">IA</span>
                      </h5>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">
                        Análise Deep Learning: Malanje Core
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-medium leading-relaxed italic text-slate-300">
                    "{selectedLot.parecer_ia || "Lote de qualidade certificada"}
                    "
                  </p>
                  <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-black uppercase"
                        >
                          GA
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                      Lote verificado por 3 auditores SIG
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AÇÕES DE TRANSAÇÃO (FIXO) */}
            <div className="p-12 border-t-2 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-6 shrink-0 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
              {/* Selector de Quantidade */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Quantidade a Adquirir
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setSelectedQuantity(Math.max(1, selectedQuantity - 1))
                    }
                    className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedLot.quantidade}
                    value={selectedQuantity}
                    onChange={(e) =>
                      setSelectedQuantity(
                        Math.min(
                          selectedLot.quantidade,
                          Math.max(1, parseInt(e.target.value) || 1),
                        ),
                      )
                    }
                    className="flex-grow text-center py-4 px-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-2xl font-black text-slate-900 dark:text-white outline-none focus:border-agriYellow"
                  />
                  <button
                    onClick={() =>
                      setSelectedQuantity(
                        Math.min(selectedLot.quantidade, selectedQuantity + 1),
                      )
                    }
                    className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90"
                  >
                    +
                  </button>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Min: 1 {selectedLot.unidade}</span>
                  <span>
                    Máx: {selectedLot.quantidade} {selectedLot.unidade}
                  </span>
                </div>
                <div className="p-4 bg-agriYellow/10 border border-agriYellow/30 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                      Total a Pagar
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {(
                        selectedLot.preco_unitario * selectedQuantity
                      ).toLocaleString()}{" "}
                      <span className="text-sm text-slate-500">AOA</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(selectedLot.id, selectedQuantity);
                  setSelectedQuantity(1);
                  setIsCartOpen(true);
                }}
                className="w-full bg-gradient-to-r from-agriYellow to-yellow-600 text-slate-900 py-7 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
              >
                <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />{" "}
                Adicionar ao Carrinho
              </button>
              <button
                onClick={() => {
                  addToCart(selectedLot.id, selectedQuantity);
                  setSelectedQuantity(1);
                  // Aqui seria redirecionado para checkout
                }}
                className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-7 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group border border-white/5"
              >
                <CheckCircle2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />{" "}
                Comprar Agora
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button className="py-5 border-2 border-slate-100 dark:border-slate-800 text-slate-400 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:border-agriYellow hover:text-agriYellow transition-all flex items-center justify-center gap-2">
                  <Building2 size={16} /> Contactar Fazenda
                </button>
                <button
                  onClick={() =>
                    selectedLot && handleExportProductReport(selectedLot)
                  }
                  className="py-5 border-2 border-slate-100 dark:border-slate-800 text-slate-400 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Baixar Relatório
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* PAINEL LATERAL DO CARRINHO */}
      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-[500px] bg-white dark:bg-slate-950 z-[2100] shadow-[-30px_0_80px_rgba(0,0,0,0.4)] transition-transform duration-700 border-l-4 border-emerald-500 overflow-hidden flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-12 bg-gradient-to-br from-emerald-600 to-green-700 text-white relative shrink-0">
          <button
            onClick={() => setIsCartOpen(false)}
            className="absolute top-10 right-10 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/50 hover:text-white z-20"
          >
            <X className="w-7 h-7" />
          </button>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-tight">
                  Carrinho
                </h3>
                <p className="text-[11px] font-black text-emerald-200 uppercase tracking-widest">
                  {getCartItemCount()} Items • {cartItems.length} Lotes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950">
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const lot = mockLots.find((l) => l.id === item.id);
              if (!lot) return null;

              return (
                <div
                  key={item.id}
                  className="p-6 bg-white dark:bg-slate-900 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-lg space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-grow">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                        {getLotProduct(lot).includes("Milho")
                          ? "🌽"
                          : getLotProduct(lot).includes("Mandioca")
                            ? "🥔"
                            : getLotProduct(lot).includes("Batata")
                              ? "🥔"
                              : "🥭"}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                          {getLotProduct(lot)}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {lot.codigo}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="w-10 h-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-black hover:scale-110 transition-all active:scale-90"
                      >
                        -
                      </button>
                      <span className="text-xl font-black text-slate-900 dark:text-white w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.id,
                            Math.min(lot.quantidade, item.quantity + 1),
                          )
                        }
                        className="w-10 h-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-black hover:scale-110 transition-all active:scale-90"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Subtotal
                      </p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">
                        {(lot.preco_unitario * item.quantity).toLocaleString()}{" "}
                        <span className="text-xs text-slate-400">AOA</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              </div>
              <h4 className="text-2xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest mb-2">
                Carrinho Vazio
              </h4>
              <p className="text-sm text-slate-400 uppercase tracking-tight">
                Adicione produtos para continuar
              </p>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-10 border-t-2 border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-950 space-y-6 shrink-0 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-wider">
                  Subtotal
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {getCartTotal().toLocaleString()} AOA
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-wider">
                  Frete Estimado
                </span>
                <span className="text-lg font-black text-emerald-600">
                  Incluído
                </span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                  Total
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {getCartTotal().toLocaleString()}{" "}
                  <span className="text-sm text-slate-500">AOA</span>
                </span>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-emerald-600 to-green-700 text-white py-7 rounded-[28px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group">
              <CheckCircle2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Finalizar Compra ({cartItems.length} Lotes)
            </button>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full py-5 border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-[24px] font-black text-xs uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-500 transition-all"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
