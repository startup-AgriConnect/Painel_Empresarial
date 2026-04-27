import React, { useState } from 'react';
import { Package, MapPin, Calendar, Loader2, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Frete</DialogTitle>
          <DialogDescription>Registe uma nova carga no sistema AgriConnect.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4" />
              Detalhes da Carga
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="produto">Produto *</Label>
                <Input
                  id="produto"
                  required
                  name="produto"
                  value={formData.produto}
                  onChange={handleChange}
                  placeholder="Ex: Milho Branco"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="quantidade">Quantidade (Ton) *</Label>
                <Input
                  id="quantidade"
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

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Rota e Logística
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="origem_nome">Origem *</Label>
                <Input
                  id="origem_nome"
                  required
                  name="origem_nome"
                  value={formData.origem_nome}
                  onChange={handleChange}
                  placeholder="Cidade, Província"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="destino_nome">Destino *</Label>
                <Input
                  id="destino_nome"
                  required
                  name="destino_nome"
                  value={formData.destino_nome}
                  onChange={handleChange}
                  placeholder="Cidade, Província"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="tipo_frete">Tipo de Frete *</Label>
                <Select
                  id="tipo_frete"
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
                  <Label htmlFor="hub_destino_id">Hub de Destino *</Label>
                  <Select
                    id="hub_destino_id"
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

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Valores e Datas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="valor_frete">Valor do Frete (Kz) *</Label>
                <Input
                  id="valor_frete"
                  required
                  type="number"
                  name="valor_frete"
                  value={formData.valor_frete}
                  onChange={handleChange}
                  placeholder="Ex: 150000"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="data_coleta_prevista">Data de Coleta Prevista *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="data_coleta_prevista"
                    required
                    type="date"
                    name="data_coleta_prevista"
                    value={formData.data_coleta_prevista}
                    onChange={handleChange}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="gap-2"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
