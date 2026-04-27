import React, { useState } from 'react';
import { AlertCircle, Calendar, DollarSign, Hash, Leaf, MapPin, Package, ShieldCheck, Truck } from 'lucide-react';
import FeedbackBanner from '../Common/FeedbackBanner';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';

interface CreateLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newLot: any) => void;
}

export default function CreateLotModal({ isOpen, onClose, onSuccess }: CreateLotModalProps) {
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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onSuccess({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      created_at: new Date().toISOString(),
    });
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Lote de Produção</DialogTitle>
          <DialogDescription>Publique um novo lote no marketplace da AgriConnect.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <FeedbackBanner
              type="error"
              title="Lote incompleto"
              message={error}
              onDismiss={() => setError('')}
            />
          )}

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Package className="h-4 w-4" />
              Informações do Produto
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lot-codigo">Código do Lote</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="lot-codigo" required value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value })} placeholder="Ex: LOT-2026-001" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lot-produto">Nome do Produto</Label>
                <Input id="lot-produto" required value={formData.nome_produto} onChange={(e) => setFormData({ ...formData, nome_produto: e.target.value })} placeholder="Ex: Milho Branco" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lot-quantidade">Quantidade</Label>
                <Input id="lot-quantidade" required type="number" step="0.01" value={formData.quantidade} onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })} placeholder="Ex: 50.5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lot-unidade">Unidade</Label>
                <Select id="lot-unidade" value={formData.unidade} onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}>
                  <option value="Ton">Toneladas (Ton)</option>
                  <option value="Kg">Quilogramas (Kg)</option>
                  <option value="Sacos">Sacos</option>
                  <option value="Caixas">Caixas</option>
                </Select>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              Qualidade e Colheita
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lot-qualidade">Nível de Qualidade</Label>
                <Select id="lot-qualidade" value={formData.nivel_qualidade} onChange={(e) => setFormData({ ...formData, nivel_qualidade: e.target.value })}>
                  <option value="A_PLUS">A+ (Premium)</option>
                  <option value="A">A (Excelente)</option>
                  <option value="B">B (Padrão)</option>
                  <option value="C">C (Industrial)</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lot-data">Data de Colheita</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="lot-data" required type="date" value={formData.data_colheita} onChange={(e) => setFormData({ ...formData, data_colheita: e.target.value })} className="pl-10" />
                </div>
              </div>
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
              <Checkbox checked={formData.certificacao_organica} onChange={(e) => setFormData({ ...formData, certificacao_organica: e.target.checked })} />
              <Leaf className="h-4 w-4 text-primary" />
              Certificação Orgânica
            </label>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Condições Comerciais
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lot-preco">Preço Unitário (Kz)</Label>
                <Input id="lot-preco" required type="number" value={formData.preco_unitario} onChange={(e) => setFormData({ ...formData, preco_unitario: e.target.value })} placeholder="Ex: 5000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lot-local">Local de Retirada</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="lot-local" value={formData.local_retirada} onChange={(e) => setFormData({ ...formData, local_retirada: e.target.value })} placeholder="Ex: Fazenda Girassol, Huambo" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lot-destaque">Destaque</Label>
                <Select id="lot-destaque" value={formData.destaque} onChange={(e) => setFormData({ ...formData, destaque: e.target.value })}>
                  <option value="ECONOMICO">Económico</option>
                  <option value="PREMIUM">Premium</option>
                  <option value="OFERTA">Oferta Especial</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lot-status">Status</Label>
                <Select id="lot-status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="RESERVADO">Reservado</option>
                  <option value="VENDIDO">Vendido</option>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
                <Checkbox checked={formData.frete_incluido} onChange={(e) => setFormData({ ...formData, frete_incluido: e.target.checked })} />
                <Truck className="h-4 w-4 text-sky-600" />
                Frete Incluído
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
                <Checkbox checked={formData.urgente} onChange={(e) => setFormData({ ...formData, urgente: e.target.checked })} />
                <AlertCircle className="h-4 w-4 text-rose-600" />
                Pedido Urgente
              </label>
            </div>
          </section>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : null}
              {loading ? 'A publicar...' : 'Publicar Lote'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
