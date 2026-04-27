import React, { useState } from 'react';
import { Warehouse, MapPin, Info, Clock, Scale, Snowflake, Truck, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface CreateHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newHub: any) => void;
  initialData?: any;
}

export default function CreateHubModal({ isOpen, onClose, onSuccess, initialData }: CreateHubModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData ? {
    codigo: initialData.codigo,
    nome: initialData.name,
    descricao: initialData.descricao || '',
    localizacao_id: initialData.location,
    endereco: initialData.endereco || '',
    latitude: initialData.latitude || '',
    longitude: initialData.longitude || '',
    capacidade_total: initialData.capacidade_total || '',
    horario_funcionamento: initialData.horario_funcionamento,
    possui_balanca: initialData.possui_balanca,
    possui_refrigeracao: initialData.possui_refrigeracao,
    numero_docas: initialData.numero_docas,
    status: initialData.status,
  } : {
    codigo: '',
    nome: '',
    descricao: '',
    localizacao_id: 'Luanda',
    endereco: '',
    latitude: '',
    longitude: '',
    capacidade_total: '',
    horario_funcionamento: '08:00 - 18:00',
    possui_balanca: true,
    possui_refrigeracao: false,
    numero_docas: 1,
    status: 'OPERACIONAL',
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        codigo: initialData.codigo,
        nome: initialData.name,
        descricao: initialData.descricao || '',
        localizacao_id: initialData.location,
        endereco: initialData.endereco || '',
        latitude: initialData.latitude || '',
        longitude: initialData.longitude || '',
        capacidade_total: initialData.capacidade_total || '',
        horario_funcionamento: initialData.horario_funcionamento,
        possui_balanca: initialData.possui_balanca,
        possui_refrigeracao: initialData.possui_refrigeracao,
        numero_docas: initialData.numero_docas,
        status: initialData.status,
      });
    } else {
      setFormData({
        codigo: '',
        nome: '',
        descricao: '',
        localizacao_id: 'Luanda',
        endereco: '',
        latitude: '',
        longitude: '',
        capacidade_total: '',
        horario_funcionamento: '08:00 - 18:00',
        possui_balanca: true,
        possui_refrigeracao: false,
        numero_docas: 1,
        status: 'OPERACIONAL',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newHub = {
      ...initialData,
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      codigo: formData.codigo || `HUB-${formData.localizacao_id.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 100)}`,
      name: formData.nome,
      location: formData.localizacao_id,
      capacity: initialData?.capacity || '0%', // Initial capacity
      stock: initialData?.stock || '0.0 Ton',
      aggregators: initialData?.aggregators || 0,
      status: formData.status,
      ...formData
    };

    onSuccess(newHub);
    setLoading(false);
    onClose();
    // Reset form
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const provinces = [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte',
    'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte',
    'Lunda Sul', 'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Hub de Consolidação' : 'Novo Hub de Consolidação'}</DialogTitle>
          <DialogDescription>{initialData ? 'Atualize os dados do ponto estratégico na rede.' : 'Registe um novo ponto estratégico na rede logística.'}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção: Identificação */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Warehouse className="w-3.5 h-3.5" />
              Identificação do Hub
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="nome">Nome do Hub *</Label>
                <Input
                  id="nome"
                  required
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Hub Luanda Norte"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={2}
                  className="resize-none"
                  placeholder="Breve descrição das instalações..."
                />
              </div>
            </div>
          </div>

          {/* Seção: Localização */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Localização e Endereço
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="localizacao_id">Província *</Label>
                <Select
                  id="localizacao_id"
                  name="localizacao_id"
                  value={formData.localizacao_id}
                  onChange={handleChange}
                >
                  {provinces.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  placeholder="Rua, Bairro..."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="-8.8399"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="13.2894"
                />
              </div>
            </div>
          </div>

          {/* Seção: Capacidade e Infraestrutura */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              Capacidade e Infraestrutura
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="capacidade_total">Capacidade Total (Ton) *</Label>
                <Input
                  id="capacidade_total"
                  required
                  type="number"
                  name="capacidade_total"
                  value={formData.capacidade_total}
                  onChange={handleChange}
                  placeholder="Ex: 500"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="numero_docas">Número de Docas</Label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="numero_docas"
                    type="number"
                    name="numero_docas"
                    value={formData.numero_docas}
                    onChange={handleChange}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="horario_funcionamento">Horário de Funcionamento</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="horario_funcionamento"
                    name="horario_funcionamento"
                    value={formData.horario_funcionamento}
                    onChange={handleChange}
                    className="pl-9"
                    placeholder="Ex: 08:00 - 18:00"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Status Inicial</Label>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="OPERACIONAL">Operacional</option>
                  <option value="SATURADO">Saturado</option>
                  <option value="MANUTENCAO">Manutenção</option>
                  <option value="INATIVO">Inativo</option>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <Label className="flex cursor-pointer items-center gap-2 group">
                <div className="relative flex items-center">
                  <Checkbox
                    type="checkbox"
                    name="possui_balanca"
                    checked={formData.possui_balanca}
                    onChange={handleChange}
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-foreground">Possui Balança</span>
                </div>
              </Label>

              <Label className="flex cursor-pointer items-center gap-2 group">
                <div className="relative flex items-center">
                  <Checkbox
                    type="checkbox"
                    name="possui_refrigeracao"
                    checked={formData.possui_refrigeracao}
                    onChange={handleChange}
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Snowflake className="w-4 h-4 text-muted-foreground group-hover:text-info transition-colors" />
                  <span className="text-sm font-medium text-foreground">Possui Refrigeração</span>
                </div>
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {initialData ? 'A atualizar...' : 'A registar...'}
                </>
              ) : (
                initialData ? 'Atualizar Hub' : 'Registar Hub'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
