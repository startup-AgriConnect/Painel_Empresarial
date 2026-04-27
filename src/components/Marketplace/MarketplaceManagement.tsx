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
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-muted-foreground text-[10px] font-semibold uppercase tracking-wider mb-1">
            <ShoppingBag className="w-3 h-3" />
            Marketplace AgriConnect
          </div>
          <h1 className="text-2xl font-semibold text-foreground leading-tight">
            Produtos Frescos Direto do Produtor
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            A maior plataforma de comercialização agrícola de Angola. Conectamos produtores e compradores com transparência e eficiência.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium border border-border bg-background hover:bg-accent transition-colors">
            Ver Meus Pedidos
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Anunciar Produto
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0 space-y-8">
          {/* Categorias */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-primary" />
              Categorias
            </h3>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group",
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-primary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon className={cn(
                      "w-4 h-4",
                      selectedCategory === cat.id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
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
          <div className="space-y-3 p-4 bg-card rounded-lg border border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" />
              Filtros
            </h3>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-muted-foreground uppercase">Qualidade</label>
                <select
                  className="w-full h-9 px-3 bg-background border border-input rounded-md text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  value={filters.qualidade}
                  onChange={(e) => setFilters(prev => ({ ...prev, qualidade: e.target.value }))}
                >
                  <option value="Todos">Todas as Qualidades</option>
                  <option value="A_PLUS">A+ Premium</option>
                  <option value="A">A Excelente</option>
                  <option value="B">B Padrão</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-muted-foreground uppercase">Status</label>
                <select
                  className="w-full h-9 px-3 bg-background border border-input rounded-md text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Todos">Todos os Status</option>
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="RESERVADO">Reservado</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Todos');
                  setFilters({ qualidade: 'Todos', status: 'Todos', precoRange: 'Todos' });
                }}
                className="w-full h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-all"
              >
                Limpar Filtros
              </button>
            </div>
          </div>

          {/* Banner Lateral */}
          <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground">
            <div className="relative z-10">
              <h4 className="font-semibold text-lg mb-2">Certificação AgriConnect</h4>
              <p className="text-primary-foreground/90 text-xs leading-relaxed mb-4">
                Garanta a melhor qualidade com produtos certificados pela nossa equipa técnica.
              </p>
              <button className="text-[10px] font-semibold uppercase tracking-widest bg-background text-primary px-4 py-2 rounded-lg">
                Saiba Mais
              </button>
            </div>
            <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-primary-foreground/10" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {/* Top Bar Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="O que procura hoje? (ex: Milho, Feijão...)"
                className="w-full h-9 pl-9 pr-3 bg-background border border-input rounded-md text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="inline-flex items-center bg-muted p-0.5 rounded-md h-9">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-8 px-2 rounded transition-all",
                  viewMode === 'grid' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "h-8 px-2 rounded transition-all",
                  viewMode === 'list' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button className="h-9 inline-flex items-center gap-2 px-3 bg-background border border-input rounded-md text-sm shadow-xs hover:bg-accent transition-colors">
              <SortAsc className="w-4 h-4" />
              Relevância
            </button>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-semibold text-foreground">{filteredLots.length}</span> produtos encontrados
            </p>
            {selectedCategory !== 'Todos' && (
              <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-semibold">
                Categoria: {selectedCategory}
              </span>
            )}
          </div>

          {/* Product Grid */}
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          )}>
            <AnimatePresence mode="popLayout">
              {filteredLots.map((lot, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04 }}
                  key={lot.id}
                  className={cn(
                    "group bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-all overflow-hidden flex",
                    viewMode === 'grid' ? "flex-col" : "flex-row h-44"
                  )}
                >
                  {/* Image Section */}
                  <div className={cn(
                    "relative overflow-hidden bg-muted",
                    viewMode === 'grid' ? "aspect-[4/3]" : "w-48 shrink-0"
                  )}>
                    <img
                      src={lot.imagem}
                      alt={lot.nome_produto}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Badges on Image */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {lot.destaque === 'PREMIUM' && (
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded-md text-[9px] font-semibold uppercase tracking-wider">
                          Premium
                        </span>
                      )}
                      {lot.urgente && (
                        <span className="px-2 py-0.5 bg-destructive text-destructive-foreground rounded-md text-[9px] font-semibold uppercase tracking-wider flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 fill-current" />
                          Urgente
                        </span>
                      )}
                    </div>

                    <button className="absolute top-2 right-2 p-1.5 bg-background/70 backdrop-blur-md hover:bg-background text-foreground hover:text-destructive rounded-md transition-all">
                      <Heart className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick View overlay */}
                    <button
                      onClick={() => handleViewDetails(lot)}
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all bg-background text-foreground px-2.5 py-1 rounded-md text-[11px] font-semibold shadow flex items-center gap-1 hover:bg-accent"
                    >
                      Ver
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="p-3 flex flex-col flex-1 gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <button
                        onClick={() => handleViewDetails(lot)}
                        className="text-left min-w-0"
                      >
                        <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">{lot.categoria}</p>
                        <h3 className="text-sm font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                          {lot.nome_produto}
                        </h3>
                      </button>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Star className="w-3 h-3 text-foreground fill-foreground" />
                        <span className="text-[11px] font-medium text-foreground">{lot.avaliacao}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <User className="w-3 h-3 shrink-0" />
                      <span className="truncate">{maskData(lot.produtor, user?.role)}</span>
                      <span>•</span>
                      <span className="shrink-0">{lot.vendas} vendas</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground border-t border-b border-border py-1.5">
                      <div className="flex items-center gap-1 min-w-0">
                        <Package className="w-3 h-3 shrink-0" />
                        <span className="truncate">{lot.quantidade} {lot.unidade}</span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{lot.local_retirada.split(',')[0]}</span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-2">
                      <div>
                        <p className="text-[9px] font-medium text-muted-foreground uppercase">Por {lot.unidade}</p>
                        <p className="text-lg font-semibold text-foreground leading-tight">
                          {lot.preco_unitario.toLocaleString()} <span className="text-[10px] text-muted-foreground">Kz</span>
                        </p>
                      </div>

                      {lot.status === 'DISPONIVEL' && (
                        <div className="flex items-center bg-muted rounded-md border border-border h-7">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateCardQuantity(lot.id, -1);
                            }}
                            className="px-1.5 h-full hover:bg-accent rounded-l-md text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-[11px] font-medium text-foreground">
                            {cardQuantities[lot.id] || 1}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateCardQuantity(lot.id, 1);
                            }}
                            className="px-1.5 h-full hover:bg-accent rounded-r-md text-muted-foreground hover:text-foreground"
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
                        "w-full h-8 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5",
                        lot.status === 'DISPONIVEL'
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {lot.status === 'DISPONIVEL' ? 'Adicionar' : 'Reservado'}
                    </button>
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
              className="p-20 text-center bg-card rounded-[3rem] border border-border border-dashed"
            >
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                Não encontramos resultados para os filtros selecionados. Tente mudar a categoria ou termo de pesquisa.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Todos');
                  setFilters({ qualidade: 'Todos', status: 'Todos', precoRange: 'Todos' });
                }}
                className="text-primary font-semibold text-sm hover:underline"
              >
                Limpar todos os filtros
              </button>
            </motion.div>
          )}

          {/* Pagination Placeholder */}
          {filteredLots.length > 0 && (
            <div className="flex justify-center pt-8">
              <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border shadow-sm">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-accent">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-accent font-semibold text-sm">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-accent font-semibold text-sm">3</button>
                <div className="px-2 text-muted-foreground">...</div>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-accent font-semibold text-sm">12</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-accent">
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
          className="fixed bottom-8 right-8 z-40 bg-primary text-primary-foreground p-5 rounded-full shadow-lg hover:bg-primary/90 transition-all group"
        >
          <div className="relative">
            <ShoppingCart className="w-8 h-8" />
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-semibold w-6 h-6 rounded-full flex items-center justify-center border-2 border-primary group-hover:scale-110 transition-transform">
              {cart.reduce((acc, item) => acc + item.quantidade, 0)}
            </span>
          </div>
        </motion.button>
      )}
    </div>
  );
}
