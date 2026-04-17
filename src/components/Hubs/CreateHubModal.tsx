import React, { useState } from 'react';
import { X, Warehouse, Hash, MapPin, Info, Clock, Scale, Snowflake, Truck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-900 text-white">
              <div>
                <h3 className="text-xl font-bold">{initialData ? 'Editar Hub de Consolidação' : 'Novo Hub de Consolidação'}</h3>
                <p className="text-emerald-200 text-sm">{initialData ? 'Atualize os dados do ponto estratégico na rede.' : 'Registe um novo ponto estratégico na rede logística.'}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              {/* Seção: Identificação */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Warehouse className="w-4 h-4" />
                  Identificação do Hub
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Nome do Hub *</label>
                    <input
                      required
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Ex: Hub Luanda Norte"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                      placeholder="Breve descrição das instalações..."
                    />
                  </div>
                </div>
              </div>

              {/* Seção: Localização */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Localização e Endereço
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Província *</label>
                    <select
                      name="localizacao_id"
                      value={formData.localizacao_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white"
                    >
                      {provinces.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Endereço</label>
                    <input
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Rua, Bairro..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Latitude</label>
                    <input
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      placeholder="-8.8399"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Longitude</label>
                    <input
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      placeholder="13.2894"
                    />
                  </div>
                </div>
              </div>

              {/* Seção: Capacidade e Infraestrutura */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Capacidade e Infraestrutura
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Capacidade Total (Ton) *</label>
                    <input
                      required
                      type="number"
                      name="capacidade_total"
                      value={formData.capacidade_total}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Ex: 500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Número de Docas</label>
                    <div className="relative">
                      <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        name="numero_docas"
                        value={formData.numero_docas}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Horário de Funcionamento</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="horario_funcionamento"
                        value={formData.horario_funcionamento}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        placeholder="Ex: 08:00 - 18:00"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Status Inicial</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white"
                    >
                      <option value="OPERACIONAL">Operacional</option>
                      <option value="SATURADO">Saturado</option>
                      <option value="MANUTENCAO">Manutenção</option>
                      <option value="INATIVO">Inativo</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        name="possui_balanca"
                        checked={formData.possui_balanca}
                        onChange={handleChange}
                        className="w-5 h-5 border-2 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                      <span className="text-sm font-medium text-gray-700">Possui Balança</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        name="possui_refrigeracao"
                        checked={formData.possui_refrigeracao}
                        onChange={handleChange}
                        className="w-5 h-5 border-2 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Snowflake className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm font-medium text-gray-700">Possui Refrigeração</span>
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
                      {initialData ? 'A atualizar...' : 'A registar...'}
                    </>
                  ) : (
                    initialData ? 'Atualizar Hub' : 'Registar Hub'
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
