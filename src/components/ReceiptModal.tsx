import React from 'react';
import { CartItem, CheckoutDetails } from '../types';
import { X, MessageSquare, Printer } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  checkoutDetails: CheckoutDetails | null;
  subtotal: number;
  onSendOrder: () => void;
}

export default function ReceiptModal({ isOpen, onClose, cart, checkoutDetails, subtotal, onSendOrder }: ReceiptModalProps) {
  if (!isOpen || !checkoutDetails) return null;

  const taxaEntrega = checkoutDetails.tipoServico === 'entrega' ? 6.00 : 0.00;
  const totalGeral = subtotal + taxaEntrega;

  // Render a classic retro receipt text representation
  const renderItemsReceipt = () => {
    return cart.map((item) => {
      const adicText = item.adicional ? ' (+Adicional R$6,00/unid.)' : '';
      const obsText = item.obs ? `\n   Obs: ${item.obs}` : '';
      return `${item.nome} x${item.qtd}${adicText}\n   = R$ ${(item.precoFinal * item.qtd).toFixed(2).replace('.', ',')}${obsText}`;
    }).join('\n\n');
  };

  // Safe parse of Change calculation
  let changeCalculatedText = '';
  if (checkoutDetails.formaPagamento === 'Dinheiro' && checkoutDetails.trocoPara) {
    const trocoVal = parseFloat(checkoutDetails.trocoPara.replace(',', '.'));
    if (!isNaN(trocoVal) && trocoVal > totalGeral) {
      const trocoDevolvido = trocoVal - totalGeral;
      changeCalculatedText = `\n🔄 PAGO COM: R$ ${trocoVal.toFixed(2).replace('.', ',')}\n🔄 DEVOLVER TROCO: R$ ${trocoDevolvido.toFixed(2).replace('.', ',')}`;
    } else {
      changeCalculatedText = `\n🔄 PAGO COM: R$ ${checkoutDetails.trocoPara}`;
    }
  }

  // Determine service details for receipt layout
  let serviceHeaderLabel = '';
  let serviceDetailContent = '';

  if (checkoutDetails.tipoServico === 'entrega') {
    serviceHeaderLabel = 'ENTREGA EM DOMICÍLIO';
    serviceDetailContent = `📍 ENDEREÇO DE ENTREGA:\n${checkoutDetails.endereco}`;
  } else if (checkoutDetails.tipoServico === 'mesa') {
    serviceHeaderLabel = `CLIENTE: ${checkoutDetails.mesaNumero}`;
    serviceDetailContent = `🍽️ LOCAL DE CONSUMO / NOME:\n${checkoutDetails.mesaNumero}\n(Serviço local sem taxa adicionada)`;
  } else {
    serviceHeaderLabel = 'PAPA-FILA RETIRADA (BALCÃO)';
    serviceDetailContent = `🛍️ OPÇÃO DE RETIRADA:\nCliente retira no balcão principal`;
  }

  const isMesa = checkoutDetails.tipoServico === 'mesa';
  const paymentSection = isMesa 
    ? '' 
    : `\n💳 PAGAMENTO: ${checkoutDetails.formaPagamento?.toUpperCase() || ''}${changeCalculatedText}\n------------------------------------`;

  const phoneSection = isMesa
    ? ''
    : `\n📞 TELEFONE PARA CONTATO:\n${checkoutDetails.telefone || ''}\n====================================`;

  const receiptContent = `====================================
      PATY-LANCHES - PEDIDO ONLINE
====================================
DATA: ${new Date().toLocaleDateString('pt-BR')}  HORA: ${new Date().toLocaleTimeString('pt-BR')}
TIPO: ${serviceHeaderLabel}
====================================
📋 ITENS DO PEDIDO:

${renderItemsReceipt()}

------------------------------------
💰 RESUMO FINANCEIRO:
Subtotal:       R$ ${subtotal.toFixed(2).replace('.', ',')}
Taxa de Envio:  R$ ${taxaEntrega.toFixed(2).replace('.', ',')}
TOTAL:          R$ ${totalGeral.toFixed(2).replace('.', ',')}
====================================${paymentSection}
${serviceDetailContent}
${phoneSection}
      AGUARDANDO CONFIRMAÇÃO
      MUITO OBRIGADO PELA PREFERÊNCIA!
====================================`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-xs cursor-pointer transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Main Container */}
      <div className="relative bg-[#181818] border-2 border-brand-primary w-full max-w-lg rounded-3xl p-6 shadow-[0_10px_40px_rgba(255,85,0,0.4)] z-10 text-white overflow-hidden max-h-[90vh] flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#222]">
            <h3 className="font-display text-2xl text-yellow-400 uppercase tracking-widest text-shadow-retro-small flex items-center gap-2">
              🧾 Notinha Fiscal Retro
            </h3>
            <button 
              onClick={onClose}
              className="p-1 px-3 text-xs font-bold bg-[#222] hover:bg-brand-primary hover:text-white rounded-full transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-gray-400 mb-3 font-sans">
            Confira o extrato do seu pedido antes de enviá-lo pelo WhatsApp para a Paty-Lanches:
          </p>

          {/* Monospace receipt box */}
          <div className="bg-[#fff9e6] text-[#222] border-2 border-[#ddd] p-5 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed shadow-inner max-h-[50vh] overflow-y-auto font-bold select-text tracking-tight shadow-black/10">
            {receiptContent}
          </div>
        </div>

        {/* Action Buttons footer */}
        <div className="mt-5 border-t border-[#222] pt-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[#333] hover:bg-[#222] text-gray-400 hover:text-white font-bold rounded-2xl transition-all cursor-pointer text-center text-xs"
          >
            Ajustar Pedido
          </button>
          <button
            onClick={onSendOrder}
            className="flex-2 py-3 bg-gradient-to-r from-green-600 to-emerald-500 hover:brightness-110 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 cursor-pointer text-sm"
          >
            <MessageSquare size={16} className="fill-white/10" />
            Enviar p/ WhatsApp
          </button>
        </div>

      </div>
    </div>
  );
}
