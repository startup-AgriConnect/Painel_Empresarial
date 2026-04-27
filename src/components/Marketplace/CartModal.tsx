import React from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  CreditCard,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';

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
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full max-w-md sm:max-w-md flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <SheetTitle className="font-semibold text-lg text-primary-foreground">O Meu Carrinho</SheetTitle>
              <SheetDescription className="text-xs text-primary-foreground/80 font-semibold">{items.length} itens selecionados</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Carrinho Vazio</h3>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                Ainda não adicionou nenhum produto ao seu carrinho.
              </p>
              <Button
                onClick={onClose}
                className="h-auto px-0 text-sm font-semibold text-primary hover:underline"
                variant="ghost"
              >
                Continuar a Comprar
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0 border border-border shadow-sm">
                  <img
                    src={item.imagem}
                    alt={item.nome_produto}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-foreground text-sm truncate">{item.nome_produto}</h4>
                    <Button
                      onClick={() => onRemoveItem(item.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-rose-500"
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Produtor: {item.produtor}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-muted/50 rounded-lg border border-border">
                      <Button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantidade - 1))}
                        className="h-6 w-6 rounded-md p-0 text-muted-foreground hover:bg-card"
                        size="icon"
                        variant="ghost"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold text-xs text-foreground">{item.quantidade}</span>
                      <Button
                        onClick={() => onUpdateQuantity(item.id, item.quantidade + 1)}
                        className="h-6 w-6 rounded-md p-0 text-muted-foreground hover:bg-card"
                        size="icon"
                        variant="ghost"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="font-semibold text-primary text-sm">
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
          <div className="p-6 bg-muted/50 border-t border-border space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-semibold">Subtotal</span>
                <span className="text-foreground font-semibold">{subtotal.toLocaleString()} Kz</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-semibold">Taxa de Plataforma (5%)</span>
                <span className="text-foreground font-semibold">{taxa.toLocaleString()} Kz</span>
              </div>
              <div className="pt-2 border-t border-secondary flex justify-between items-center">
                <span className="text-foreground font-semibold">Total</span>
                <span className="text-2xl font-semibold text-primary">{total.toLocaleString()} Kz</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-success/10 rounded-xl border border-success/20">
                <ShieldCheck className="w-4 h-4 text-success" />
                <p className="text-[10px] font-semibold text-success uppercase tracking-wider">Compra 100% Segura via AgriConnect</p>
              </div>
              <Button
                onClick={onCheckout}
                className="h-auto w-full gap-3 rounded-lg py-4 font-semibold shadow-lg"
              >
                <CreditCard className="w-5 h-5" />
                Fechar Compra
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
