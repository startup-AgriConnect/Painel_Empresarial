import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Plus, 
  Package, 
  Leaf, 
  ShieldCheck, 
  Calendar, 
  DollarSign, 
  Truck, 
  Zap, 
  Tag, 
  MapPin, 
  User,
  Star,
  ArrowRight,
  Heart,
  ChevronRight,
  LayoutGrid,
  List,
  SortAsc,
  Info,
  ShoppingCart,
  Minus
} from 'lucide-react';
import { cn, maskData } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import CreateLotModal from '../Loads/CreateLotModal';
import ProductDetailsModal from './ProductDetailsModal';
import CartModal from './CartModal';

const initialLots = [
  {
    id: 'LOT-001',
    codigo: 'LOT-2026-001',
    nome_produto: 'Milho Branco Premium',
    categoria: 'Cereais',
    quantidade: 25.5,
    unidade: 'Ton',
    nivel_qualidade: 'A_PLUS',
    certificacao_organica: true,
    data_colheita: '2026-03-20',
    preco_unitario: 12500,
    frete_incluido: true,
    local_retirada: 'Fazenda Girassol, Huambo',
    destaque: 'PREMIUM',
    urgente: false,
    status: 'DISPONIVEL',
    produtor: 'João Manuel',
    imagem: 'https://picsum.photos/seed/corn/800/600',
    avaliacao: 4.8,
    vendas: 124
  },
  {
    id: 'LOT-002',
    codigo: 'LOT-2026-002',
    nome_produto: 'Mandioca Amarela',
    categoria: 'Tubérculos',
    quantidade: 15.0,
    unidade: 'Ton',
    nivel_qualidade: 'B',
    certificacao_organica: false,
    data_colheita: '2026-03-25',
    preco_unitario: 8500,
    frete_incluido: false,
    local_retirada: 'Cooperativa Uíge',
    destaque: 'ECONOMICO',
    urgente: true,
    status: 'RESERVADO',
    produtor: 'Maria Bento',
    imagem: 'https://picsum.photos/seed/cassava/800/600',
    avaliacao: 4.2,
    vendas: 89
  },
  {
    id: 'LOT-003',
    codigo: 'LOT-2026-003',
    nome_produto: 'Feijão Frade',
    categoria: 'Leguminosas',
    quantidade: 8.2,
    unidade: 'Ton',
    nivel_qualidade: 'A',
    certificacao_organica: true,
    data_colheita: '2026-04-01',
    preco_unitario: 18000,
    frete_incluido: true,
    local_retirada: 'Fazenda Bié',
    destaque: 'OFERTA',
    urgente: false,
    status: 'DISPONIVEL',
    produtor: 'António Pedro',
    imagem: 'https://picsum.photos/seed/beans/800/600',
    avaliacao: 4.9,
    vendas: 56
  },
  {
    id: 'LOT-004',
    codigo: 'LOT-2026-004',
    nome_produto: 'Batata Doce',
    categoria: 'Tubérculos',
    quantidade: 12.0,
    unidade: 'Ton',
    nivel_qualidade: 'A',
    certificacao_organica: false,
    data_colheita: '2026-04-05',
    preco_unitario: 9200,
    frete_incluido: false,
    local_retirada: 'Fazenda Malanje',
    destaque: 'NOVIDADE',
    urgente: false,
    status: 'DISPONIVEL',
    produtor: 'Sofia Carlos',
    imagem: 'https://picsum.photos/seed/potato/800/600',
    avaliacao: 4.5,
    vendas: 34
  },
  {
    id: 'LOT-005',
    codigo: 'LOT-2026-005',
    nome_produto: 'Arroz Longo',
    categoria: 'Cereais',
    quantidade: 40.0,
    unidade: 'Ton',
    nivel_qualidade: 'A_PLUS',
    certificacao_organica: true,
    data_colheita: '2026-03-15',
    preco_unitario: 15500,
    frete_incluido: true,
    local_retirada: 'Fazenda Zaire',
    destaque: 'PREMIUM',
    urgente: false,
    status: 'DISPONIVEL',
    produtor: 'Manuel Silva',
    imagem: 'https://picsum.photos/seed/rice/800/600',
    avaliacao: 4.7,
    vendas: 210
  }
];

const categories = [
  { id: 'Todos', name: 'Todos os Produtos', icon: LayoutGrid },
  { id: 'Cereais', name: 'Cereais', icon: Package },
  { id: 'Leguminosas', name: 'Leguminosas', icon: Tag },
  { id: 'Tubérculos', name: 'Tubérculos', icon: MapPin },
  { id: 'Frutas', name: 'Frutas', icon: Leaf },
];

