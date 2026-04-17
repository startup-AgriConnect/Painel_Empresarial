import React, { useState } from 'react';
import { X, Truck, MapPin, DollarSign, Scale, Loader2, ArrowRight, Package, Info, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface ManageHubStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  hub: any;
  onDispatchSuccess: (hubId: string, tons: number) => void;
}

export default function ManageHubStockModal({ isOpen, onClose, hub, onDispatchSuccess }: ManageHubStockModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    toneladas: '',
    destino: '',
    preco: '',
    publicadoAte: '',
  });

  if (!hub) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Despacho acionado:', {
      hubId: hub.id,
      ...formData
    });

    onDispatchSuccess(hub.id, parseFloat(formData.toneladas));
    setLoading(false);
    onClose();
    setFormData({ toneladas: '', destino: '', preco: '', publicadoAte: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-900 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-800 rounded-xl">
                  <Truck className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Gerir Stock & Despacho</h3>
                  <p className="text-emerald-200 text-sm">{hub.name}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Hub Info Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Carga Disponível</p>
                  <p className="text-lg font-black text-emerald-900">{hub.stock}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Capacidade</p>
                  <p className="text-lg font-black text-emerald-900">{hub.capacity}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Detalhes do Despacho
                </h4>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700">Quantidade a Despachar (Toneladas) *</label>
                    <div className="relative">
                      <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        required
                        type="number"
                        step="0.1"
                        name="toneladas"
                        value={formData.toneladas}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        placeholder="Ex: 15.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700">Destino Final *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        required
                        name="destino"
                        value={formData.destino}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        placeholder="Ex: Porto de Luanda"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700">Preço do Transporte (AKZ) *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        required
                        type="number"
                        name="preco"
                        value={formData.preco}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        placeholder="Ex: 250000"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700">Cargas publicadas até (Data e Hora) *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        required
                        type="datetime-local"
                        name="publicadoAte"
                        value={formData.publicadoAte}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 italic">
                      Informa que as cargas a ser despachadas são as disponíveis até este horário.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Ao acionar o transporte, uma solicitação será enviada para a rede de transportadores pesados. O stock do Hub será reservado automaticamente.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 px-4 py-3 bg-emerald-600 text-white rounded-xl font-black text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-600/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      A Processar...
                    </>
                  ) : (
                    <>
                      Acionar Transporte
                      <ArrowRight className="w-4 h-4" />
                    </>
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
