import React, { useState } from 'react';
import { MenuItem, CartItem } from '../types';
import { 
  ShieldCheck, 
  Plus, 
  RotateCcw, 
  X, 
  Lock, 
  Check, 
  ClipboardList, 
  Trash2, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  NotebookTabs,
  BadgeAlert
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
  onAddNewItem: (item: MenuItem) => void;
  onResetMenu: () => void;
  isAdmin: boolean;
  onAuthenticate: (password: string) => boolean;
  mesaOrders: {
    id: string;
    mesaNumero: string;
    items: CartItem[];
    total: number;
    hora: string;
    status: 'andamento' | 'pago';
  }[];
  onMarkAsPaid: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  
  // Caixa / Ledger / "Notinha Final" props
  caixaTotal: number;
  caixaTransactions: {
    id: string;
    valor: number;
    descricao: string;
    tipo: 'entrada' | 'saida' | 'pedido';
    hora: string;
  }[];
  onAddManualCaixa: (valor: number, descricao: string) => void;
  onSubManualCaixa: (valor: number, descricao: string) => void;
  onResetCaixa: () => void;
}

export default function AdminPanel({ 
  onClose, 
  onAddNewItem, 
  onResetMenu, 
  isAdmin, 
  onAuthenticate,
  mesaOrders,
  onMarkAsPaid,
  onDeleteOrder,
  caixaTotal,
  caixaTransactions,
  onAddManualCaixa,
  onSubManualCaixa,
  onResetCaixa
}: AdminPanelProps) {
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  
  // Custom navigation tab state
  const [activeTab, setActiveTab] = useState<'mesas' | 'produtos' | 'caixa_historico' | 'recuperar'>('mesas');
  
  // Table orders view sub-filter (active vs paid)
  const [orderFilter, setOrderFilter] = useState<'andamento' | 'pago' | 'todos'>('andamento');

  // Custom item states for adding products
  const [newNome, setNewNome] = useState('');
  const [newPreco, setNewPreco] = useState('');
  const [newIngredientes, setNewIngredientes] = useState('');
  const [newCategoria, setNewCategoria] = useState<'lanches' | 'porcoes' | 'hotdog' | 'pao_frances' | 'bebidas'>('lanches');
  
  // Manual transaction form states ("notinha final" additions & subtractions)
  const [opType, setOpType] = useState<'entrada' | 'saida' | null>(null);
  const [opValor, setOpValor] = useState('');
  const [opDescricao, setOpDescricao] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAuthenticate(password);
    if (!success) {
      setAuthError(true);
      setPassword('');
    } else {
      setAuthError(false);
    }
  };

  const handleAddNewItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome.trim() || !newPreco.trim() || !newIngredientes.trim()) {
      setErrorMsg('Preencha todos os campos do novo produto.');
      return;
    }

    const priceNum = parseFloat(newPreco.replace(',', '.'));
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Digite um preço numérico válido e maior que zero.');
      return;
    }

    const newItem: MenuItem = {
      nome: newNome.trim().toUpperCase(),
      preco: priceNum,
      ingredientes: newIngredientes.trim(),
      categoria: newCategoria
    };

    onAddNewItem(newItem);
    setSuccessMsg(`"${newItem.nome}" adicionado com sucesso ao cardápio!`);
    setErrorMsg('');
    
    // Clear fields
    setNewNome('');
    setNewPreco('');
    setNewIngredientes('');
    
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  // Submit manual operation inside "notinha final" (addition or subtraction of money)
  const handleCaixaOpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opValor.trim() || !opDescricao.trim()) {
      setErrorMsg('Preencha o valor e o motivo do lançamento.');
      return;
    }

    const valNum = parseFloat(opValor.replace(',', '.'));
    if (isNaN(valNum) || valNum <= 0) {
      setErrorMsg('Para lançar, o valor deve ser numérico e maior que zero.');
      return;
    }

    if (opType === 'entrada') {
      onAddManualCaixa(valNum, opDescricao.trim());
      setSuccessMsg(`Lançamento de ENTRADA no valor de R$ ${valNum.toFixed(2).replace('.', ',')} efetuado!`);
    } else {
      onSubManualCaixa(valNum, opDescricao.trim());
      setSuccessMsg(`Lançamento de SAÍDA no valor de R$ ${valNum.toFixed(2).replace('.', ',')} efetuado!`);
    }

    // Reset forms
    setOpValor('');
    setOpDescricao('');
    setOpType(null);
    setErrorMsg('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  // Calculate accumulated sum of active (unpaid) orders
  const totalMesasAtivas = mesaOrders
    .filter((o) => o.status === 'andamento')
    .reduce((sum, o) => sum + o.total, 0);

  // Filter orders according to selection
  const filteredOrders = mesaOrders.filter((order) => {
    if (orderFilter === 'todos') return true;
    return order.status === orderFilter;
  });

  // If NOT authenticated, show password screen
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/85 backdrop-blur-xs cursor-pointer" onClick={onClose}></div>

        <div className="relative bg-[#181818] border-2 border-brand-primary w-full max-w-sm rounded-[2.5rem] p-8 shadow-[0_10px_50px_rgba(255,85,0,0.3)] z-10 text-white flex flex-col justify-between">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="text-center">
              <div className="inline-flex p-3 bg-brand-primary/10 rounded-full border border-brand-primary/30 text-brand-primary mb-3">
                <Lock size={28} />
              </div>
              <h3 className="font-display text-2xl text-yellow-400 uppercase tracking-widest text-shadow-retro-small">
                Painel Administrativo
              </h3>
              <p className="text-xs text-gray-400 mt-1.5 font-sans">
                Insira os 4 últimos dígitos do WhatsApp de atendimento do local:
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-xl text-center text-xs text-red-300 font-sans">
                ❌ Senha incorreta! Tente novamente.
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide font-mono">
                Senha de Acesso:
              </label>
              <input
                type="password"
                required
                placeholder="••••"
                className="w-full bg-[#111] border border-[#333] rounded-2xl p-4 text-center text-xl text-yellow-300 font-mono tracking-widest focus:outline-hidden focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError(false);
                }}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-sm font-bold border border-[#222] hover:bg-[#222] rounded-2xl text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 text-sm font-bold bg-brand-primary hover:bg-brand-primary/95 hover:shadow-lg rounded-2xl transition-all cursor-pointer"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xs cursor-pointer animate-fadeIn" onClick={onClose}></div>

      {/* Main Panel Content Box */}
      <div className="relative bg-[#141414] border-2 border-brand-primary w-full max-w-2xl rounded-[2rem] p-6 shadow-[0_10px_50px_rgba(255,85,0,0.4)] z-10 text-white max-h-[92vh] overflow-hidden flex flex-col justify-between">
        
        {/* Fixed Title & Header */}
        <div className="shrink-0">
          <div className="flex justify-between items-center pb-3 border-b border-[#222] mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-green-500 shrink-0" size={24} />
              <h3 className="font-display text-2xl text-yellow-400 uppercase tracking-widest text-shadow-retro-small">
                Painel ADM Paty
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 px-3 text-xs font-bold bg-[#222] hover:bg-brand-primary hover:text-white rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Control Tabs */}
          <div className="grid grid-cols-4 gap-1.5 mb-4 bg-[#0a0a0a] p-1.5 rounded-2xl border border-[#222]">
            <button
              onClick={() => { setActiveTab('mesas'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 px-1 text-[10px] sm:text-xs font-bold uppercase transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1 ${activeTab === 'mesas' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <ClipboardList size={13} />
              <span>Pedidos</span>
            </button>

            <button
              onClick={() => { setActiveTab('caixa_historico'); setErrorMsg(''); setSuccessMsg(''); setOpType(null); }}
              className={`py-2 px-1 text-[10px] sm:text-xs font-bold uppercase transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1 ${activeTab === 'caixa_historico' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <NotebookTabs size={13} />
              <span>Livro Caixa</span>
            </button>

            <button
              onClick={() => { setActiveTab('produtos'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 px-1 text-[10px] sm:text-xs font-bold uppercase transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1 ${activeTab === 'produtos' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <Plus size={13} />
              <span>Cardápio</span>
            </button>

            <button
              onClick={() => { setActiveTab('recuperar'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 px-1 text-[10px] sm:text-xs font-bold uppercase transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1 ${activeTab === 'recuperar' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <RotateCcw size={13} />
              <span>Resetar</span>
            </button>
          </div>
        </div>

        {/* Scrollable Main Area depending on active Tab */}
        <div className="flex-1 overflow-y-auto pr-1.5 space-y-4 mb-4 min-h-0">
          
          {/* TAB 1: ALL ORDERS & TICKETS DASHBOARD */}
          {activeTab === 'mesas' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Notinha Final do Caixa & Saldo - MAIN FOCUS OF THE TASK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Glow Card: Caixa / Notinha Final */}
                <div className="bg-gradient-to-br from-[#101b15] to-[#040906] border-2 border-emerald-500/30 rounded-2.5xl p-4 flex flex-col justify-between shadow-xl shadow-black/35 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                  
                  <div>
                    <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest font-black block">
                      💵 NOTINHA FINAL DO CAIXA
                    </span>
                    <span className="text-[11px] text-gray-400 font-sans block mt-0.5 leading-normal">
                      Soma acumulada de todas as vendas e ajustes
                    </span>

                    <span className="font-display text-2xl sm:text-3xl text-emerald-400 font-bold block mt-2 text-shadow-retro-small whitespace-nowrap">
                      R$ {caixaTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  {/* Manual addition & subtraction controls */}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => setOpType(opType === 'entrada' ? null : 'entrada')}
                      className={`flex-1 py-1 px-2 text-[10px] font-black uppercase tracking-wider rounded-lg border-2 flex items-center justify-center gap-1 transition-colors cursor-pointer ${opType === 'entrada' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20 hover:bg-emerald-900/30'}`}
                    >
                      <ArrowUpRight size={12} className="stroke-[3]" />
                      <span>Adicionar</span>
                    </button>
                    <button
                      onClick={() => setOpType(opType === 'saida' ? null : 'saida')}
                      className={`flex-1 py-1 px-2 text-[10px] font-black uppercase tracking-wider rounded-lg border-2 flex items-center justify-center gap-1 transition-colors cursor-pointer ${opType === 'saida' ? 'bg-red-500 text-white border-red-400' : 'bg-red-950/40 text-red-300 border-red-500/20 hover:bg-red-900/30'}`}
                    >
                      <ArrowDownLeft size={12} className="stroke-[3]" />
                      <span>Retirar</span>
                    </button>
                  </div>
                </div>

                {/* Card: Active Tables pending summary */}
                <div className="bg-gradient-to-br from-[#1c1c1c] to-[#121212] border-2 border-yellow-500/20 rounded-2.5xl p-4 flex flex-col justify-between shadow-xl shadow-black/35 relative">
                  <div>
                    <span className="text-[10px] text-yellow-405 text-yellow-400 font-mono uppercase tracking-widest font-black block">
                      ⏳ PEDIDOS "EM ABERTO" NO LOCAL
                    </span>
                    <span className="text-[11px] text-gray-400 font-sans block mt-0.5 leading-normal">
                      Soma das mesas e balcões atualmente consumindo
                    </span>

                    <span className="font-display text-2xl sm:text-3xl text-yellow-400 font-bold block mt-2 whitespace-nowrap">
                      R$ {totalMesasAtivas.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="bg-[#191919] px-3 py-1.5 rounded-xl border border-white/5 mt-4 text-[10px] text-gray-500 font-mono leading-none">
                    Status operacional: Atendimento Normal
                  </div>
                </div>

              </div>

              {/* Inline layout form for quick ledger additions/subtractions */}
              {opType && (
                <form onSubmit={handleCaixaOpSubmit} className="p-4 bg-[#111] border-2 border-brand-primary/20 rounded-2.5xl space-y-3 animate-slideDown">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs font-black uppercase tracking-wider text-yellow-400 font-mono flex items-center gap-1.5">
                      {opType === 'entrada' ? (
                        <>
                          <ArrowUpRight size={14} className="text-emerald-400" />
                          Adicionar Dinheiro no Caixa (+)
                        </>
                      ) : (
                        <>
                          <ArrowDownLeft size={14} className="text-red-400" />
                          Retirar Dinheiro do Caixa (-)
                        </>
                      )}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setOpType(null)}
                      className="text-gray-500 hover:text-white text-xs"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[9px] text-gray-500 uppercase font-mono mb-1">Valor (R$)</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: 50,00"
                        className="w-full bg-[#1c1c1c] border border-[#2b2b2b] rounded-xl p-2 px-3 text-xs text-yellow-300 font-mono focus:outline-hidden focus:border-brand-primary font-bold placeholder-gray-700"
                        value={opValor}
                        onChange={(e) => setOpValor(e.target.value)}
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="block text-[9px] text-gray-500 uppercase font-mono mb-1">Motivo / Descrição</label>
                      <input
                        type="text"
                        required
                        placeholder={opType === 'entrada' ? 'Ex: Troco inicial para o dia' : 'Ex: Compra de saco de gelo'}
                        className="w-full bg-[#1c1c1c] border border-[#2b2b2b] rounded-xl p-2 px-3 text-xs text-white focus:outline-hidden focus:border-brand-primary font-sans font-medium placeholder-gray-700"
                        value={opDescricao}
                        onChange={(e) => setOpDescricao(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className={`text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl text-white transition-colors cursor-pointer ${opType === 'entrada' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}
                    >
                      Gravar Lançamento
                    </button>
                  </div>
                </form>
              )}

              {/* Status and operations alerts */}
              {successMsg && (
                <div className="p-3 bg-green-950/40 border border-green-500/50 rounded-xl text-xs text-green-300 font-sans">
                  ✅ {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-xl text-xs text-red-300 font-sans">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Filtering selector for table orders */}
              <div className="flex items-center justify-between border-b border-[#222] pb-2 font-sans font-medium text-xs">
                <span className="text-gray-400 uppercase font-mono tracking-wider">Notinhas/Pedidos ({filteredOrders.length})</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setOrderFilter('andamento')}
                    className={`py-1 px-3.5 rounded-full transition-all border cursor-pointer ${orderFilter === 'andamento' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30 font-bold font-mono text-[10px]' : 'bg-transparent text-gray-400 border-[#222] hover:text-white text-[10px]'}`}
                  >
                    Em Aberto
                  </button>
                  <button
                    onClick={() => setOrderFilter('pago')}
                    className={`py-1 px-3.5 rounded-full transition-all border cursor-pointer ${orderFilter === 'pago' ? 'bg-green-500/15 text-green-400 border-green-500/30 font-bold font-mono text-[10px]' : 'bg-transparent text-gray-400 border-[#222] hover:text-white text-[10px]'}`}
                  >
                    Pagos (PG)
                  </button>
                  <button
                    onClick={() => setOrderFilter('todos')}
                    className={`py-1 px-3.5 rounded-full transition-all border cursor-pointer ${orderFilter === 'todos' ? 'bg-[#222] text-white border-[#333] font-bold font-mono text-[10px]' : 'bg-transparent text-gray-400 border-[#222] hover:text-white text-[10px]'}`}
                  >
                    Todos
                  </button>
                </div>
              </div>

              {/* Render order cards list */}
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-gray-500 italic bg-[#111] rounded-2xl border border-[#222]/60">
                  Nenhum pedido ou mesa encontrado nesta visualização.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3.5 select-none">
                  {filteredOrders.map((order) => {
                    const isUnpaid = order.status === 'andamento';
                    return (
                      <div 
                        key={order.id} 
                        className={`p-4 rounded-2.5xl flex flex-col duration-200 border relative ${isUnpaid ? 'bg-[#1b1b1b]/80 border-[#333] hover:border-brand-primary/30' : 'bg-[#141414] border-[#222]/60 opacity-80'}`}
                      >
                        {/* Order identifier header */}
                        <div className="flex justify-between items-start mb-2.5">
                          <div>
                            <span className="block font-oswald text-base text-yellow-300 font-bold uppercase select-text">
                              👤 {order.mesaNumero}
                            </span>
                            <span className="text-[9px] text-gray-500 font-mono">
                              ⏱️ Registro do pedido às {order.hora}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 select-none">
                            <span className={`py-1 px-2.5 rounded-full text-[9px] font-black uppercase font-mono tracking-wider border ${isUnpaid ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-green-500/15 text-green-400 border-green-500/20'}`}>
                              {isUnpaid ? '● Em Aberto' : '✓ PG (Pago)'}
                            </span>
                            
                            <button
                              onClick={() => onDeleteOrder(order.id)}
                              title="Deletar este registro permanentemente"
                              className="p-1.5 text-gray-600 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Order food items */}
                        <div className="bg-[#0e0e0e]/90 rounded-2xl p-3 border border-[#222] text-xs font-sans text-gray-300 space-y-1.5 select-text mb-3">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-start border-b border-white/5 pb-1 lm-last-no-border">
                              <div>
                                <span className="font-bold text-gray-200">
                                  {it.nome} <span className="text-brand-secondary text-[10px]">x{it.qtd}</span>
                                </span>
                                {it.obs && (
                                  <span className="block text-[10px] text-gray-500 italic mt-0.5">
                                    Nota: "{it.obs}"
                                  </span>
                                )}
                                {it.adicional && (
                                  <span className="block text-[9px] text-yellow-600 font-bold font-mono uppercase mt-0.5">
                                    ➕ Adicional Especial (+R$6,00/unid.)
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-gray-400 shrink-0">
                                R$ {(it.precoFinal * it.qtd).toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Payment Settlement and aggregate price footer */}
                        <div className="flex justify-between items-center bg-[#0a0a0a]/40 p-1 px-2 rounded-xl mt-auto">
                          <div className="font-mono text-sm">
                            <span className="text-[10px] text-gray-500 uppercase font-mono tracking-wider font-bold font-mono">Resumo:</span>{' '}
                            <span className="text-yellow-400 font-bold select-text">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                          </div>

                          {isUnpaid ? (
                            <button
                              type="button"
                              onClick={() => onMarkAsPaid(order.id)}
                              className="py-1.5 px-3.5 bg-gradient-to-r from-emerald-700 to-green-600 hover:brightness-110 border border-green-500/20 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-lg shadow-emerald-705/10"
                            >
                              <Check size={12} className="stroke-[3]" />
                              <span>Finalizar Comanda</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-mono uppercase font-black py-1 px-2">
                              ✓ PG (Faturamento Somado ao Caixa)
                            </span>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: GENERAL CASH TRANSACTION HISTORY LOG (LIVRO CAIXA) */}
          {activeTab === 'caixa_historico' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b border-[#222]">
                <h4 className="font-oswald text-lg text-yellow-300 uppercase tracking-wider flex items-center gap-1.5">
                  <NotebookTabs size={18} className="text-emerald-500 animate-pulse" />
                  Livro Caixa / Histórico Completo
                </h4>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Atenção: isto zerará COMPLETAMENTE a notinha final do caixa do aplicativo e todo o histórico de transações de entradas/saídas do dia. Deseja prosseguir?')) {
                      onResetCaixa();
                      setSuccessMsg('Histórico do Caixa limpo e Saldo resetado para R$ 0,00!');
                    }
                  }}
                  className="py-1 px-3 text-[10px] bg-red-950/55 hover:bg-red-900 text-red-300 border border-red-500/20 hover:border-red-500/50 rounded-lg uppercase cursor-pointer tracking-wider font-mono font-bold transition-all"
                >
                  Zerar Caixa
                </button>
              </div>

              <div className="bg-[#111] border border-white/5 rounded-2.5xl p-4 flex items-center justify-between shadow-md">
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">Faturamento Consolidado do Dia</span>
                  <span className="text-[11px] text-gray-400 block max-w-sm font-sans leading-normal mt-0.5">Saldo real presente no caixa no exato momento</span>
                </div>
                <div className="px-4 py-2 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl">
                  <span className="font-display text-xl text-emerald-400 font-black">R$ {caixaTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {caixaTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500 italic bg-[#0a0a0a] rounded-2.5xl border border-[#222]/50 text-xs">
                  Sem registros de movimentações financeiras gravadas até o momento hoje.
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {caixaTransactions.map((tx) => (
                    <div 
                      key={tx.id} 
                      className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-colors duration-150 ${tx.tipo === 'saida' ? 'bg-red-950/15 border-red-500/10 hover:border-red-500/20' : tx.tipo === 'entrada' ? 'bg-emerald-950/15 border-emerald-500/10 hover:border-emerald-500/20' : 'bg-[#1b1b1b]/50 border-white/5 hover:border-white/10'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full border ${tx.tipo === 'saida' ? 'bg-red-500/10 text-red-400 border-red-500/20' : tx.tipo === 'entrada' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-950/40 text-green-400 border-green-500/20'}`}>
                          {tx.tipo === 'saida' ? (
                            <ArrowDownLeft size={14} className="stroke-[3]" />
                          ) : (
                            <ArrowUpRight size={14} className="stroke-[3]" />
                          )}
                        </div>

                        <div>
                          <span className="block font-sans text-gray-200 font-bold select-text">{tx.descricao}</span>
                          <span className="text-[10px] text-gray-500 font-mono tracking-wide">
                            ⏱️ {tx.hora} • {tx.tipo === 'pedido' ? 'Venda cardápio' : tx.tipo === 'entrada' ? 'Entrada manual' : 'Retirada manual'}
                          </span>
                        </div>
                      </div>

                      <span className={`font-mono text-sm font-black whitespace-nowrap select-text ${tx.tipo === 'saida' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {tx.tipo === 'saida' ? '-' : '+'} R$ {tx.valor.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: ORIGINAL MENU ITEMS LIST REGISTER FORM */}
          {activeTab === 'produtos' && (
            <div className="space-y-4 animate-fadeIn">
              
              <h4 className="font-oswald text-lg text-yellow-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-dashed border-[#222] pb-1">
                <Plus size={18} className="text-brand-primary" />
                Cadastrar Novo Hambúrguer ou Bebida
              </h4>

              {/* New item form */}
              <form onSubmit={handleAddNewItemSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-500 mb-1">
                      Nome do Item:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: X-CALABACON ESPECIAL"
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl p-3 text-sm text-white focus:outline-hidden focus:border-brand-primary transition-all uppercase placeholder-gray-600 font-sans font-bold"
                      value={newNome}
                      onChange={(e) => setNewNome(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-500 mb-1">
                      Preço Base (R$):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 34,50"
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl p-3 text-sm focus:outline-hidden focus:border-brand-primary transition-all text-yellow-300 font-mono placeholder-gray-600 font-bold"
                      value={newPreco}
                      onChange={(e) => setNewPreco(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-500 mb-1">
                      Categoria:
                    </label>
                    <select
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl p-3 text-sm focus:outline-hidden focus:border-brand-primary transition-all text-gray-300 font-sans uppercase font-bold text-shadow-none"
                      value={newCategoria}
                      onChange={(e) => setNewCategoria(e.target.value as any)}
                    >
                      <option value="lanches" className="bg-[#141414]">🍔 Lanches</option>
                      <option value="porcoes" className="bg-[#141414]">🍟 Porções</option>
                      <option value="hotdog" className="bg-[#141414]">🌭 Hotdogs</option>
                      <option value="pao_frances" className="bg-[#141414]">🥖 Pão Francês</option>
                      <option value="bebidas" className="bg-[#141414]">🥤 Bebidas</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-brand-primary/10"
                    >
                      Gravar Produto
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-500 mb-1">
                    Ingredientes / Descrição do Item:
                  </label>
                  <textarea
                    required
                    placeholder="Descreva todos os ingredientes do produto..."
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl p-3 text-sm focus:outline-hidden focus:border-brand-primary h-16 placeholder-gray-600 font-sans text-white font-bold"
                    value={newIngredientes}
                    onChange={(e) => setNewIngredientes(e.target.value)}
                  />
                </div>
              </form>

            </div>
          )}

          {/* TAB 4: BACKUP / RESET CARDAPIO */}
          {activeTab === 'recuperar' && (
            <div className="space-y-4 animate-fadeIn">
              
              <h4 className="font-oswald text-lg text-yellow-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-dashed border-[#222] pb-1">
                <RotateCcw size={18} className="text-red-500" />
                Zona de Recuperação do Cardápio
              </h4>

              <div className="p-4 bg-[#1f1614] border border-red-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <span className="block text-sm font-bold text-red-400 uppercase">Restaurar Valores Originais</span>
                  <span className="block text-xs text-gray-400 mt-0.5 max-w-sm font-sans leading-normal">
                    Esta ação apagará todos os novos produtos adicionados ou alterações de preços feitas, retornando ao cardápio padrão do app.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Tem certeza absoluta de que deseja redefinir o cardápio inteiro do aplicativo de volta aos valores padrão de fábrica?')) {
                      onResetMenu();
                      setSuccessMsg('Cardápio restaurado de volta aos padrões originais do Paty-Lanches!');
                    }
                  }}
                  className="py-2.5 px-4 bg-red-950 text-red-300 hover:bg-red-900 border border-red-500/30 hover:border-red-500/60 font-bold rounded-xl text-xs uppercase cursor-pointer transition-all shrink-0"
                >
                  Resetar Tudo
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Global Footer Block */}
        <div className="shrink-0 mt-2 border-t border-[#222] pt-3.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-[#262626] hover:bg-[#333] text-white font-mono font-bold rounded-xl text-xs uppercase tracking-wider transition-all focus:outline-hidden cursor-pointer flex items-center justify-center gap-2"
          >
            <Check size={14} className="stroke-[3]" />
            Salvar & Fechar Painel ADM
          </button>
        </div>

      </div>
    </div>
  );
}
