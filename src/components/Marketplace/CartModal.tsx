import React from 'react';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  Package,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface CartItem {
  id: string;
  nome_produto: string;
  preco_unitario: number;
  quantidade: number;
  unidade: string;
  imagem: string;
  produtor: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function CartModal({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}: CartModalProps) {
  const subtotal = items.reduce((acc, item) => acc + (item.preco_unitario * item.quantidade), 0);
  const taxa = subtotal * 0.05; // 5% platform fee
  const total = subtotal + taxa;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-900 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-800 rounded-xl">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-black text-lg">O Meu Carrinho</h2>
                  <p className="text-xs text-emerald-300 font-bold">{items.length} itens selecionados</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-emerald-800 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-200" />
                  </div>
                  <h3 className="font-black text-gray-900">Carrinho Vazio</h3>
                  <p className="text-sm text-gray-400 max-w-[200px]">
                    Ainda não adicionou nenhum produto ao seu carrinho.
                  </p>
                  <button 
                    onClick={onClose}
                    className="text-emerald-600 font-black text-sm hover:underline"
                  >
                    Continuar a Comprar
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 shadow-sm">
                      <img 
                        src={item.imagem} 
                        alt={item.nome_produto}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-black text-gray-900 text-sm truncate">{item.nome_produto}</h4>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Produtor: {item.produtor}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantidade - 1))}
                            className="p-1 hover:bg-white rounded-md transition-all text-gray-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-black text-xs text-gray-900">{item.quantidade}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantidade + 1)}
                            className="p-1 hover:bg-white rounded-md transition-all text-gray-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-black text-emerald-600 text-sm">
                          {(item.preco_unitario * item.quantidade).toLocaleString()} Kz
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">Subtotal</span>
                    <span className="text-gray-900 font-black">{subtotal.toLocaleString()} Kz</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">Taxa de Plataforma (5%)</span>
                    <span className="text-gray-900 font-black">{taxa.toLocaleString()} Kz</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-gray-900 font-black">Total</span>
                    <span className="text-2xl font-black text-emerald-600">{total.toLocaleString()} Kz</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Compra 100% Segura via AgriConnect</p>
                  </div>
                  <button 
                    onClick={onCheckout}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20"
                  >
                    <CreditCard className="w-5 h-5" />
                    Fechar Compra
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
