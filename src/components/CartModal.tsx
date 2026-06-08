import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, NotepadText, ShoppingCart, ShoppingBag } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQtd: (id: string, delta: number) => void;
  subtotal: number;
  onCheckout: () => void;
}

export default function CartModal({ isOpen, onClose, cart, onRemoveItem, onUpdateQtd, subtotal, onCheckout }: CartModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xs cursor-pointer transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Slide-out cart drawer container */}
      <div className="relative bg-[#121212] border-l-2 border-brand-primary h-full w-full max-w-md p-6 shadow-2xl z-10 text-white flex flex-col justify-between overflow-hidden">
        
        {/* Header indicator */}
        <div className="flex justify-between items-center pb-4 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-brand-primary animate-pulse" size={24} />
            <h3 className="font-display text-2xl text-yellow-400 uppercase tracking-widest text-shadow-retro-small">
              Seu Carrinho
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 px-3 text-xs font-bold bg-[#222] hover:bg-brand-primary hover:text-white rounded-full transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable item list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-center text-gray-500">
              <ShoppingCart size={48} className="stroke-[1.5] mb-3 opacity-30" />
              <p className="font-oswald text-lg uppercase font-bold tracking-wider mb-1 text-gray-400">Carrinho Vazio</p>
              <p className="text-xs max-w-xs text-gray-500 font-sans leading-relaxed">
                Navegue pelas nossas deliciosas categorias de lanches e adicione itens para satisfazer a sua fome!
              </p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={item.id} 
                className="relative p-4 bg-[#181818] border border-[#262626] rounded-2xl flex flex-col justify-between gap-3 shadow-md transition-all hover:border-[#333]"
              >
                
                {/* Product details & Action */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <span className="block font-oswald text-lg font-bold text-yellow-300 uppercase leading-tight">
                      {item.nome}
                    </span>
                    
                    {/* Display user observation notes */}
                    {item.obs && (
                      <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-[#0c0c0c] rounded-lg border border-[#222]">
                        <NotepadText size={12} className="text-brand-secondary shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-400 italic break-words leading-normal max-w-full">
                          Obs: {item.obs}
                        </span>
                      </div>
                    )}
                    
                    {/* Modifications addon indicator */}
                    {item.adicional && (
                      <span className="inline-flex mt-1.5 items-center gap-1 text-[11px] font-bold text-brand-secondary px-2 py-0.5 bg-brand-primary/10 rounded-full border border-brand-primary/25 font-mono uppercase">
                        ➕ Adicional Especial (+ R$ 6,00 por unid.)
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    title="Remover do carrinho"
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Pricing & Quantities */}
                <div className="flex justify-between items-center border-t border-[#222] pt-2.5 mt-1">
                  <span className="text-sm text-gray-400 font-mono">
                    R$ {item.precoFinal.toFixed(2).replace('.', ',')} cada
                  </span>

                  <div className="flex items-center gap-2 bg-[#262626] rounded-xl p-1 border border-[#333]">
                    <button
                      onClick={() => onUpdateQtd(item.id, -1)}
                      className="p-1 hover:bg-brand-primary hover:text-white rounded-lg transition-all cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-sm w-6 text-center text-yellow-300">
                      {item.qtd}
                    </span>
                    <button
                      onClick={() => onUpdateQtd(item.id, 1)}
                      className="p-1 hover:bg-brand-primary hover:text-white rounded-lg transition-all cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Subtotal of this item line */}
                <div className="text-right text-xs text-brand-secondary font-mono -mt-1 font-bold">
                  Total: R$ {(item.precoFinal * item.qtd).toFixed(2).replace('.', ',')}
                </div>

              </div>
            ))
          )}
        </div>

        {/* Dynamic checkout total & proceed buttons */}
        <div className="border-t-2 border-dashed border-[#222] pt-4 mt-2">
          <div className="space-y-1 mb-4 font-mono text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Subtotal dos itens:</span>
              <span className="text-white">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-[#888]">
              <span>Taxa de entrega (fixa):</span>
              <span className="text-brand-secondary">R$ 6,00</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#222] text-lg font-display text-yellow-400 uppercase tracking-wider text-shadow-retro-small font-normal">
              <span>Total Estimado:</span>
              <span>R$ {(subtotal + 6.00).toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={onCheckout}
              disabled={cart.length === 0}
              className={`w-full py-3.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-2xl text-base shadow-lg transition-all focus:outline-hidden hover:brightness-110 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${cart.length === 0 ? 'opacity-40 pointer-events-none' : ''}`}
            >
              <ShoppingCart size={18} className="stroke-[3]" />
              Finalizar Pedido
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 border border-[#222] text-gray-400 hover:text-white hover:bg-[#1a1a1a] font-bold rounded-2xl text-xs transition-all cursor-pointer text-center"
            >
              Continuar Comprando
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
