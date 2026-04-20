import React, { useState } from 'react';
import { X, Package, MapPin, Calendar, Truck, Loader2, DollarSign, Warehouse, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';

interface CreateFreightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newFreight: any) => void;
  hubs: { id: string, name: string }[];
}

export default function CreateFreightModal({ isOpen, onClose, onSuccess, hubs }: CreateFreightModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    produto: '',
    quantidade: '',
    origem_nome: '',
    destino_nome: '',
    tipo_frete: 'DIRETO',
    hub_destino_id: '',
    valor_frete: '',
    data_coleta_prevista: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const selectedHub = hubs.find(h => h.id === formData.hub_destino_id);

    const newFreight = {
      id: Math.random().toString(36).substr(2, 9),
      codigo: formData.codigo || `FR-${Math.floor(1000 + Math.random() * 9000)}`,
      produto: formData.produto,
      quantidade: formData.quantidade,
      origem_nome: formData.origem_nome,
      destino_nome: formData.destino_nome,
      tipo_frete: formData.tipo_frete,
      hub_destino_name: selectedHub?.name || 'N/A',
      valor_frete: formData.valor_frete,
      data_coleta_prevista: formData.data_coleta_prevista,
      status: 'PENDENTE',
      percentual_conclusao: 0,
    };

    onSuccess(newFreight);
    setLoading(false);
    onClose();
    setFormData({
      codigo: '',
      produto: '',
      quantidade: '',
      origem_nome: '',
      destino_nome: '',
      tipo_frete: 'DIRETO',
      hub_destino_id: '',
      valor_frete: '',
      data_coleta_prevista: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-600 text-white">
              <div>
                <h3 className="text-xl font-bold">Nova Solicitação de Frete</h3>
                <p className="text-emerald-100 text-sm">Registe uma nova carga no sistema AgriConnect.</p>
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

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Detalhes da Carga
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Produto *</Label>
                    <Input
                      required
                      name="produto"
                      value={formData.produto}
                      onChange={handleChange}
                      placeholder="Ex: Milho Branco"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Quantidade (Ton) *</Label>
                    <Input
                      required
                      type="number"
                      step="0.01"
                      name="quantidade"
                      value={formData.quantidade}
                      onChange={handleChange}
                      placeholder="Ex: 15.5"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Rota e Logística
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Origem *</Label>
                    <Input
                      required
                      name="origem_nome"
                      value={formData.origem_nome}
                      onChange={handleChange}
                      placeholder="Cidade, Província"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Destino *</Label>
                    <Input
                      required
                      name="destino_nome"
                      value={formData.destino_nome}
                      onChange={handleChange}
                      placeholder="Cidade, Província"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Tipo de Frete *</Label>
                    <Select
                      required
                      name="tipo_frete"
                      value={formData.tipo_frete}
                      onChange={handleChange}
                    >
                      <option value="DIRETO">Direto (Ponto a Ponto)</option>
                      <option value="VIA_HUB">Via Hub (Consolidação)</option>
                      <option value="MARKETPLACE">Marketplace</option>
                    </Select>
                  </div>
                  {formData.tipo_frete === 'VIA_HUB' && (
                    <div className="space-y-1">
                      <Label>Hub de Destino *</Label>
                      <Select
                        required
                        name="hub_destino_id"
                        value={formData.hub_destino_id}
                        onChange={handleChange}
                      >
                        <option value="">Selecione um Hub</option>
                        {hubs.map(hub => (
                          <option key={hub.id} value={hub.id}>{hub.name}</option>
                        ))}
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Valores e Datas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Valor do Frete (Kz) *</Label>
                    <Input
                      required
                      type="number"
                      name="valor_frete"
                      value={formData.valor_frete}
                      onChange={handleChange}
                      placeholder="Ex: 150000"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Data de Coleta Prevista *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        required
                        type="date"
                        name="data_coleta_prevista"
                        value={formData.data_coleta_prevista}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex gap-3">
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
                  className="flex-1 gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      A publicar...
                    </>
                  ) : (
                    'Publicar Frete'
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
