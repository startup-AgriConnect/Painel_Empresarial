import React, { useState } from 'react';
import {
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
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-5xl overflow-y-auto p-0">
        <DialogTitle className="sr-only">{product.nome_produto}</DialogTitle>
        <DialogDescription className="sr-only">Detalhes do produto {product.nome_produto}</DialogDescription>
        <div className="flex flex-col lg:flex-row">
          {/* Image Gallery Placeholder */}
          <div className="lg:w-1/2 p-8">
            <div className="aspect-square rounded-[2rem] overflow-hidden bg-muted relative group">
              <img
                src={product.imagem}
                alt={product.nome_produto}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.destaque === 'PREMIUM' && (
                  <span className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider shadow-xl">
                    Premium
                  </span>
                )}
                {product.certificacao_organica && (
                  <span className="px-4 py-1.5 bg-success/10 text-success rounded-full text-xs font-semibold uppercase tracking-wider shadow-xl flex items-center gap-2">
                    <Leaf className="w-3 h-3" />
                    Orgânico
                  </span>
                )}
              </div>
              <Button className="absolute bottom-6 right-6 rounded-lg bg-background/80 p-4 text-rose-500 shadow-xl backdrop-blur-md hover:bg-background" size="icon" variant="ghost">
                <Heart className="w-6 h-6" />
              </Button>
            </div>

            {/* Thumbnails Placeholder */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted/50 border-2 border-transparent hover:border-primary transition-all cursor-pointer">
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
              <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-2">
                <Package className="w-4 h-4" />
                {product.categoria}
              </div>
              <h2 className="text-4xl font-semibold text-foreground mb-4 leading-tight">
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
                          s <= Math.floor(product.avaliacao) ? "text-primary fill-primary" : "text-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{product.avaliacao}</span>
                  <span className="text-sm text-muted-foreground font-semibold">({product.vendas} vendas)</span>
                </div>
                <div className="h-4 w-px bg-secondary" />
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">Qualidade {product.nivel_qualidade.replace('_', '+')}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-4xl font-semibold text-primary">
                {product.preco_unitario.toLocaleString()} <span className="text-lg font-semibold">Kz / {product.unidade}</span>
              </p>
              {product.frete_incluido && (
                <p className="text-primary text-sm font-semibold mt-2 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Frete Grátis Incluído
                </p>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-1">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Produtor</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{product.produtor}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Localização</span>
                </div>
                <p className="text-sm font-semibold text-foreground truncate">{product.local_retirada}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Colheita</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{new Date(product.data_colheita).toLocaleDateString()}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-1">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Disponível</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{product.quantidade} {product.unidade}</p>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-muted p-2 rounded-lg border border-secondary">
                  <Button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-9 w-9 rounded-xl p-0 text-muted-foreground hover:bg-card"
                    size="icon"
                    variant="ghost"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg text-foreground">{quantity}</span>
                  <Button
                    onClick={() => setQuantity(Math.min(product.quantidade, quantity + 1))}
                    className="h-9 w-9 rounded-xl p-0 text-muted-foreground hover:bg-card"
                    size="icon"
                    variant="ghost"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 gap-3 rounded-lg py-4 font-semibold shadow-lg"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Adicionar ao Carrinho
                </Button>
              </div>
              <p className="text-center text-xs text-muted-foreground font-semibold">
                Total: {(product.preco_unitario * quantity).toLocaleString()} Kz
              </p>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="p-8 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-foreground">Produtos Semelhantes</h3>
            <Button className="h-auto gap-2 px-0 text-sm font-semibold text-primary hover:underline" variant="ghost">
              Ver Todos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <Button
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="group h-auto space-y-3 p-0 text-left"
                variant="ghost"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted relative">
                  <img
                    src={p.imagem}
                    alt={p.nome_produto}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-background p-3 rounded-lg shadow-xl">
                      <ChevronRight className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">{p.categoria}</p>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{p.nome_produto}</h4>
                  <p className="text-sm font-semibold text-primary">{p.preco_unitario.toLocaleString()} Kz</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
