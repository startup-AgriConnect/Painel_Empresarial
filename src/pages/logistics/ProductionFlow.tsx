import React, { useState, useMemo } from "react";
import { FilterContext } from "../../types";
import { useFetch } from "../../services/hooks";
import { mockAPI } from "../../services/mockData";
import {
  ArrowRightLeft,
  TrendingUp,
  MapPin,
  Boxes,
  Truck,
  ArrowRight,
  PackageCheck,
  MoveUpRight,
  Coins,
  ShieldCheck,
  Link as LinkIcon,
  CheckCircle,
  Clock,
  X,
  Database,
  ShieldAlert,
  Download,
  Filter,
  CalendarDays,
  Tag,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

interface Transaction {
  id: string;
  farm: string;
  driver: string;
  status: string;
  type: "Recolha" | "Transporte" | "Pagamento";
  amount: string;
  time: string;
  hash: string;
  volume: string;
}

const ProductionFlow: React.FC<{ filters: FilterContext }> = ({ filters }) => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [localTimeRange, setLocalTimeRange] = useState<
    "mes" | "trimestre" | "safra"
  >("mes");
  const [txTypeFilter, setTxTypeFilter] = useState<
    "Todos" | "Recolha" | "Transporte" | "Pagamento"
  >("Todos");

  const { data: blockchainLedger, loading: loadingLedger } = useFetch(
    () => mockAPI.blockchain.getLedger(),
    [],
  );

  const { data: priceHistoryData, loading: loadingPrice } = useFetch(
    () => mockAPI.blockchain.getPriceHistory(),
    [],
  );

  const loading = loadingLedger || loadingPrice;

  const filteredLedger = useMemo(() => {
    if (!blockchainLedger) return [];
    return blockchainLedger.filter(
      (tx) => txTypeFilter === "Todos" || tx.type === txTypeFilter,
    );
  }, [blockchainLedger, txTypeFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-agriYellow animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Section: Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="p-3 bg-agriYellow/10 text-agriYellow rounded-2xl w-fit mb-6">
            <PackageCheck className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
            Escoamento Total
          </p>
          <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
            12.4k <span className="text-sm font-bold text-slate-400">Ton</span>
          </h3>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase">
            <MoveUpRight className="w-3 h-3" /> +12% vs Mês Ant.
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-2xl w-fit mb-6">
            <Truck className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
            Fretes Solicitados
          </p>
          <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
            842
          </h3>
          <div className="mt-4 flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase">
            <Clock className="w-3 h-3" /> Tempo Médio: 4.2h
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-2xl w-fit mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
            Transacionado Hoje
          </p>
          <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
            1.2M <span className="text-sm font-bold text-slate-400">AOA</span>
          </h3>
          <div className="mt-4 flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase">
            <LinkIcon className="w-3 h-3" /> Ledger Sincronizado
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[32px] shadow-2xl text-white border-b-4 border-agriYellow transition-colors">
          <p className="text-[10px] font-black text-agriYellow uppercase tracking-[0.2em] mb-1">
            Status Logístico
          </p>
          <h3 className="text-3xl font-black tracking-tighter">
            94.1% <span className="text-sm font-bold text-emerald-400">OK</span>
          </h3>
          <p className="text-[9px] text-slate-400 mt-4 font-bold uppercase leading-relaxed italic">
            "Fluxo otimizado via algoritmo de pareto. Hubs Malanje operando em
            plena capacidade."
          </p>
        </div>
      </div>

      {/* REFINEMENT FILTERS BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Temporalidade
            </label>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border dark:border-slate-700">
              {(["mes", "trimestre", "safra"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setLocalTimeRange(t)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${localTimeRange === t ? "bg-white dark:bg-slate-700 text-agriGreen dark:text-agriYellow shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {t === "mes"
                    ? "Mês Anterior"
                    : t === "trimestre"
                      ? "Trimestre"
                      : "Safra"}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-10 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Tipo de Transação
            </label>
            <div className="flex gap-2">
              {(["Todos", "Recolha", "Transporte", "Pagamento"] as const).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setTxTypeFilter(type)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${txTypeFilter === type ? "bg-agriYellow border-agriYellow text-slate-900 shadow-lg" : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-400 hover:border-agriYellow"}`}
                  >
                    {type}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Ledger Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Blockchain Transaction Ledger */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col shadow-sm transition-colors">
          <div className="p-8 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-agriYellow" /> Blockchain
              Transparency
            </h4>
            <span className="text-[9px] font-black bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-300 uppercase">
              {filteredLedger.length} TXs
            </span>
          </div>
          <div className="p-8 flex-grow space-y-6 overflow-y-auto custom-scrollbar h-[500px]">
            {filteredLedger.length > 0 ? (
              filteredLedger.map((tx, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedTx(tx)}
                  className="flex gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-3 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-grow space-y-1">
                    <div className="flex justify-between">
                      <p className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase">
                        {tx.id}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">
                        {tx.time}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium group-hover:text-agriYellow transition-colors">
                      {tx.farm} → {tx.driver}
                    </p>
                    <div className="flex justify-between items-center pt-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[8px] px-2 py-0.5 rounded font-black uppercase ${
                            tx.type === "Pagamento"
                              ? "bg-emerald-100 text-emerald-700"
                              : tx.type === "Recolha"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {tx.type}
                        </span>
                        <span className="text-[8px] text-slate-300 font-bold uppercase truncate max-w-[60px]">
                          {tx.status}
                        </span>
                      </div>
                      <span className="text-xs font-black text-agriYellow">
                        {tx.amount}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 italic text-xs">
                Nenhuma transação encontrada para este filtro.
              </div>
            )}
          </div>
          <button className="m-8 mt-0 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3">
            <LinkIcon className="w-4 h-4 text-agriYellow" /> Ver Explorador
            Ledger
          </button>
        </div>

        {/* Market Pricing (ML) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                <Coins className="w-5 h-5 text-agriYellow" /> Inteligência de
                Mercado
              </h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                Variação de Preços Médios (
                {localTimeRange === "mes"
                  ? "Mensal"
                  : localTimeRange === "trimestre"
                    ? "Trimestral"
                    : "Safra Completa"}
                )
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase">
                  Milho
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-agriYellow rounded-full"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase">
                  Mandioca
                </span>
              </div>
            </div>
          </div>

          <div className="h-[430px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistoryData || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#33415511"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 800, fill: "#64748b" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 800, fill: "#64748b" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)",
                    padding: "12px",
                    background: "#0f172a",
                  }}
                  itemStyle={{
                    fontWeight: 800,
                    color: "#fff",
                    fontSize: "10px",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{
                    paddingBottom: "30px",
                    fontSize: "10px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                  }}
                />
                <Line
                  name="Milho"
                  type="monotone"
                  dataKey="milho"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#10b981",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
                <Line
                  name="Mandioca"
                  type="monotone"
                  dataKey="mandioca"
                  stroke="#fbbf24"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#fbbf24",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
                <Line
                  name="Feijão"
                  type="monotone"
                  dataKey="feijao"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#3b82f6",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transaction Modal (Interactive Element) */}
      {selectedTx && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-900 text-white relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-agriYellow rounded-2xl flex items-center justify-center text-slate-900">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">
                    Certificado Digital
                  </h3>
                  <p className="text-[10px] text-agriYellow font-black uppercase tracking-widest">
                    {selectedTx.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Caminhão / Motorista
                  </p>
                  <p className="text-sm font-black dark:text-white">
                    {selectedTx.driver}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Volume de Carga
                  </p>
                  <p className="text-sm font-black dark:text-white">
                    {selectedTx.volume}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Fazenda Origem
                  </p>
                  <p className="text-sm font-black dark:text-white">
                    {selectedTx.farm}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Valor do Contrato
                  </p>
                  <p className="text-lg font-black text-agriYellow">
                    {selectedTx.amount}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-slate-400" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Hash do Contrato Inteligente
                  </p>
                </div>
                <p className="text-[11px] font-mono text-slate-500 break-all bg-white dark:bg-slate-900 p-3 rounded-xl border dark:border-slate-800">
                  {selectedTx.hash}
                </p>
                <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" /> Transação Imutável e
                  Verificada
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-grow py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                  <Download className="w-4 h-4" /> Exportar Comprovativo
                </button>
                <button className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-[11px] uppercase transition-all">
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionFlow;
