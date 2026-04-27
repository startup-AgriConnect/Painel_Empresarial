import React, { useState } from 'react';
import { Truck, MapPin, DollarSign, Scale, Loader2, ArrowRight, Package, Info, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Truck className="w-5 h-5" />
            Gerir Stock & Despacho
          </DialogTitle>
          <DialogDescription>{hub.name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hub Info Summary */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg border border-border">
            <div>
              <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Carga Disponível</p>
              <p className="text-lg font-black text-foreground">{hub.stock}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Capacidade</p>
              <p className="text-lg font-black text-foreground">{hub.capacity}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4" />
              Detalhes do Despacho
            </h4>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="toneladas" className="font-semibold">Quantidade a Despachar (Toneladas) *</Label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="toneladas"
                    required
                    type="number"
                    step="0.1"
                    name="toneladas"
                    value={formData.toneladas}
                    onChange={handleChange}
                    className="pl-9"
                    placeholder="Ex: 15.5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="destino" className="font-semibold">Destino Final *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="destino"
                    required
                    name="destino"
                    value={formData.destino}
                    onChange={handleChange}
                    className="pl-9"
                    placeholder="Ex: Porto de Luanda"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="preco" className="font-semibold">Preço do Transporte (AKZ) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="preco"
                    required
                    type="number"
                    name="preco"
                    value={formData.preco}
                    onChange={handleChange}
                    className="pl-9"
                    placeholder="Ex: 250000"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="publicadoAte" className="font-semibold">Cargas publicadas até (Data e Hora) *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="publicadoAte"
                    required
                    type="datetime-local"
                    name="publicadoAte"
                    value={formData.publicadoAte}
                    onChange={handleChange}
                    className="pl-9 text-sm"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  Informa que as cargas a ser despachadas são as disponíveis até este horário.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-warning/10 rounded-lg border border-warning/20 flex gap-3">
            <Info className="w-5 h-5 text-warning shrink-0" />
            <p className="text-xs text-warning leading-relaxed">
              Ao acionar o transporte, uma solicitação será enviada para a rede de transportadores pesados. O stock do Hub será reservado automaticamente.
            </p>
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
                  A Processar...
                </>
              ) : (
                <>
                  Acionar Transporte
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
