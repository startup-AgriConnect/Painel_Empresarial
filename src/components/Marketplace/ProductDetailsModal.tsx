import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Package, 
  MapPin, 
  User, 
  Calendar, 
  Truck, 
  Leaf, 
  Zap, 
  ShoppingCart, 
  Plus, 
  Minus,
  ArrowRight,
  ChevronRight,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  similarProducts: any[];
  onAddToCart: (product: any, quantity: number) => void;
  onSelectProduct: (product: any) => void;
}

export default function ProductDetailsModal({ 
  isOpen, 
  onClose, 
  product, 
  similarProducts,
  onAddToCart,
  onSelectProduct
}: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[85vh]"
          >
            {/* Header */}
            <div className="absolute top-6 right-6 z-10">
              <button 
                onClick={onClose}
                className="p-3 bg-white/80 backdrop-blur-md hover:bg-white text-gray-900 rounded-2xl transition-all shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col lg:flex-row">
                {/* Image Gallery Placeholder */}
                <div className="lg:w-1/2 p-8">
                  <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-100 relative group">
                    <img 
                      src={product.imagem} 
                      alt={product.nome_produto}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      {product.destaque === 'PREMIUM' && (
                        <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-black uppercase tracking-wider shadow-xl">
                          Premium
                        </span>
                      )}
                      {product.certificacao_organica && (
                        <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-wider shadow-xl flex items-center gap-2">
                          <Leaf className="w-3 h-3" />
                          Orgânico
                        </span>
                      )}
                    </div>
                    <button className="absolute bottom-6 right-6 p-4 bg-white/80 backdrop-blur-md hover:bg-white text-rose-500 rounded-2xl transition-all shadow-xl">
                      <Heart className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Thumbnails Placeholder */}
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 border-transparent hover:border-emerald-500 transition-all cursor-pointer">
                        <img 
                          src={`https://picsum.photos/seed/${product.id}-${i}/200/200`} 
                          alt="Thumbnail"
                          className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="lg:w-1/2 p-8 lg:pl-0 flex flex-col">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-[0.2em] mb-2">
                      <Package className="w-4 h-4" />
                      {product.categoria}
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
                      {product.nome_produto}
                    </h2>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={cn(
                                "w-4 h-4", 
                                s <= Math.floor(product.avaliacao) ? "text-emerald-500 fill-emerald-500" : "text-gray-200"
                              )} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-black text-gray-900">{product.avaliacao}</span>
                        <span className="text-sm text-gray-400 font-bold">({product.vendas} vendas)</span>
                      </div>
                      <div className="h-4 w-px bg-gray-200" />
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-bold text-emerald-700">Qualidade {product.nivel_qualidade.replace('_', '+')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-4xl font-black text-emerald-600">
                      {product.preco_unitario.toLocaleString()} <span className="text-lg font-bold">Kz / {product.unidade}</span>
                    </p>
                    {product.frete_incluido && (
                      <p className="text-emerald-600 text-sm font-bold mt-2 flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Frete Grátis Incluído
                      </p>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Produtor</span>
                      </div>
                      <p className="text-sm font-black text-gray-900">{product.produtor}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Localização</span>
                      </div>
                      <p className="text-sm font-black text-gray-900 truncate">{product.local_retirada}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Colheita</span>
                      </div>
                      <p className="text-sm font-black text-gray-900">{new Date(product.data_colheita).toLocaleDateString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-1">
                        <Zap className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Disponível</span>
                      </div>
                      <p className="text-sm font-black text-gray-900">{product.quantidade} {product.unidade}</p>
                    </div>
                  </div>

                  {/* Purchase Section */}
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-100 p-2 rounded-2xl border border-gray-200">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-white rounded-xl transition-all text-gray-600"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="w-12 text-center font-black text-lg text-gray-900">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(Math.min(product.quantidade, quantity + 1))}
                          className="p-2 hover:bg-white rounded-xl transition-all text-gray-600"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <button 
                        onClick={handleAddToCart}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20"
                      >
                        <ShoppingCart className="w-6 h-6" />
                        Adicionar ao Carrinho
                      </button>
                    </div>
                    <p className="text-center text-xs text-gray-400 font-bold">
                      Total: {(product.preco_unitario * quantity).toLocaleString()} Kz
                    </p>
                  </div>
                </div>
              </div>

              {/* Similar Products */}
              <div className="p-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-900">Produtos Semelhantes</h3>
                  <button className="text-emerald-600 font-black text-sm flex items-center gap-2 hover:underline">
                    Ver Todos
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {similarProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onSelectProduct(p)}
                      className="group text-left space-y-3"
                    >
                      <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 relative">
                        <img 
                          src={p.imagem} 
                          alt={p.nome_produto}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white p-3 rounded-2xl shadow-xl">
                            <ChevronRight className="w-6 h-6 text-emerald-600" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{p.categoria}</p>
                        <h4 className="font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{p.nome_produto}</h4>
                        <p className="text-sm font-black text-emerald-600">{p.preco_unitario.toLocaleString()} Kz</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
