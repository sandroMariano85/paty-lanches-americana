import React from 'react';
import { MenuItem } from '../types';
import { Plus, Edit3 } from 'lucide-react';

interface ItemCardProps {
  item: MenuItem;
  onAddClick: (item: MenuItem) => void;
  isAdmin: boolean;
  onEditPrice: (item: MenuItem) => void;
}

export default function ItemCard({ item, onAddClick, isAdmin, onEditPrice }: ItemCardProps) {
  // Get icon depending on category
  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case 'lanches': return '🍔';
      case 'porcoes': return '🍟';
      case 'hotdog': return '🌭';
      case 'pao_frances': return '🥖';
      case 'bebidas': return '🥤';
      default: return '🍽️';
    }
  };

  return (
    <div className="relative bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:border-brand-secondary hover:shadow-[0_4px_20px_rgba(255,170,0,0.15)] flex flex-col justify-between group h-full">
      
      {/* Top Banner Category Indicator */}
      <div className="h-1 bg-gradient-to-r from-brand-primary to-brand-secondary"></div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-display text-xl text-yellow-400 group-hover:text-yellow-300 transition-colors uppercase tracking-wide leading-tight">
              {item.nome}
            </h3>
            <span className="text-xl shrink-0" aria-hidden="true">
              {getCategoryEmoji(item.categoria)}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 font-sans leading-relaxed line-clamp-3 mb-4">
            {item.ingredientes}
          </p>
        </div>

        <div>
          {/* Divider */}
          <div className="border-t border-dashed border-[#333] my-3"></div>

          {/* Price & Add to Cart Footer */}
          <div className="flex justify-between items-center mt-2 gap-2">
            <button
              onClick={() => onAddClick(item)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-[#cc4400] text-white font-bold rounded-xl text-sm transition-all duration-200 hover:brightness-110 active:scale-95 shadow-md shadow-brand-primary/10 cursor-pointer"
            >
              <Plus size={16} className="stroke-[3]" />
              Pedir
            </button>

            <div className="flex items-center gap-1.5">
              <div 
                onClick={() => onEditPrice(item)}
                title="Clique em cima para alterar o preço (Requer senha 3977)"
                className="py-1.5 px-3 rounded-lg border-2 border-brand-secondary bg-[#771a00] hover:bg-brand-primary/95 font-oswald font-bold text-base sm:text-lg text-white shadow-[2px_2px_0px_#000] cursor-pointer hover:scale-[1.03] active:scale-95 transition-all text-shadow-retro-small flex items-center gap-1 shrink-0"
              >
                <span>R$ {item.preco.toFixed(2).replace('.', ',')}</span>
                <Edit3 size={13} className="opacity-80 shrink-0 text-yellow-300 ml-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
