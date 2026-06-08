import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { X, Check } from 'lucide-react';

interface CustomizeModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: MenuItem, obs: string, adicional: boolean) => void;
}

export default function CustomizeModal({ item, isOpen, onClose, onConfirm }: CustomizeModalProps) {
  const [obs, setObs] = useState('');
  const [adicional, setAdicional] = useState(false);

  // Reset state when new item opens
  useEffect(() => {
    if (isOpen) {
      setObs('');
      setAdicional(false);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const currentPrice = item.preco + (adicional ? 6.00 : 0.00);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xs cursor-pointer transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal content body */}
      <div className="relative bg-[#181818] border-2 border-brand-primary w-full max-w-lg rounded-3xl p-4 sm:p-6 shadow-[0_10px_40px_rgba(255,85,0,0.3)] z-10 text-white overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Subtle glowing ring background ornament - pointer events disabled to prevent intercepting clicks */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-secondary/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header (Stay fixed at top) */}
        <div className="flex justify-between items-center mb-4 bg-[#222]/40 p-3 rounded-2xl border border-white/5 shrink-0">
          <h3 className="font-display text-xl sm:text-2xl text-yellow-400 uppercase tracking-widest text-shadow-retro-small">
            🍔 Personalizar Lanche
          </h3>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto pr-1.5 space-y-4 mb-4 min-h-0">
          {/* Item details card */}
          <div className="p-4 bg-[#222] border border-[#333] rounded-2xl">
            <h4 className="font-oswald text-xl text-yellow-300 font-bold uppercase">{item.nome}</h4>
            <p className="text-xs text-gray-400 mt-1 font-mono uppercase tracking-wider">Ingredientes padrão:</p>
            <p className="text-sm text-gray-300 mt-1 italic">{item.ingredientes}</p>
          </div>

          {/* Custom observations */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
              📝 Observações (Sem cebola, bem passado, maionese extra, etc):
            </label>
            <textarea
              className="w-full bg-[#111] border border-[#333] rounded-xl p-3 text-sm text-white focus:outline-hidden focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-sans placeholder-gray-600 transition-all font-sans"
              rows={3}
              placeholder="Digite suas preferências aqui (Ex: Sem cebola, bem passado...)"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </div>

          {/* Special additions option */}
          <div className="p-4 bg-gradient-to-r from-[#291710] to-[#1a110d] border border-brand-primary/30 rounded-2xl flex items-center justify-between gap-4 transition-all hover:border-brand-primary/60">
            <div className="flex-1">
              <span className="block text-sm font-bold text-brand-secondary uppercase">➕ Adicionar Modificação Especial</span>
              <span className="block text-xs text-gray-400 mt-0.5">Acréscimo de queijo, bacon, ovo ou outro ingrediente extra por R$ 6,00 por unidade.</span>
            </div>
            
            <label className="relative flex items-center justify-center cursor-pointer select-none shrink-0 border-l border-white/5 pl-3">
              <input 
                type="checkbox" 
                checked={adicional} 
                onChange={(e) => setAdicional(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-14 h-7 bg-[#2e2e2e] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-primary"></div>
              <span className="absolute -top-6 right-0 font-display font-bold text-xs text-brand-secondary whitespace-nowrap">
                + R$ 6,00 por unidade
              </span>
            </label>
          </div>
        </div>

        {/* Dynamic Price Preview & Submission */}
        <div>
          <div className="border-t border-dashed border-[#333] pt-4 mb-4 flex justify-between items-center">
            <span className="text-gray-400 text-sm uppercase font-mono tracking-wider">Subtotal do item:</span>
            <span className="font-display text-2xl text-yellow-400 text-shadow-retro-small">
              R$ {currentPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 border border-red-600/30 hover:bg-red-950/25 text-red-400 hover:text-red-300 font-bold rounded-2xl transition-all cursor-pointer text-center text-xs uppercase font-mono tracking-wider whitespace-nowrap"
            >
              Fechar / Cancelar
            </button>
            <button
              type="button"
              onClick={() => onConfirm(item, obs.trim(), adicional)}
              className="flex-3 py-3.5 bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 active:scale-[0.98] text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 cursor-pointer text-sm uppercase tracking-wide"
            >
              <Check size={18} className="stroke-[3]" />
              Adicionar ao Pedido
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
