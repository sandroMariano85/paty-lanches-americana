import React, { useState } from 'react';
import { CheckoutDetails } from '../types';
import { X, MapPin, CreditCard, Phone, DollarSign, Send, ArrowLeft, Utensils, ShoppingBag, Truck } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  onConfirmCheckout: (details: CheckoutDetails) => void;
}

export default function CheckoutModal({ isOpen, onClose, subtotal, onConfirmCheckout }: CheckoutModalProps) {
  const [tipoServico, setTipoServico] = useState<'entrega' | 'retirada' | 'mesa'>('entrega');
  const [mesaNumero, setMesaNumero] = useState('');
  const [endereco, setEndereco] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<'Dinheiro' | 'Cartão' | 'PIX'>('PIX');
  const [trocoPara, setTrocoPara] = useState('');
  const [needsTroco, setNeedsTroco] = useState(false);
  const [telefone, setTelefone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const taxaEntrega = tipoServico === 'entrega' ? 6.00 : 0.00;
  const totalGeral = subtotal + taxaEntrega;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tipoServico === 'entrega' && !endereco.trim()) {
      setErrorMsg('Por favor, informe seu endereço completo de entrega.');
      return;
    }
    
    if (tipoServico === 'mesa' && !mesaNumero.trim()) {
      setErrorMsg('Por favor, informe seu nome para o atendimento.');
      return;
    }

    if (tipoServico !== 'mesa' && !telefone.trim()) {
      setErrorMsg('Por favor, informe seu telefone de contato com DDD.');
      return;
    }

    // Validation for troco (change)
    if (tipoServico !== 'mesa' && formaPagamento === 'Dinheiro' && needsTroco) {
      const parsedTroco = parseFloat(trocoPara.replace(',', '.'));
      if (isNaN(parsedTroco) || parsedTroco <= totalGeral) {
        setErrorMsg(`O valor do troco deve ser maior que o total do pedido (R$ ${totalGeral.toFixed(2).replace('.', ',')}).`);
        return;
      }
    }

    setErrorMsg('');
    onConfirmCheckout({
      tipoServico,
      mesaNumero: tipoServico === 'mesa' ? mesaNumero.trim() : undefined,
      endereco: tipoServico === 'entrega' ? endereco.trim() : undefined,
      formaPagamento: tipoServico === 'mesa' ? undefined : formaPagamento,
      telefone: tipoServico === 'mesa' ? undefined : telefone.trim(),
      trocoPara: (tipoServico !== 'mesa' && formaPagamento === 'Dinheiro' && needsTroco) ? trocoPara.trim() : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xs cursor-pointer transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Main Container */}
      <div className="relative bg-[#181818] border-2 border-brand-primary w-full max-w-lg rounded-3xl p-4 sm:p-6 shadow-[0_10px_40px_rgba(255,85,0,0.3)] z-10 text-white overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Glowing graphics */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl"></div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Header (Stay fixed at top) */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#222] shrink-0">
            <h3 className="font-display text-xl sm:text-2xl text-yellow-400 uppercase tracking-widest text-shadow-retro-small flex items-center gap-2">
              📍 Finalizar Pedido
            </h3>
            <button 
              type="button"
              onClick={onClose}
              className="p-1.5 px-3 text-xs font-bold bg-[#222] hover:bg-brand-primary hover:text-white rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0"
            >
              <X size={14} />
            </button>
          </div>

          {/* Scrollable Middle Container */}
          <div className="flex-1 overflow-y-auto pr-1.5 space-y-4 mb-4 min-h-0">
            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-xl text-xs text-red-300 font-sans">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Service Type Toggle Tabs */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide font-mono">
                Opção de Entrega / Consumo:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTipoServico('entrega');
                    setErrorMsg('');
                  }}
                  className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 border cursor-pointer ${tipoServico === 'entrega' ? 'bg-brand-primary text-white border-brand-primary shadow-lg' : 'bg-[#111] text-gray-400 border-[#333] hover:text-white'}`}
                >
                  <Truck size={18} />
                  <span>Entrega</span>
                  <span className="text-[9px] font-mono opacity-80">(+ R$ 6,00)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTipoServico('retirada');
                    setErrorMsg('');
                  }}
                  className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 border cursor-pointer ${tipoServico === 'retirada' ? 'bg-brand-primary text-white border-brand-primary shadow-lg' : 'bg-[#111] text-gray-400 border-[#333] hover:text-white'}`}
                >
                  <ShoppingBag size={18} />
                  <span>Retirada</span>
                  <span className="text-[9px] font-mono opacity-80">(Sem Taxa)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTipoServico('mesa');
                    setErrorMsg('');
                  }}
                  className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 border cursor-pointer ${tipoServico === 'mesa' ? 'bg-brand-primary text-white border-brand-primary shadow-lg' : 'bg-[#111] text-gray-400 border-[#333] hover:text-white'}`}
                >
                  <Utensils size={18} />
                  <span>Na Mesa</span>
                  <span className="text-[9px] font-mono opacity-80">(Sem Taxa)</span>
                </button>
              </div>
            </div>

            {/* Inputs list */}
            <div className="space-y-4">
              
              {/* Dynamic field for Delivery Address */}
              {tipoServico === 'entrega' && (
                <div className="animate-fadeIn">
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                    <MapPin size={14} className="text-brand-primary" />
                    Endereço Completo de Entrega:
                  </label>
                  <textarea
                    required
                    placeholder="Rua, número, bairro, apto, referências de entrega..."
                    className="w-full bg-[#111] border border-[#333] rounded-xl p-3 text-sm text-white focus:outline-hidden focus:border-brand-primary font-sans h-20 placeholder-gray-600 transition-all"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                  />
                </div>
              )}

              {/* Dynamic field for Table identification */}
              {tipoServico === 'mesa' && (
                <div className="animate-fadeIn p-4 bg-[#222]/30 border border-brand-secondary/30 rounded-2xl">
                  <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                    <Utensils size={14} className="text-yellow-400" />
                    Informe seu Nome:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sandro / Mesa 03"
                    className="w-full bg-[#111] border border-[#333] rounded-xl p-3 text-sm text-white focus:outline-hidden focus:border-brand-primary font-sans placeholder-gray-600 transition-all font-bold"
                    value={mesaNumero}
                    onChange={(e) => setMesaNumero(e.target.value)}
                  />
                  <p className="text-[10px] text-gray-400 mt-2 italic">
                    O pedido será preparado e servido com seu nome na mesa!
                  </p>
                </div>
              )}

              {/* Takeout pickup informational card */}
              {tipoServico === 'retirada' && (
                <div className="animate-fadeIn p-4 bg-gradient-to-r from-yellow-950/20 to-orange-950/10 border border-yellow-500/20 rounded-2xl text-xs text-yellow-100 font-sans">
                  🛍️ <strong>Retirada Balcão:</strong> Você receberá uma notificação do seu pedido pelo WhatsApp e poderá retirá-lo diretamente no balcão da Paty-Lanches assim que estiver pronto! Sem custos de envio.
                </div>
              )}

              {/* Phone, Payment Method, and Troco inputs - Hidden for "Mesa" */}
              {tipoServico !== 'mesa' && (
                <div className="space-y-4 pt-1 border-t border-[#222]/50 animate-fadeIn">
                  {/* Phone input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                      <Phone size={14} className="text-brand-primary" />
                      Telefone de Contato (com DDD):
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: (19) 98150-3977"
                      className="w-full bg-[#111] border border-[#333] rounded-xl p-3 text-sm text-white focus:outline-hidden focus:border-brand-primary font-sans placeholder-gray-600 transition-all"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                    />
                  </div>

                  {/* Payment selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                      <CreditCard size={14} className="text-brand-primary" />
                      Forma de Pagamento:
                    </label>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {(['PIX', 'Cartão', 'Dinheiro'] as const).map((method) => {
                        const isSelected = formaPagamento === method;
                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => {
                              setFormaPagamento(method);
                              setErrorMsg('');
                            }}
                            className={`py-2.5 rounded-xl text-sm font-bold uppercase transition-all tracking-wider cursor-pointer border ${isSelected ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/10' : 'bg-[#111] text-gray-400 border-[#333] hover:text-white'}`}
                          >
                            {method}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Change (Troco) options for Cash payment */}
                  {formaPagamento === 'Dinheiro' && (
                    <div className="p-4 bg-[#111] border border-[#222] rounded-2xl animate-fadeIn space-y-3">
                      <label className="flex items-center gap-2 text-sm text-gray-300 font-sans cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={needsTroco}
                          onChange={(e) => setNeedsTroco(e.target.checked)}
                          className="rounded border-[#333] accent-brand-primary h-4 w-4 animate-scaleUp"
                        />
                        <span>Precisa de Troco?</span>
                      </label>

                      {needsTroco && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-mono">Troco para quanto? R$</span>
                          <input
                            type="text"
                            required={needsTroco}
                            placeholder="Ex: 50,00"
                            className="bg-[#080808] border border-[#333] rounded-lg p-2 text-sm text-brand-secondary text-center w-24 focus:outline-hidden focus:border-brand-primary font-mono"
                            value={trocoPara}
                            onChange={(e) => setTrocoPara(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Subtotal summary and submission */}
          <div className="mt-6 border-t border-[#222] pt-4">
            <div className="space-y-1 mb-4 font-mono text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal dos itens:</span>
                <span className="text-white">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de Envio/Serviço:</span>
                <span className="text-brand-secondary">
                  {tipoServico === 'entrega' ? 'R$ 6,00' : 'Grátis'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#222] items-center">
                <span className="uppercase text-white font-bold">Total a Pagar:</span>
                <span className="font-display text-2xl text-yellow-400 text-shadow-retro-small font-normal">
                  R$ {totalGeral.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-[#333] hover:bg-[#222] text-gray-400 hover:text-white font-bold rounded-2xl transition-all cursor-pointer text-center text-sm"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-2 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 cursor-pointer text-sm"
              >
                Gerar Notinha
                <Send size={16} />
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
