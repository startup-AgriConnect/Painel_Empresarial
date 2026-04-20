import React, { useState } from 'react';
import { X, Truck, MapPin, DollarSign, Scale, Loader2, ArrowRight, Package, Info, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

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
              <Button 
                onClick={onClose}
                className="rounded-full p-2 hover:bg-white/10"
                size="icon"
                variant="ghost"
              >
                <X className="w-6 h-6" />
              </Button>
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
                    <Label className="font-bold">Quantidade a Despachar (Toneladas) *</Label>
                    <div className="relative">
                      <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        required
                        type="number"
                        step="0.1"
                        name="toneladas"
                        value={formData.toneladas}
                        onChange={handleChange}
                        className="h-12 pl-10 pr-4"
                        placeholder="Ex: 15.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="font-bold">Destino Final *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        required
                        name="destino"
                        value={formData.destino}
                        onChange={handleChange}
                        className="h-12 pl-10 pr-4"
                        placeholder="Ex: Porto de Luanda"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="font-bold">Preço do Transporte (AKZ) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        required
                        type="number"
                        name="preco"
                        value={formData.preco}
                        onChange={handleChange}
                        className="h-12 pl-10 pr-4"
                        placeholder="Ex: 250000"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="font-bold">Cargas publicadas até (Data e Hora) *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        required
                        type="datetime-local"
                        name="publicadoAte"
                        value={formData.publicadoAte}
                        onChange={handleChange}
                        className="h-12 pl-10 pr-4 text-sm"
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
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1"
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] gap-2"
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
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