export default function MarketplaceManagement() {
  const { user } = useAuth();
  const [lots, setLots] = useState(initialLots);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    qualidade: 'Todos',
    status: 'Todos',
    precoRange: 'Todos'
  });

  // Cart and Details State
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [cardQuantities, setCardQuantities] = useState<Record<string, number>>({});

  const handleUpdateCardQuantity = (id: string, delta: number) => {
    setCardQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const filteredLots = lots.filter(lot => {
    const matchesSearch = lot.nome_produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lot.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || lot.categoria === selectedCategory;
    const matchesQualidade = filters.qualidade === 'Todos' || lot.nivel_qualidade === filters.qualidade;
    const matchesStatus = filters.status === 'Todos' || lot.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesQualidade && matchesStatus;
  });

  const handleCreateSuccess = (newLot: any) => {
    const lotWithExtras = {
      ...newLot,
      imagem: `https://picsum.photos/seed/${newLot.nome_produto}/800/600`,
      avaliacao: 5.0,
      vendas: 0,
      categoria: 'Cereais' // Default for now
    };
    setLots(prev => [lotWithExtras, ...prev]);
  };

  const handleAddToCart = (product: any, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantidade: item.quantidade + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantidade: quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantidade: quantity } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    alert('Compra finalizada com sucesso! A equipa AgriConnect entrará em contacto para o frete.');
    setCart([]);
    setIsCartOpen(false);
  };

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero / Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-emerald-900 text-white p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-700 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <ShoppingBag className="w-3 h-3" />
            Marketplace AgriConnect
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-4 leading-tight"
          >
            Produtos Frescos Direto do <span className="text-emerald-400">Produtor</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-100/80 text-lg mb-8"
          >
            A maior plataforma de comercialização agrícola de Angola. Conectamos produtores e compradores com transparência e eficiência.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-5 h-5" />
              Anunciar Produto
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black transition-all border border-white/10">
              Ver Meus Pedidos
            </button>
          </motion.div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-40 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0 space-y-8">
          {/* Categorias */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-emerald-600" />
              Categorias
            </h3>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                    selectedCategory === cat.id 
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                      : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon className={cn(
                      "w-4 h-4",
                      selectedCategory === cat.id ? "text-white" : "text-gray-400 group-hover:text-emerald-500"
                    )} />
                    {cat.name}
                  </div>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    selectedCategory === cat.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  )} />
                </button>
              ))}
            </div>
          </div>

          {/* Filtros Avançados */}
          <div className="space-y-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-600" />
              Filtros
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Qualidade</label>
                <select 
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  value={filters.qualidade}
                  onChange={(e) => setFilters(prev => ({ ...prev, qualidade: e.target.value }))}
                >
                  <option value="Todos">Todas as Qualidades</option>
                  <option value="A_PLUS">A+ Premium</option>
                  <option value="A">A Excelente</option>
                  <option value="B">B Padrão</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Status</label>
                <select 
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Todos">Todos os Status</option>
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="RESERVADO">Reservado</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Todos');
                    setFilters({ qualidade: 'Todos', status: 'Todos', precoRange: 'Todos' });
                  }}
                  className="w-full py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Banner Lateral */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white">
            <div className="relative z-10">
              <h4 className="font-black text-lg mb-2">Certificação AgriConnect</h4>
              <p className="text-emerald-100 text-xs leading-relaxed mb-4">
                Garanta a melhor qualidade com produtos certificados pela nossa equipa técnica.
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest bg-white text-emerald-700 px-4 py-2 rounded-lg">
                Saiba Mais
              </button>
            </div>
            <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {/* Top Bar Controls */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="O que procura hoje? (ex: Milho, Feijão...)" 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    viewMode === 'grid' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    viewMode === 'list' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <div className="h-8 w-px bg-gray-100 mx-1" />
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-600 transition-all border border-gray-100">
                <SortAsc className="w-4 h-4" />
                Ordenar por: Relevância
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-gray-500">
              Mostrando <span className="font-bold text-gray-900">{filteredLots.length}</span> produtos encontrados
            </p>
            {selectedCategory !== 'Todos' && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                Categoria: {selectedCategory}
              </span>
            )}
          </div>

          {/* Product Grid */}
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
          )}>
            <AnimatePresence mode="popLayout">
              {filteredLots.map((lot, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  key={lot.id} 
                  className={cn(
                    "group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all overflow-hidden flex",
                    viewMode === 'grid' ? "flex-col" : "flex-row h-64"
                  )}
                >
                  {/* Image Section */}
                  <div className={cn(
                    "relative overflow-hidden",
                    viewMode === 'grid' ? "aspect-[4/3]" : "w-80 shrink-0"
                  )}>
                    <img 
                      src={lot.imagem} 
                      alt={lot.nome_produto}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Badges on Image */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {lot.destaque === 'PREMIUM' && (
                        <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                          Premium
                        </span>
                      )}
                      {lot.urgente && (
                        <span className="px-3 py-1 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-white" />
                          Urgente
                        </span>
                      )}
                    </div>
                    
                    <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-rose-500 rounded-xl transition-all shadow-lg">
                      <Heart className="w-4 h-4" />
                    </button>

                    {/* Quick View Button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                      <button 
                        onClick={() => handleViewDetails(lot)}
                        className="bg-white text-emerald-900 px-6 py-3 rounded-2xl font-black text-sm shadow-2xl flex items-center gap-2 hover:bg-emerald-50 transition-all"
                      >
                        Ver Detalhes
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <button 
                        onClick={() => handleViewDetails(lot)}
                        className="text-left"
                      >
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{lot.categoria}</p>
                        <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors">
                          {lot.nome_produto}
                        </h3>
                      </button>
                      <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                        <span className="text-xs font-black text-emerald-700">{lot.avaliacao}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                      <User className="w-3 h-3" />
                      <span>{maskData(lot.produtor, user?.role)}</span>
                      <span>•</span>
                      <span>{lot.vendas} vendas</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Estoque</p>
                          <p className="text-xs font-black text-gray-900">{lot.quantidade} {lot.unidade}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Local</p>
                          <p className="text-xs font-black text-gray-900 truncate max-w-[80px]">{lot.local_retirada.split(',')[0]}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-50 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Preço por {lot.unidade}</p>
                          <p className="text-2xl font-black text-emerald-600">
                            {lot.preco_unitario.toLocaleString()} <span className="text-xs font-bold">Kz</span>
                          </p>
                        </div>
                        
                        {lot.status === 'DISPONIVEL' && (
                          <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 p-1">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateCardQuantity(lot.id, -1);
                              }}
                              className="p-1 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-emerald-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-black text-xs text-gray-900">
                              {cardQuantities[lot.id] || 1}
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateCardQuantity(lot.id, 1);
                              }}
                              className="p-1 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-emerald-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => handleAddToCart(lot, cardQuantities[lot.id] || 1)}
                        disabled={lot.status !== 'DISPONIVEL'}
                        className={cn(
                          "w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2",
                          lot.status === 'DISPONIVEL' 
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20" 
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {lot.status === 'DISPONIVEL' ? 'Adicionar ao Carrinho' : 'Reservado'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredLots.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-20 text-center bg-white rounded-[3rem] border border-gray-100 border-dashed"
            >
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-emerald-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500 max-w-xs mx-auto mb-8">
                Não encontramos resultados para os filtros selecionados. Tente mudar a categoria ou termo de pesquisa.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Todos');
                  setFilters({ qualidade: 'Todos', status: 'Todos', precoRange: 'Todos' });
                }}
                className="text-emerald-600 font-black text-sm hover:underline"
              >
                Limpar todos os filtros
              </button>
            </motion.div>
          )}

          {/* Pagination Placeholder */}
          {filteredLots.length > 0 && (
            <div className="flex justify-center pt-8">
              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-sm">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-50 font-bold text-sm">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-50 font-bold text-sm">3</button>
                <div className="px-2 text-gray-300">...</div>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-50 font-bold text-sm">12</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <CreateLotModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <ProductDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        product={selectedProduct}
        similarProducts={lots.filter(l => l.categoria === selectedProduct?.categoria && l.id !== selectedProduct?.id).slice(0, 4)}
        onAddToCart={handleAddToCart}
        onSelectProduct={handleViewDetails}
      />

      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-40 bg-emerald-600 text-white p-5 rounded-full shadow-2xl shadow-emerald-600/40 hover:bg-emerald-700 transition-all group"
        >
          <div className="relative">
            <ShoppingCart className="w-8 h-8" />
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-emerald-600 group-hover:scale-110 transition-transform">
              {cart.reduce((acc, item) => acc + item.quantidade, 0)}
            </span>
          </div>
        </motion.button>
      )}
    </div>
  );
}
