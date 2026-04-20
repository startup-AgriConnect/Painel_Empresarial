import React, { useState } from 'react';
import { X, Package, Hash, User, MapPin, Calendar, DollarSign, ShieldCheck, Zap, AlertCircle, Loader2, Leaf, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FeedbackBanner from '../Common/FeedbackBanner';
import { useAccessibleModal } from '../../hooks/useAccessibleModal';

interface CreateLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newLot: any) => void;
}

export default function CreateLotModal({ isOpen, onClose, onSuccess }: CreateLotModalProps) {
  const modalRef = useAccessibleModal(isOpen, onClose);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    codigo: '',
    nome_produto: '',
    quantidade: '',
    unidade: 'Ton',
    nivel_qualidade: 'B',
    certificacao_organica: false,
    data_colheita: '',
    preco_unitario: '',
    frete_incluido: false,
    local_retirada: '',
    destaque: 'ECONOMICO',
    urgente: false,
    status: 'DISPONIVEL',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (Number(formData.quantidade) <= 0) {
      setError('A quantidade deve ser superior a zero.');
      return;
    }

    if (Number(formData.preco_unitario) <= 0) {
      setError('O preço unitário deve ser superior a zero.');
      return;
    }

    if (!formData.local_retirada.trim()) {
      setError('Informe o local de retirada para orientar a logística do comprador.');
      return;
    }

    setLoading(true);
    
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newLot = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      created_at: new Date().toISOString(),
    };

    onSuccess(newLot);
    setLoading(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-900 text-white">
              <div>
                <h3 className="text-xl font-bold">Novo Lote de Produção</h3>
                <p className="text-emerald-100 text-sm">Publique um novo lote no marketplace da AgriConnect.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              {error && (
                <FeedbackBanner
                  type="error"
                  title="Lote incompleto"
                  message={error}
                  onDismiss={() => setError('')}
                />
              )}

              {/* Seção: Produto e Quantidade */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Informações do Produto
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Código do Lote *</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        required
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        placeholder="Ex: LOT-2026-001"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Nome do Produto *</label>
                    <input
                      required
                      name="nome_produto"
                      value={formData.nome_produto}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Ex: Milho Branco"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Quantidade *</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      name="quantidade"
                      value={formData.quantidade}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Ex: 50.5"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Unidade</label>
                    <select
                      name="unidade"
                      value={formData.unidade}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white"
                    >
                      <option value="Ton">Toneladas (Ton)</option>
                      <option value="Kg">Quilogramas (Kg)</option>
                      <option value="Sacos">Sacos</option>
                      <option value="Caixas">Caixas</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Seção: Qualidade e Datas */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Qualidade e Colheita
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Nível de Qualidade</label>
                    <select
                      name="nivel_qualidade"
                      value={formData.nivel_qualidade}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white"
                    >
                      <option value="A_PLUS">A+ (Premium)</option>
                      <option value="A">A (Excelente)</option>
                      <option value="B">B (Padrão)</option>
                      <option value="C">C (Industrial)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Data de Colheita *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        required
                        type="date"
                        name="data_colheita"
                        value={formData.data_colheita}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        name="certificacao_organica"
                        checked={formData.certificacao_organica}
                        onChange={handleChange}
                        className="w-5 h-5 border-2 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                      <span className="text-sm font-medium text-gray-700">Certificação Orgânica</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Seção: Comercial */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Condições Comerciais
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Preço Unitário (Kz) *</label>
                    <input
                      required
                      type="number"
                      name="preco_unitario"
                      value={formData.preco_unitario}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Ex: 5000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Local de Retirada</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="local_retirada"
                        value={formData.local_retirada}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        placeholder="Ex: Fazenda Girassol, Huambo"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Destaque</label>
                    <select
                      name="destaque"
                      value={formData.destaque}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white"
                    >
                      <option value="ECONOMICO">Económico</option>
                      <option value="PREMIUM">Premium</option>
                      <option value="OFERTA">Oferta Especial</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white"
                    >
                      <option value="DISPONIVEL">Disponível</option>
                      <option value="RESERVADO">Reservado</option>
                      <option value="VENDIDO">Vendido</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        name="frete_incluido"
                        checked={formData.frete_incluido}
                        onChange={handleChange}
                        className="w-5 h-5 border-2 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm font-medium text-gray-700">Frete Incluído</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        name="urgente"
                        checked={formData.urgente}
                        onChange={handleChange}
                        className="w-5 h-5 border-2 border-gray-300 rounded text-rose-600 focus:ring-rose-500 transition-all cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-400 group-hover:text-rose-500 transition-colors" />
                      <span className="text-sm font-medium text-gray-700">Pedido Urgente</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      A publicar...
                    </>
                  ) : (
                    'Publicar Lote'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
