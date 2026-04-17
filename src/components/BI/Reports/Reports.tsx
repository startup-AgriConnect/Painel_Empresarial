import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight, 
  FileSpreadsheet, 
  FileJson,
  File as FileIcon,
  Clock,
  CheckCircle2,
  MoreVertical,
  Share2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion } from 'motion/react';

import ReportBuilder from './ReportBuilder';

const reportTemplates = [
  { id: 1, title: 'Relatório de Produção Nacional', description: 'Consolidado mensal de volumes por província e cultura.', format: 'PDF/XLS' },
  { id: 2, title: 'Análise de Preços de Mercado', description: 'Variação semanal de preços nos principais mercados.', format: 'PDF/CSV' },
  { id: 3, title: 'Censo de Produtores', description: 'Dados demográficos e geográficos da rede produtiva.', format: 'XLS/JSON' },
  { id: 4, title: 'Relatório de Geointeligência', description: 'Análise de NDVI e humidade do solo por região.', format: 'PDF' },
];

const generatedReports = [
  { id: 'REP-001', title: 'Produção_Huambo_Março_2026.pdf', date: '2026-04-10 14:30', size: '2.4 MB', status: 'READY' },
  { id: 'REP-002', title: 'Precos_Mercado_Semana_14.xlsx', date: '2026-04-09 09:15', size: '1.1 MB', status: 'READY' },
  { id: 'REP-003', title: 'Analise_Risco_Cooperativas.pdf', date: '2026-04-08 16:45', size: '3.8 MB', status: 'READY' },
  { id: 'REP-004', title: 'Censo_Nacional_Completo.json', date: '2026-04-05 11:20', size: '12.5 MB', status: 'READY' },
];

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'builder'>('list');

  if (view === 'builder') {
    return <ReportBuilder onBack={() => setView('list')} />;
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Centro de Relatórios</h2>
        <p className="text-gray-500 text-sm font-medium">Gere e exporte relatórios detalhados para suporte à tomada de decisão.</p>
      </header>

      {/* Report Templates Grid */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            Modelos Disponíveis
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportTemplates.map((template) => (
            <motion.div 
              key={template.id}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-gray-900 mb-2">{template.title}</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{template.format}</span>
                <button className="p-2 bg-gray-50 text-gray-400 hover:bg-emerald-600 hover:text-white rounded-xl transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Generated Reports Table */}
      <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Relatórios Gerados Recentemente</h3>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Pesquisar relatórios..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-emerald-600 rounded-xl transition-all shadow-sm">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome do Ficheiro</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Data de Geração</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tamanho</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {generatedReports.map((report) => (
                <tr key={report.id} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-white transition-colors">
                        {report.title.endsWith('.pdf') ? <FileIcon className="w-5 h-5 text-rose-500" /> : 
                         report.title.endsWith('.xlsx') ? <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> :
                         <FileJson className="w-5 h-5 text-amber-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{report.title}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{report.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {report.date}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-black text-gray-700">{report.size}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <CheckCircle2 className="w-3 h-3" />
                      {report.status}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:bg-white hover:text-emerald-600 rounded-xl transition-all shadow-sm">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-white hover:text-blue-600 rounded-xl transition-all shadow-sm">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-white hover:text-rose-600 rounded-xl transition-all shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs font-bold text-gray-400">A mostrar 4 de 24 relatórios gerados</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all">Anterior</button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-gray-900 uppercase tracking-widest hover:bg-gray-50 transition-all">Próximo</button>
          </div>
        </div>
      </section>

      {/* Custom Report Builder CTA */}
      <div className="bg-[#042f1a] p-10 rounded-[4rem] text-white relative overflow-hidden shadow-2xl shadow-emerald-950/20">
        <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-3xl font-black mb-4">Precisa de um relatório personalizado?</h3>
            <p className="text-emerald-100 font-medium leading-relaxed">
              Utilize o nosso motor de BI para cruzar quaisquer dados da plataforma e gerar visualizações específicas para as suas necessidades de negócio.
            </p>
          </div>
          <button 
            onClick={() => setView('builder')}
            className="px-8 py-4 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/40 flex items-center gap-3 shrink-0"
          >
            Abrir Construtor BI
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
