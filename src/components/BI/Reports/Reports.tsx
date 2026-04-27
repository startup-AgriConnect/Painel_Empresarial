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
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

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
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Centro de Relatórios</h2>
          <p className="text-sm text-muted-foreground">Gere e exporte relatórios detalhados para suporte à tomada de decisão.</p>
        </div>
        <Button onClick={() => setView('builder')} size="sm">
          <ExternalLink className="w-4 h-4" /> Construtor BI
        </Button>
      </header>

      {/* Report Templates Grid */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            Modelos Disponíveis
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTemplates.map((template) => (
            <Card key={template.id} className="py-0 transition-all hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex size-10 items-center justify-center rounded-md bg-muted mb-4">
                  <FileText className="w-5 h-5 text-foreground" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1.5">{template.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-5">{template.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{template.format}</Badge>
                  <Button size="icon" variant="ghost" className="size-8">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Generated Reports Table */}
      <Card className="py-0">
        <CardContent className="p-0">
          <div className="p-5 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                <Clock className="w-4 h-4 text-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground tracking-tight">Relatórios Gerados Recentemente</h3>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Pesquisar relatórios..."
                  className="w-full h-9 pl-9 pr-3 bg-background border border-input rounded-md text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Nome do Ficheiro</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Data de Geração</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Tamanho</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Estado</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {generatedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-accent transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                          {report.title.endsWith('.pdf') ? <FileIcon className="w-4 h-4 text-destructive" /> :
                           report.title.endsWith('.xlsx') ? <FileSpreadsheet className="w-4 h-4 text-success" /> :
                           <FileJson className="w-4 h-4 text-warning" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{report.title}</p>
                          <p className="text-xs text-muted-foreground">{report.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {report.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-foreground">{report.size}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">
                        <CheckCircle2 className="w-3 h-3" />
                        {report.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="size-8">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-8">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-5 border-t border-border flex justify-between items-center">
            <p className="text-xs text-muted-foreground">A mostrar 4 de 24 relatórios gerados</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Anterior</Button>
              <Button variant="outline" size="sm">Próximo</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Report Builder CTA */}
      <Card className="py-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="max-w-xl">
              <h3 className="text-lg font-semibold text-foreground mb-1.5">Precisa de um relatório personalizado?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Utilize o nosso motor de BI para cruzar quaisquer dados da plataforma e gerar visualizações específicas para as suas necessidades de negócio.
              </p>
            </div>
            <Button onClick={() => setView('builder')} className="shrink-0">
              Abrir Construtor BI
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
