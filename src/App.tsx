import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MenuItem, 
  CartItem, 
  CheckoutDetails 
} from './types';
import { INITIAL_MENU_ITEMS } from './data';

// Import Custom Modular Components
import ItemCard from './components/ItemCard.tsx';
import CustomizeModal from './components/CustomizeModal.tsx';
import CartModal from './components/CartModal.tsx';
import CheckoutModal from './components/CheckoutModal.tsx';
import ReceiptModal from './components/ReceiptModal.tsx';
import AdminPanel from './components/AdminPanel.tsx';

// Icons
import { 
  Phone, 
  Search, 
  ShoppingBag, 
  RotateCcw, 
  SlidersHorizontal, 
  ArrowLeft,
  Flame,
  CheckCircle2,
  Clock,
  MapPin,
  UtensilsCrossed,
  Sparkles,
  Lock,
  ShieldCheck,
  Trash2,
  Check,
  Plus,
  DollarSign,
  ClipboardList,
  X
} from 'lucide-react';

export default function App() {
  // Menu list state (initialized from localStorage when possible or original template)
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const rawSaved = localStorage.getItem('PATY_LANCHES_MENU');
    if (rawSaved) {
      try {
        return JSON.parse(rawSaved);
      } catch (err) {
        console.error('Error parsing PATY_LANCHES_MENU', err);
      }
    }
    return INITIAL_MENU_ITEMS;
  });

  // Cart state (initialized from localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const rawSaved = localStorage.getItem('PATY_LANCHES_CART');
    if (rawSaved) {
      try {
        return JSON.parse(rawSaved);
      } catch (err) {
        console.error('Error parsing PATY_LANCHES_CART', err);
      }
    }
    return [];
  });

  // Navigation and Search states
  const [activeCategory, setActiveCategory] = useState<'home' | 'lanches' | 'porcoes' | 'hotdog' | 'pao_frances' | 'bebidas'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & customizing states
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails | null>(null);

  // Admin authentication states
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Custom inline price editing states
  const [priceEditingItem, setPriceEditingItem] = useState<MenuItem | null>(null);
  const [priceEditingPassword, setPriceEditingPassword] = useState('');
  const [priceEditingNewVal, setPriceEditingNewVal] = useState('');
  const [priceEditingCategory, setPriceEditingCategory] = useState<'lanches' | 'pao_frances' | 'porcoes' | 'hotdog' | 'bebidas'>('lanches');
  const [priceEditingError, setPriceEditingError] = useState('');

  // Custom inline new snack adding states
  const [isAddLancheOpen, setIsAddLancheOpen] = useState(false);
  const [addLancheNome, setAddLancheNome] = useState('');
  const [addLanchePreco, setAddLanchePreco] = useState('');
  const [addLancheIngredientes, setAddLancheIngredientes] = useState('');
  const [addLancheCategoria, setAddLancheCategoria] = useState<'lanches' | 'pao_frances' | 'porcoes' | 'hotdog' | 'bebidas'>('lanches');
  const [addLancheError, setAddLancheError] = useState('');

  // Homepage Admin States
  const [homeAdminPassword, setHomeAdminPassword] = useState('');
  const [homeAdminError, setHomeAdminError] = useState(false);
  const [homeOrderFilter, setHomeOrderFilter] = useState<'andamento' | 'pago' | 'todos'>('andamento');

  // Active Table Orders state
  const [mesaOrders, setMesaOrders] = useState<{
    id: string;
    mesaNumero: string;
    items: CartItem[];
    total: number;
    hora: string;
    status: 'andamento' | 'pago';
  }[]>(() => {
    const raw = localStorage.getItem('PATY_LANCHES_MESA_ORDERS');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error parsing PATY_LANCHES_MESA_ORDERS', err);
      }
    }
    return [];
  });

  // Persistent Cashier Ledger ("Notinha Final") state
  const [caixaTotal, setCaixaTotal] = useState<number>(() => {
    const raw = localStorage.getItem('PATY_LANCHES_CAIXA_TOTAL');
    return raw ? parseFloat(raw) : 0;
  });

  const [caixaTransactions, setCaixaTransactions] = useState<{
    id: string;
    valor: number;
    descricao: string;
    tipo: 'entrada' | 'saida' | 'pedido';
    hora: string;
  }[]>(() => {
    const raw = localStorage.getItem('PATY_LANCHES_CAIXA_TRANSACTIONS');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error parsing PATY_LANCHES_CAIXA_TRANSACTIONS', err);
      }
    }
    return [];
  });

  // Sync state data to localStorage
  useEffect(() => {
    localStorage.setItem('PATY_LANCHES_MENU', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('PATY_LANCHES_CART', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('PATY_LANCHES_MESA_ORDERS', JSON.stringify(mesaOrders));
  }, [mesaOrders]);

  useEffect(() => {
    localStorage.setItem('PATY_LANCHES_CAIXA_TOTAL', caixaTotal.toString());
  }, [caixaTotal]);

  useEffect(() => {
    localStorage.setItem('PATY_LANCHES_CAIXA_TRANSACTIONS', JSON.stringify(caixaTransactions));
  }, [caixaTransactions]);

  // Total quantity calculation for Floating Card Badges
  const cartItemCount = cart.reduce((total, item) => total + item.qtd, 0);
  
  // Total prices subtotal
  const cartSubtotal = cart.reduce((total, item) => total + (item.precoFinal * item.qtd), 0);

  // Filtering menu items depending on dynamic categories and searches
  const filteredMenuItems = menu.filter((item) => {
    const matchesCategory = activeCategory === 'home' || item.categoria === activeCategory;
    const matchesSearch = item.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.ingredientes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // NAVIGATION helpers
  const handleSelectCategory = (cat: 'lanches' | 'porcoes' | 'hotdog' | 'pao_frances' | 'bebidas') => {
    setActiveCategory(cat);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setActiveCategory('home');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CART events
  const handleOpenCustomize = (item: MenuItem) => {
    setSelectedItem(item);
    setIsCustomizeOpen(true);
  };

  const handleConfirmAddCart = (item: MenuItem, obs: string, adicional: boolean) => {
    const precoFinal = item.preco + (adicional ? 6.00 : 0.00);
    // Distinct key combination (Name + notes + extra flag)
    const cartId = `${item.nome}-${obs}-${adicional ? 'yes' : 'no'}`;

    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === cartId);
      if (existingIdx > -1) {
        // Increment quantity if exact config matches
        const newCart = [...prev];
        newCart[existingIdx].qtd += 1;
        return newCart;
      } else {
        // Create a fresh config item
        const newItem: CartItem = {
          id: cartId,
          nome: item.nome,
          precoBase: item.preco,
          precoFinal,
          obs,
          adicional,
          qtd: 1,
          categoria: item.categoria
        };
        return [...prev, newItem];
      }
    });

    setIsCustomizeOpen(false);
    setSelectedItem(null);
  };

  const handleUpdateQtd = (id: string, delta: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const nextQtd = item.qtd + delta;
          return nextQtd > 0 ? { ...item, qtd: nextQtd } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // CHECKOUT orchestration
  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleConfirmCheckoutDetails = (details: CheckoutDetails) => {
    setCheckoutDetails(details);
    setIsCheckoutOpen(false);
    setIsReceiptOpen(true);
  };

  const handleSendOrderToWhatsApp = () => {
    if (!checkoutDetails) return;

    // Build perfect aesthetic message template with emoji styling
    let itemMessage = '';
    cart.forEach((item) => {
      const obsStr = item.obs ? ` (Obs: ${item.obs})` : '';
      const additionalStr = item.adicional ? ' *[+ Adicional R$6,00/unid]*' : '';
      itemMessage += `- *${item.nome}* x${item.qtd}${obsStr}${additionalStr} = R$ ${(item.precoFinal * item.qtd).toFixed(2).replace('.', ',')}\n`;
    });

    const subtotalStr = cartSubtotal.toFixed(2).replace('.', ',');
    const taxaEntrega = checkoutDetails.tipoServico === 'entrega' ? 6.00 : 0.00;
    const taxaStr = taxaEntrega === 0 ? 'Grátis' : 'R$ 6,00';
    const totalFinalStr = (cartSubtotal + taxaEntrega).toFixed(2).replace('.', ',');
    
    let changeMsg = '';
    if (checkoutDetails.formaPagamento === 'Dinheiro' && checkoutDetails.trocoPara) {
      changeMsg = `\n🔄 *Troco para:* R$ ${checkoutDetails.trocoPara}`;
    }

    // Dynamic service info blocks inside WhatsApp string representation
    let servicoText = '';
    if (checkoutDetails.tipoServico === 'entrega') {
      servicoText = `🚚 *Tipo de Serviço:* ENTREGA EM DOMICÍLIO\n📍 *Endereço de Entrega:* ${checkoutDetails.endereco}`;
    } else if (checkoutDetails.tipoServico === 'mesa') {
      servicoText = `🍽️ *Tipo de Serviço:* MESA (CONSUMO NO LOCAL)\n👤 *Cliente / Mesa:* ${checkoutDetails.mesaNumero}`;
    } else {
      servicoText = `🛍️ *Tipo de Serviço:* RETIRADA NO BALCÃO\n🛍️ *Instrução:* Aguardar notificação de pronto para retirar`;
    }

    const whatsappText = `🍔 *NOVO PEDIDO - PATY LANCHES* 🍔
----------------------------------
📋 *ITENS DO PEDIDO:*
${itemMessage}
----------------------------------
💰 *Subtotal:* R$ ${subtotalStr}
🚚 *Taxa de Entrega:* ${taxaStr}
💵 *TOTAL FINAL:* R$ ${totalFinalStr}

💳 *Pagamento:* ${checkoutDetails.formaPagamento}${changeMsg}
${servicoText}
📞 *Telefone Contato:* ${checkoutDetails.telefone}

==================================
_Enviado pelo aplicativo oficial_`;

    const cleanPhone = '5519981503977';
    const finalUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappText)}`;
    
    // Launch Web link redirect
    window.open(finalUrl, '_blank');

    // Save to active orders list as dynamic, individual tickets (notinhas)
    const label = checkoutDetails.tipoServico === 'mesa' 
      ? `Mesa: ${checkoutDetails.mesaNumero || 'Geral'}`
      : checkoutDetails.tipoServico === 'entrega'
        ? `🚚 Entrega - ${checkoutDetails.telefone || 'Cliente'}`
        : `🛍️ Retirada - ${checkoutDetails.telefone || 'Cliente'}`;

    // Reusing the outermost taxaEntrega value to compute total ticket amount
    const ticketTaxaExtra = checkoutDetails.tipoServico === 'entrega' ? 6.00 : 0.00;

    const newMesaOrder = {
      id: Date.now().toString(),
      mesaNumero: label,
      items: [...cart],
      total: cartSubtotal + ticketTaxaExtra,
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'andamento' as 'andamento' | 'pago'
    };
    setMesaOrders((prev) => [newMesaOrder, ...prev]);

    // Wipe cart and states
    setCart([]);
    setCheckoutDetails(null);
    setIsReceiptOpen(false);
    setActiveCategory('home');
    alert('Pedido enviado com sucesso para o WhatsApp da Paty-Lanches! Agradecemos a preferência.');
  };

  // ADMIN credentials & adjustments
  const handleAuthenticateAdmin = (password: string) => {
    if (password === '3977') {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleHomeAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeAdminPassword.trim() === '3977') {
      setIsAdminAuthenticated(true);
      setHomeAdminError(false);
      setHomeAdminPassword('');
    } else {
      setHomeAdminError(true);
      setHomeAdminPassword('');
    }
  };

  const handleMarkMesaOrderAsPaid = (orderId: string) => {
    setMesaOrders((prev) => {
      const target = prev.find(o => o.id === orderId);
      if (target && target.status === 'andamento') {
        const orderTotal = target.total;
        
        // Add order total value to the Cashier Ledger ("notinha final")
        setCaixaTotal((current) => current + orderTotal);

        // Append to history list
        setCaixaTransactions((txs) => {
          const newTx = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
            valor: orderTotal,
            descricao: `Faturamento - ${target.mesaNumero}`,
            tipo: 'pedido' as const,
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          };
          return [newTx, ...txs];
        });
      }
      
      return prev.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: 'pago' };
        }
        return order;
      });
    });
  };

  const handleDeleteMesaOrder = (orderId: string) => {
    if (confirm('Deseja apagar permanentemente este registro de pedido?')) {
      setMesaOrders((prev) => prev.filter((order) => order.id !== orderId));
    }
  };

  // Cashier manual ledger controllers ("notinha final" additions & subtractions)
  const handleAddManualCaixa = (valor: number, descricao: string) => {
    setCaixaTotal((current) => current + valor);
    setCaixaTransactions((txs) => {
      const newTx = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
        valor,
        descricao: descricao || 'Aporte / Entrada manual',
        tipo: 'entrada' as const,
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      return [newTx, ...txs];
    });
  };

  const handleSubManualCaixa = (valor: number, descricao: string) => {
    setCaixaTotal((current) => current - valor);
    setCaixaTransactions((txs) => {
      const newTx = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
        valor,
        descricao: descricao || 'Retirada / Saída manual',
        tipo: 'saida' as const,
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      return [newTx, ...txs];
    });
  };

  const handleResetCaixa = () => {
    setCaixaTotal(0);
    setCaixaTransactions([]);
  };

  const handleEditPriceInline = (item: MenuItem) => {
    setPriceEditingItem(item);
    setPriceEditingNewVal(item.preco.toFixed(2).replace('.', ','));
    setPriceEditingCategory(item.categoria);
    setPriceEditingPassword('');
    setPriceEditingError('');
  };

  const handlePriceEditSubmitFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceEditingItem) return;

    // 1. Password checking if not authenticated
    if (!isAdminAuthenticated) {
      if (priceEditingPassword !== '3977') {
        setPriceEditingError('❌ Senha incorreta! Tente novamente.');
        return;
      }
      setIsAdminAuthenticated(true);
      setPriceEditingError('');
      // Keep modal open, next render will show price input field
      return;
    }

    // 2. Validate and apply the new price
    const parsedPrice = parseFloat(priceEditingNewVal.replace(',', '.'));
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setPriceEditingError('⚠️ Digite um preço válido e maior que zero (Ex: 27,50).');
      return;
    }

    setMenu((prev) => {
      return prev.map((m) => {
        if (m.nome === priceEditingItem.nome) {
          return { ...m, preco: parsedPrice, categoria: priceEditingCategory };
        }
        return m;
      });
    });

    // Close modal
    setPriceEditingItem(null);
    setPriceEditingPassword('');
    setPriceEditingNewVal('');
    setPriceEditingError('');
  };

  const handleInlineAddLancheSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addLancheNome.trim() || !addLanchePreco.trim() || !addLancheIngredientes.trim()) {
      setAddLancheError('⚠️ Por favor, preencha todos os campos do novo lanche.');
      return;
    }

    const priceNum = parseFloat(addLanchePreco.replace(',', '.'));
    if (isNaN(priceNum) || priceNum <= 0) {
      setAddLancheError('⚠️ Digite um preço numérico válido e maior que zero (Ex: 27,50).');
      return;
    }

    const newItem: MenuItem = {
      nome: addLancheNome.trim().toUpperCase(),
      preco: priceNum,
      ingredientes: addLancheIngredientes.trim(),
      categoria: addLancheCategoria
    };

    setMenu((prev) => [newItem, ...prev]);

    // Close modal & clear state
    setIsAddLancheOpen(false);
    setAddLancheNome('');
    setAddLanchePreco('');
    setAddLancheIngredientes('');
    setAddLancheCategoria('lanches');
    setAddLancheError('');
  };

  const handleAddNewItemAdmin = (newItem: MenuItem) => {
    setMenu((prev) => [newItem, ...prev]);
  };

  const handleResetMenuAdmin = () => {
    setMenu(INITIAL_MENU_ITEMS);
    localStorage.removeItem('PATY_LANCHES_MENU');
  };

  return (
    <div className="min-height-screen bg-brand-dark flex flex-col justify-between font-sans relative pb-24 text-gray-100 selection:bg-brand-primary selection:text-white">
      
      {/* ================= HEADER BRAND BAR ================= */}
      <header className="sticky top-0 z-40 bg-brand-dark/95 backdrop-blur-md border-b border-[#222] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Title area */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div onClick={handleBackToHome} className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-display text-lg sm:text-xl shadow-lg shadow-brand-primary/20 transform group-hover:rotate-12 transition-all shrink-0">
                🍔
              </div>
              <div>
                <h1 className="font-display text-xl sm:text-2xl text-yellow-400 group-hover:text-yellow-300 transition-colors uppercase tracking-widest text-shadow-retro-small whitespace-nowrap">
                  Paty-Lanches
                </h1>
                <p className="text-[9px] sm:text-[10px] text-brand-secondary font-mono tracking-wider -mt-1 uppercase hidden xs:block">
                  Estilo Food-Truck • Lanchonete de Bairro
                </p>
              </div>
            </div>

            {/* ADM Quick Entry badge next to the title */}
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              title={isAdminAuthenticated ? 'Painel ADM Ativo' : 'Acessar Modo Admin / Dono'}
              className={`ml-1 py-1 px-2.5 rounded-lg border text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                isAdminAuthenticated 
                  ? 'bg-green-950/40 text-green-400 border-green-500/40' 
                  : 'bg-[#1a1a1a] text-yellow-500 border-yellow-500/20 hover:text-brand-primary hover:border-brand-primary/40'
              }`}
            >
              <ShieldCheck size={12} className={isAdminAuthenticated ? 'animate-pulse' : ''} />
              <span>ADM</span>
            </button>
          </div>

          {/* Quick contact / Admin controls */}
          <div className="flex items-center gap-3">
            
            {/* Quick call */}
            <a 
              href="tel:19981503977" 
              className="hidden sm:flex items-center gap-2 py-2 px-4 bg-[#232323] hover:bg-[#333] border border-[#333] text-sm font-semibold rounded-2xl transition-all cursor-pointer text-brand-secondary"
            >
              <Phone size={14} className="animate-bounce" />
              <span className="font-mono">(19) 98150-3977</span>
            </a>

            {/* Admin Key Lock Toggle */}
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              title={isAdminAuthenticated ? 'Painel de Gerenciamento Ativo' : 'Entrar no Modo Admin'}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${isAdminAuthenticated ? 'bg-green-950/20 text-green-400 border-green-500/30' : 'bg-[#1a1a1a] text-gray-400 border-[#2b2b2b] hover:text-brand-primary'}`}
            >
              <Lock size={16} className={isAdminAuthenticated ? 'animate-pulse' : ''} />
            </button>

            {/* Active cart trigger button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary border border-transparent text-white shadow-lg shadow-brand-primary/20 hover:brightness-110 cursor-pointer transition-all active:scale-95"
            >
              <ShoppingBag size={18} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 border border-white text-white font-bold text-[10px] rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* ================= MAIN WRAPPER ================= */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <AnimatePresence mode="wait">
          
          {/* 1. HOME SCREEN VIEW */}
          {activeCategory === 'home' ? (
            <motion.div
              key="homePage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* Hero Banner Grid Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#1c1c1c] bg-[#111] bg-cover bg-center">
                
                {/* Hero banner photo */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src="/src/assets/images/paty_lanches_hero_1780917141578.png" 
                    alt="Premium Burger Paty Lanches" 
                    className="w-full h-full object-cover opacity-45 brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle red/yellow lighting gradients overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/20 via-transparent to-brand-dark/20"></div>
                </div>

                {/* Hero text overlay container */}
                <div className="relative z-10 px-6 py-12 md:py-20 lg:px-12 max-w-3xl flex flex-col justify-center text-left">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-brand-primary text-white font-bold text-xs uppercase tracking-wider mb-5 w-fit shadow-md animate-pulse">
                    <Flame size={12} fill="white" />
                    Bateu Aquela Fome?
                  </div>

                  <h2 className="font-display text-4xl sm:text-6xl text-yellow-400 leading-none uppercase tracking-wider text-shadow-retro">
                    Todos Feitos <br />na Hora!
                  </h2>
                  
                  <p className="font-sans text-base sm:text-lg text-gray-300 mt-4 leading-relaxed max-w-xl">
                    Ingredientes frescos e de altíssima qualidade. O verdadeiro e tradicional sabor de lanchonete paulista na chapa quente! 
                  </p>

                  {/* Trust factors panel */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-[#333]/50">
                    <div className="flex items-center gap-2 text-xs text-yellow-200 uppercase font-mono font-bold tracking-tight">
                      <CheckCircle2 size={16} className="text-brand-secondary shrink-0" />
                      Carne Selecionada
                    </div>
                    <div className="flex items-center gap-2 text-xs text-yellow-200 uppercase font-mono font-bold tracking-tight">
                      <CheckCircle2 size={16} className="text-brand-secondary shrink-0" />
                      Legumes Frescos
                    </div>
                    <div className="flex items-center gap-2 text-xs text-yellow-200 uppercase font-mono font-bold tracking-tight">
                      <CheckCircle2 size={16} className="text-brand-secondary shrink-0" />
                      Molhos Especiais
                    </div>
                  </div>

                </div>
              </div>

              {/* Direct call action section for WhatsApp */}
              <div className="p-4 bg-gradient-to-r from-green-950/20 to-emerald-950/20 border-2 border-green-500/20 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-center sm:text-left">
                <div className="flex items-center gap-4 flex-col sm:flex-row">
                  <div className="p-4 bg-green-500/10 rounded-2xl text-green-400">
                    <Phone className="animate-bounce" size={28} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-mono font-bold text-green-400 tracking-widest">Faça seu pedido diretamente</span>
                    <span className="block font-display text-2xl text-white uppercase tracking-wider">Entregas Rápidas no Telefone:</span>
                  </div>
                </div>

                <a 
                  href="https://wa.me/5519981503977" 
                  target="_blank" 
                  rel="noreferrer"
                  className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 hover:brightness-110 hover:scale-105 active:scale-95 text-white font-bold font-oswald text-xl tracking-wider uppercase transition-all shadow-md shadow-green-600/10 cursor-pointer"
                >
                  📞 (19) 98150-3977
                </a>
              </div>

              {/* Category buttons selection grid */}
              <div className="space-y-4">
                <h3 className="font-oswald text-2xl text-yellow-400 uppercase tracking-widest text-shadow-retro-small border-b border-[#222] pb-1.5 flex items-center gap-2">
                  <UtensilsCrossed size={18} className="text-brand-primary" />
                  Navegar pelo Cardápio
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { id: 'lanches', label: 'Lanches', icon: '🍔', desc: 'Hambúrgueres & Baurus' },
                    { id: 'porcoes', label: 'Porções', icon: '🍟', desc: 'Batatas & Carnes fatiadas' },
                    { id: 'hotdog', label: 'Hotdogs', icon: '🌭', desc: 'Cachorros Quentes recheados' },
                    { id: 'pao_frances', label: 'Pão Francês', icon: '🥖', desc: 'Mistos & Prensados clássicos' },
                    { id: 'bebidas', label: 'Bebidas', icon: '🥤', desc: 'Refrigerantes & Cervejas' }
                  ].map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleSelectCategory(category.id as any)}
                      className="group p-5 bg-[#171717] hover:bg-[#222] border-2 border-[#2b2b2b] hover:border-brand-secondary rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-secondary/5 cursor-pointer"
                    >
                      <span className="text-4xl mb-3 transform group-hover:scale-115 transition-transform" role="img" aria-label={category.label}>
                        {category.icon}
                      </span>
                      <span className="block font-display text-lg text-yellow-400 uppercase tracking-wider group-hover:text-yellow-300">
                        {category.label}
                      </span>
                      <span className="block text-[11px] text-gray-500 mt-1 max-w-xs font-sans">
                        {category.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ================= HIGH-FIDELITY HOMEPAGE ADMIN PORTAL (Dono da Lanchonete) ================= */}
              {false && (
              <div className="p-6 bg-gradient-to-b from-[#131313] to-[#0a0a0a] border-2 border-brand-primary/30 rounded-3.5xl shadow-2xl relative overflow-hidden select-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl"></div>
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#222] pb-4 mb-5">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="text-yellow-400 shrink-0 animate-pulse" size={24} />
                    <div>
                      <h4 className="font-display text-xl sm:text-2xl text-yellow-400 uppercase tracking-widest text-shadow-retro-small">
                        Painel do Dono • ADM
                      </h4>
                      <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wide">
                        Gerenciador de Pedidos Locais das Mesas
                      </p>
                    </div>
                  </div>
                  
                  {/* Floating running totals - only visible when authenticated - sum of values in the corner */}
                  {isAdminAuthenticated && (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {/* Caixa Balance (Notinha Final) */}
                      <div className="bg-[#0b140f] border border-emerald-500/30 py-1.5 px-3 rounded-xl flex items-center gap-2 select-text">
                        <span className="text-[9px] sm:text-[10px] text-emerald-400 font-mono font-bold uppercase">Caixa:</span>
                        <span className="font-mono text-xs sm:text-sm font-black text-emerald-400">
                          R$ {caixaTotal.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      {/* Mesa Active / Outstanding Orders */}
                      <div className="bg-[#1c1c1c] border border-yellow-500/20 py-1.5 px-3 rounded-xl flex items-center gap-2 select-text">
                        <span className="text-[9px] sm:text-[10px] text-gray-400 font-mono uppercase">Em Aberto:</span>
                        <span className="font-mono text-xs sm:text-sm font-black text-yellow-400">
                          R$ {mesaOrders.filter(o => o.status === 'andamento').reduce((sum, o) => sum + o.total, 0).toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      <button
                        onClick={() => setIsAdminPanelOpen(true)}
                        className="py-1.5 px-2.5 bg-brand-primary text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer hover:brightness-110 active:scale-95 transition-all select-none flex items-center gap-1 shrink-0"
                      >
                        <span>Gerenciar Caixa</span>
                      </button>
                    </div>
                  )}
                </div>

                {!isAdminAuthenticated ? (
                  /* 1. LOGIN PROMPT ON HOME PAGE */
                  <div className="space-y-4">
                    <p className="text-xs text-gray-400 max-w-xl font-sans leading-relaxed">
                      Área exclusiva do proprietário da Paty-Lanches. Insira os 4 últimos dígitos do WhatsApp de atendimento para monitorar e zerar as mesas do local:
                    </p>
                    
                    {homeAdminError && (
                      <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-xs text-red-300 font-sans max-w-sm">
                        ❌ Senha incorreta! Digite os 4 últimos dígitos do fone (3977).
                      </div>
                    )}

                    <form onSubmit={handleHomeAdminAuthSubmit} className="flex flex-wrap items-center gap-3">
                      <input 
                        type="password" 
                        placeholder="Ex: 3977"
                        className="bg-[#0b0b0b] border border-[#2b2b2b] placeholder-gray-600 rounded-xl p-3 text-center text-sm font-mono tracking-widest text-yellow-300 w-44 focus:outline-hidden focus:border-brand-primary transition-all font-bold"
                        value={homeAdminPassword}
                        onChange={(e) => {
                          setHomeAdminPassword(e.target.value);
                          setHomeAdminError(false);
                        }}
                      />
                      <button 
                        type="submit" 
                        className="py-3 px-6 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-brand-primary/10 transition-all cursor-pointer active:scale-97"
                      >
                        Desbloquear Painel
                      </button>
                    </form>
                  </div>
                ) : (
                  /* 2. LIVE INTERACTIVE PANEL ON HOME PAGE */
                  <div className="space-y-5">
                    
                    {/* Running filter selectors */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-[#222]/50">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="text-brand-secondary animate-pulse" size={16} />
                        <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest">
                          Mapeamento Ativo ({mesaOrders.filter(o => o.status === homeOrderFilter).length} Pedidos)
                        </span>
                      </div>
                      
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => setHomeOrderFilter('andamento')}
                          className={`py-1 px-3.5 rounded-full transition-all border cursor-pointer font-bold ${homeOrderFilter === 'andamento' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-xs' : 'bg-transparent text-gray-400 border-[#222] hover:text-white'}`}
                        >
                          Em Aberto / Na Mesa
                        </button>
                        <button
                          onClick={() => setHomeOrderFilter('pago')}
                          className={`py-1 px-3.5 rounded-full transition-all border cursor-pointer font-bold ${homeOrderFilter === 'pago' ? 'bg-green-500/15 text-green-400 border-green-500/30' : 'bg-transparent text-gray-400 border-[#222] hover:text-white'}`}
                        >
                          Pagos (PG)
                        </button>
                        <button
                          onClick={() => setHomeOrderFilter('todos')}
                          className={`py-1 px-3.5 rounded-full transition-all border cursor-pointer font-bold ${homeOrderFilter === 'todos' ? 'bg-[#222] text-white border-[#333]' : 'bg-transparent text-gray-400 border-[#222] hover:text-white'}`}
                        >
                          Todos
                        </button>
                      </div>
                    </div>

                    {/* Table orders elements layout list */}
                    {mesaOrders.filter(o => homeOrderFilter === 'todos' ? true : o.status === homeOrderFilter).length === 0 ? (
                      <div className="p-8 text-center text-gray-500 italic bg-[#0a0a0a] rounded-2xl border border-[#222]/50 text-xs">
                        Nenhum pedido de mesa registrado neste status.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mesaOrders
                          .filter(o => homeOrderFilter === 'todos' ? true : o.status === homeOrderFilter)
                          .map((order) => {
                            const isUnpaid = order.status === 'andamento';
                            return (
                              <div 
                                key={order.id} 
                                className={`p-4 rounded-2xl border flex flex-col justify-between transition-all duration-205 ${isUnpaid ? 'bg-[#1b1b1b]/90 border-[#333] hover:border-brand-primary/30' : 'bg-[#121212] border-[#222]/60 opacity-80'}`}
                              >
                                
                                {/* Info block */}
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start gap-2 mb-2">
                                    <div>
                                      <span className="block font-oswald text-base text-yellow-300 font-bold uppercase select-text">
                                        👤 {order.mesaNumero}
                                      </span>
                                      <span className="text-[9px] text-gray-500 font-mono block">
                                        ⏱️ Recebido às {order.hora}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1.5 shrink-0 select-none">
                                      <span className={`py-0.5 px-2 rounded-full text-[8px] font-black uppercase font-mono tracking-wider border ${isUnpaid ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-green-500/15 text-green-400 border-green-500/20'}`}>
                                        {isUnpaid ? '● Em Aberto' : '✓ PG'}
                                      </span>
                                      <button
                                        onClick={() => handleDeleteMesaOrder(order.id)}
                                        className="p-1 text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
                                        title="Deletar pedido do histórico"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Purchased details info */}
                                  <div className="bg-[#090909]/95 rounded-xl p-2.5 border border-[#1f1f1f] text-xs font-sans text-gray-300 space-y-1 select-text">
                                    {order.items.map((it, idx) => (
                                      <div key={idx} className="flex justify-between items-start border-b border-white/5 pb-1 lm-last-no-border">
                                        <div>
                                          <span className="font-bold text-gray-200">
                                            {it.nome} <span className="text-brand-secondary text-[10px]">x{it.qtd}</span>
                                          </span>
                                          {it.obs && (
                                            <span className="block text-[9px] text-gray-500 italic mt-0.5">
                                              Nota: "{it.obs}"
                                            </span>
                                          )}
                                          {it.adicional && (
                                            <span className="block text-[8px] text-yellow-600 font-bold uppercase font-mono leading-none mt-0.5">
                                              ➕ Adicional (+R$6,00/unid.)
                                            </span>
                                          )}
                                        </div>
                                        <span className="font-mono text-gray-400 text-[11px] shrink-0">
                                          R$ {(it.precoFinal * it.qtd).toFixed(2).replace('.', ',')}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Order Bottom status & settlement PG control */}
                                <div className="flex justify-between items-center bg-[#050505]/60 p-1.5 px-2.5 rounded-xl mt-4">
                                  <div className="font-mono text-xs">
                                    <span className="text-[10px] text-gray-500 uppercase font-mono">Valor Total:</span>{' '}
                                    <span className="text-yellow-405 font-bold text-yellow-400 block sm:inline">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                                  </div>

                                  {isUnpaid ? (
                                    <button
                                      type="button"
                                      onClick={() => handleMarkMesaOrderAsPaid(order.id)}
                                      className="py-1 px-3 bg-gradient-to-r from-green-700 to-emerald-600 hover:brightness-110 text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0 border border-green-500/20"
                                    >
                                      <Check size={10} className="stroke-[3]" />
                                      <span>Finalizar Comanda</span>
                                    </button>
                                  ) : (
                                    <span className="text-[9px] text-gray-500 font-mono uppercase font-black py-0.5 px-1.5">
                                      ✓ PG Realizado
                                    </span>
                                  )}
                                </div>

                              </div>
                            );
                          })}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-[#222]/50">
                      <span className="text-[10px] text-gray-500 font-mono">
                        Acesso de proprietário ativo. Para sair, clique no botão de logout.
                      </span>
                      <button
                        onClick={() => setIsAdminAuthenticated(false)}
                        className="py-1 px-3 border border-[#2b2b2b] hover:border-red-500/40 text-gray-400 hover:text-red-400 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer"
                      >
                        Sair do Painel
                      </button>
                    </div>

                  </div>
                )}

              </div>
              )}

              {/* Establishment hours and service notes */}
              <div className="grid sm:grid-cols-2 gap-4">
                
                <div className="p-5 bg-[#121212] border border-[#222] rounded-3xl flex gap-4">
                  <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary h-fit">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest font-mono">Horário de Atendimento</h4>
                    <span className="block text-xl text-yellow-400 font-oswald font-normal uppercase tracking-wider mt-1">Todos os dias a partir das 18h</span>
                    <p className="text-xs text-gray-400 mt-1">Lanches assados na hora na chapa de ferro quente para manter a suculência original do burger.</p>
                  </div>
                </div>

                <div className="p-5 bg-[#121212] border border-[#222] rounded-3xl flex gap-4">
                  <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary h-fit">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest font-mono">Adicionais Extras</h4>
                    <span className="block text-xl text-yellow-400 font-oswald font-normal uppercase tracking-wider mt-1">Modificações especiais por R$ 6,00</span>
                    <p className="text-xs text-gray-400 mt-1">Você pode personalizar qualquer lanche com ovo, queijo cheddar extra, bacon frito ou calabresa extra por um preço fixo.</p>
                  </div>
                </div>

              </div>

            </motion.div>
          ) : (
            
            // 2. FOOD LIST CATEGORIES VIEW (Lanches, Porções, Bebidas, etc.)
            <motion.div
              key="categoryPage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Category banner header & back button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#222]">
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToHome}
                    className="p-2 bg-[#222] hover:bg-brand-primary hover:text-white rounded-xl transition-all cursor-pointer select-none text-brand-secondary flex items-center justify-center font-bold"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div>
                    <h2 className="font-display text-3xl text-yellow-400 uppercase tracking-widest text-shadow-retro-small flex items-center gap-2">
                      {activeCategory === 'lanches' ? '🍔 Cardápio de Lanches' :
                       activeCategory === 'porcoes' ? '🍟 Porções Generosas' :
                       activeCategory === 'hotdog' ? '🌭 Cachorro Quente Especial' :
                       activeCategory === 'pao_frances' ? '🥖 Lanches no Pão Francês' :
                       '🥤 Bebidas Geladíssimas'}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5 tracking-wider font-mono">
                      Visualizando {filteredMenuItems.length} itens {searchQuery ? 'encontrados' : 'disponíveis'}
                    </p>
                  </div>
                </div>

                {/* Instant search input */}
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Buscar no cardápio..."
                    className="w-full bg-[#171717] border border-[#333] hover:border-[#444] focus:border-brand-primary focus:outline-hidden py-2.5 pl-10 pr-4 rounded-xl text-sm transition-all text-white placeholder-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3.5 top-3 text-gray-500" size={16} />
                </div>

              </div>

              {/* Dynamic warning if search matches nothing */}
              {filteredMenuItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                  <UtensilsCrossed size={48} className="stroke-[1.5] text-gray-600 mb-3" />
                  <p className="text-lg font-bold font-oswald text-gray-400 uppercase tracking-wider">Nenhum resultado encontrado</p>
                  <p className="text-xs text-gray-500 mt-1 font-sans">
                    Não encontramos lanches com "{searchQuery}". Tente outro termo de busca!
                  </p>
                </div>
              ) : (
                // Floating staggered grid of product items
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMenuItems.map((item) => (
                    <ItemCard
                      key={item.nome}
                      item={item}
                      onAddClick={handleOpenCustomize}
                      isAdmin={isAdminAuthenticated}
                      onEditPrice={handleEditPriceInline}
                    />
                  ))}
                </div>
              )}

              {/* Delivery notice footer info banner */}
              <div className="p-4 bg-[#111] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#222]">
                <div className="flex items-center gap-3 text-left">
                  <MapPin size={18} className="text-brand-primary" />
                  <p className="text-xs text-gray-400 max-w-xl font-sans">
                    Disponibilizamos taxa única fixa de entrega expressa de **R$ 6,00** para todos os pedidos locais, garantindo rapidez e lanches quentinhos!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleBackToHome}
                  className="py-1.5 px-4 bg-[#232323] hover:bg-brand-primary hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer uppercase font-mono text-brand-secondary"
                >
                  Voltar ao início
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* ================= ADMIN PRICE MODE BANNER (END OF PAGE) ================= */}
      {isAdminAuthenticated && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 -mb-4 animate-fadeIn">
          <div className="p-4 bg-gradient-to-r from-yellow-950/30 to-[#1e1402] border-2 border-yellow-500/30 rounded-2.5xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-black/20">
            <div className="text-center sm:text-left">
              <span className="block text-xs font-black uppercase tracking-wider text-yellow-500 font-mono">
                🔐 MODO DE ALTERAÇÃO DE PREÇOS ATIVO
              </span>
              <span className="block text-[11px] text-gray-400 mt-1 font-sans">
                Acesse o cardápio acima e clique em cima de qualquer preço de lanche para alterá-lo com segurança.
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
              {/* Adicionar Novo Lanche Button */}
              <button
                type="button"
                onClick={() => {
                  setAddLancheNome('');
                  setAddLanchePreco('');
                  setAddLancheIngredientes('');
                  setAddLancheCategoria('lanches');
                  setAddLancheError('');
                  setIsAddLancheOpen(true);
                }}
                className="w-full sm:w-auto py-3 px-5 bg-gradient-to-r from-brand-primary to-orange-600 hover:brightness-110 text-white font-mono font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 border-b-2 border-orange-850"
              >
                <Plus size={14} className="stroke-[3]" />
                <span>Adicionar Lanche</span>
              </button>

              {/* Finalizar Alterações Button */}
              <button
                type="button"
                onClick={() => {
                  setIsAdminAuthenticated(false);
                  setIsAdminPanelOpen(false);
                }}
                className="w-full sm:w-auto py-3 px-5 bg-gradient-to-r from-yellow-550 from-yellow-500 to-amber-500 text-black font-mono font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-yellow-500/10 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 border-b-2 border-amber-700"
              >
                <Check size={14} className="stroke-[3]" />
                <span>Finalizar Alterações</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ESTABLISHMENT FOOTER INFO ================= */}
      <footer className="bg-brand-dark border-t border-[#1a1a1a] py-8 text-center text-xs mt-10">
        <div className="max-w-7xl mx-auto px-4 text-gray-500 space-y-4">
          <div>
            <h4 className="font-display text-lg text-yellow-500 uppercase tracking-widest text-shadow-retro-small mb-1">
              Paty-Lanches
            </h4>
            <p className="font-mono text-[10px] uppercase text-gray-500 tracking-wider">
              Qualidade, Sabor e Atendimento Que Dá Água na Boca!
            </p>
          </div>

          <div className="flex justify-center flex-wrap gap-4 text-gray-600 font-semibold uppercase font-mono tracking-wide text-[10px]">
            <span>📞 Fone: (19) 98150-3977</span>
            <span>⏰ Estilo Disk Delivery</span>
            <span>🍔 Todos Feitos na Hora</span>
          </div>

          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            Desenvolvido com carinho para a Paty-Lanches de Limeira e região. Os preços e adicionais podem sofrer pequenas alterações sem aviso prévio. Mantenha os cookies salvos para sua lista.
          </p>
        </div>
      </footer>

      {/* ================= MODALS OR DRAWER PORTALS ================= */}
      
      {/* 1. Item Customize modal */}
      <CustomizeModal
        item={selectedItem}
        isOpen={isCustomizeOpen}
        onClose={() => {
          setIsCustomizeOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleConfirmAddCart}
      />

      {/* 2. Floating Cart right/sidebar drawer */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveItem={handleRemoveItem}
        onUpdateQtd={handleUpdateQtd}
        subtotal={cartSubtotal}
        onCheckout={handleOpenCheckout}
      />

      {/* 3. Delivery address form details */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        subtotal={cartSubtotal}
        onConfirmCheckout={handleConfirmCheckoutDetails}
      />

      {/* 4. Monospace "Notinha" summary visualizer modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        cart={cart}
        checkoutDetails={checkoutDetails}
        subtotal={cartSubtotal}
        onSendOrder={handleSendOrderToWhatsApp}
      />

      {/* 5. Secure Established Administration settings panel */}
      {isAdminPanelOpen && (
        <AdminPanel
          onClose={() => setIsAdminPanelOpen(false)}
          isAdmin={isAdminAuthenticated}
          onAuthenticate={handleAuthenticateAdmin}
          onAddNewItem={handleAddNewItemAdmin}
          onResetMenu={handleResetMenuAdmin}
          mesaOrders={mesaOrders}
          onMarkAsPaid={handleMarkMesaOrderAsPaid}
          onDeleteOrder={handleDeleteMesaOrder}
          caixaTotal={caixaTotal}
          caixaTransactions={caixaTransactions}
          onAddManualCaixa={handleAddManualCaixa}
          onSubManualCaixa={handleSubManualCaixa}
          onResetCaixa={handleResetCaixa}
        />
      )}

      {/* 6. Custom Elegant Inline Price Edit Modal */}
      {priceEditingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with elegant blur */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-xs cursor-pointer animate-fadeIn" 
            onClick={() => setPriceEditingItem(null)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-[#181818] border-2 border-brand-primary w-full max-w-sm rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(255,85,0,0.3)] z-10 text-white flex flex-col justify-between animate-scaleIn">
            
            <form onSubmit={handlePriceEditSubmitFinish} className="space-y-5">
              
              {/* Header */}
              <div className="flex justify-between items-start pb-2 border-b border-[#2d2d2d]">
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-black block">
                    ALTERAR PREÇO DO CARDÁPIO
                  </span>
                  <h3 className="font-display text-xl text-yellow-405 text-yellow-400 uppercase tracking-wider text-shadow-retro-small mt-0.5 max-w-[220px] truncate">
                    {priceEditingItem.nome}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPriceEditingItem(null)}
                  className="p-1 px-2.5 text-xs font-bold bg-[#262626] hover:bg-brand-primary hover:text-white rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Status or error notice alert banner */}
              {priceEditingError && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-center text-xs text-red-300 font-sans animate-pulse">
                  {priceEditingError}
                </div>
              )}

              {/* Step 1: Input Password */}
              {!isAdminAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-center py-1">
                    <div className="inline-flex p-3 bg-brand-primary/10 rounded-full border border-brand-primary/30 text-brand-primary mb-2">
                      <Lock size={22} />
                    </div>
                    <p className="text-xs text-gray-400 font-sans">
                      Por favor, digite os 4 últimos dígitos do WhatsApp de atendimento para autorizar a alteração de preço:
                    </p>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide font-mono">
                      Senha de Acesso:
                    </label>
                    <input
                      type="password"
                      autoFocus
                      required
                      placeholder="••••"
                      className="w-full bg-[#111] border border-[#333] rounded-xl p-3 text-center text-lg text-yellow-300 font-mono tracking-widest focus:outline-hidden focus:border-brand-primary transition-all font-bold"
                      value={priceEditingPassword}
                      onChange={(e) => {
                        setPriceEditingPassword(e.target.value);
                        setPriceEditingError('');
                      }}
                    />
                  </div>
                </div>
              ) : (
                /* Step 2: Input Price */
                <div className="space-y-4">
                  <div className="bg-[#111] p-3 rounded-xl border border-white/5 space-y-1 text-center font-mono">
                    <span className="text-[10px] text-gray-500 uppercase block">Preço Base Atual</span>
                    <span className="text-base font-black text-white block">
                      R$ {priceEditingItem.preco.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide font-mono">
                      Novo Preço do Item (R$):
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-xs font-mono font-bold text-gray-500">R$</span>
                      <input
                        type="text"
                        autoFocus
                        required
                        placeholder="Ex: 31,50"
                        className="w-full bg-[#111] border border-[#333] rounded-xl p-3 pl-10 text-lg text-yellow-300 font-mono focus:outline-hidden focus:border-brand-primary transition-all font-bold"
                        value={priceEditingNewVal}
                        onChange={(e) => {
                          setPriceEditingNewVal(e.target.value);
                          setPriceEditingError('');
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide font-mono">
                      Tipo de Pão / Categoria:
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setPriceEditingCategory('lanches')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          priceEditingCategory === 'lanches'
                            ? 'border-brand-primary bg-brand-primary/10 text-white font-black'
                            : 'border-[#333] bg-[#111] text-gray-400 hover:text-white hover:border-[#444]'
                        }`}
                      >
                        <span className="text-base">🍔</span>
                        <span>Pão Hambúrguer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriceEditingCategory('pao_frances')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          priceEditingCategory === 'pao_frances'
                            ? 'border-brand-primary bg-brand-primary/10 text-white font-black'
                            : 'border-[#333] bg-[#111] text-gray-400 hover:text-white hover:border-[#444]'
                        }`}
                      >
                        <span className="text-base">🥖</span>
                        <span>Pão Francês</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => setPriceEditingCategory('hotdog')}
                        className={`py-1.5 px-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 truncate ${
                          priceEditingCategory === 'hotdog'
                            ? 'border-brand-primary bg-brand-primary/10 text-white font-black'
                            : 'border-[#333] bg-[#111] text-gray-400 hover:text-white hover:border-[#444]'
                        }`}
                        title="Cachorro Quente"
                      >
                        <span>🌭 Hot Dog</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriceEditingCategory('porcoes')}
                        className={`py-1.5 px-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 truncate ${
                          priceEditingCategory === 'porcoes'
                            ? 'border-brand-primary bg-brand-primary/10 text-white font-black'
                            : 'border-[#333] bg-[#111] text-gray-400 hover:text-white hover:border-[#444]'
                        }`}
                        title="Porções"
                      >
                        <span>🍟 Porções</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriceEditingCategory('bebidas')}
                        className={`py-1.5 px-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 truncate ${
                          priceEditingCategory === 'bebidas'
                            ? 'border-brand-primary bg-brand-primary/10 text-white font-black'
                            : 'border-[#333] bg-[#111] text-gray-400 hover:text-white hover:border-[#444]'
                        }`}
                        title="Bebidas"
                      >
                        <span>🥤 Bebidas</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1.5 border-t border-[#2d2d2d]">
                <button
                  type="button"
                  onClick={() => setPriceEditingItem(null)}
                  className="flex-1 py-3 text-xs font-bold border border-[#2d2d2d] hover:bg-[#222] rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-black uppercase tracking-wider bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl transition-all hover:shadow-lg hover:shadow-brand-primary/10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {!isAdminAuthenticated ? (
                    <>
                      <Lock size={12} />
                      <span>Verificar</span>
                    </>
                  ) : (
                    <>
                      <Check size={12} className="stroke-[3]" />
                      <span>Alterar Preço</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 7. Custom Elegant Inline Add Snack Modal */}
      {isAddLancheOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with elegant blur */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-xs cursor-pointer animate-fadeIn" 
            onClick={() => setIsAddLancheOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-[#181818] border-2 border-brand-primary w-full max-w-sm rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(255,85,0,0.3)] z-10 text-white flex flex-col justify-between animate-scaleIn">
            
            <form onSubmit={handleInlineAddLancheSubmit} className="space-y-4">
              
              {/* Header */}
              <div className="flex justify-between items-start pb-2 border-b border-[#2d2d2d]">
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-black block">
                    GERENCIAMENTO DO CARDÁPIO
                  </span>
                  <h3 className="font-display text-xl text-yellow-405 text-yellow-400 uppercase tracking-wider text-shadow-retro-small mt-0.5">
                    Adicionar Novo Lanche
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddLancheOpen(false)}
                  className="p-1 px-2.5 text-xs font-bold bg-[#262626] hover:bg-brand-primary hover:text-white rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Status or error notice alert banner */}
              {addLancheError && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-center text-xs text-red-300 font-sans animate-pulse">
                  {addLancheError}
                </div>
              )}

              {/* Form Input fields */}
              <div className="space-y-3">
                {/* Nome do Produto */}
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wide font-mono">
                    Nome do Produto/Lanche:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: X-TUDO SUPREMO"
                    className="w-full bg-[#111] border border-[#333] rounded-xl p-2.5 pl-3 text-sm text-yellow-300 capitalize focus:outline-hidden focus:border-brand-primary transition-all font-bold"
                    value={addLancheNome}
                    onChange={(e) => setAddLancheNome(e.target.value)}
                  />
                </div>

                {/* Preço do Produto */}
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wide font-mono">
                    Preço de Venda (R$):
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-mono font-bold text-gray-500">R$</span>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 28,50"
                      className="w-full bg-[#111] border border-[#333] rounded-xl p-2.5 pl-9 text-sm text-yellow-400 font-mono focus:outline-hidden focus:border-brand-primary transition-all font-bold"
                      value={addLanchePreco}
                      onChange={(e) => setAddLanchePreco(e.target.value)}
                    />
                  </div>
                </div>

                {/* Ingredientes do Produto */}
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wide font-mono">
                    Ingredientes/Descrição:
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Ex: Pão de hambúrguer, 2 carnes de 150g, bacon frito, ovo, maionese caseira..."
                    className="w-full bg-[#111] border border-[#333] rounded-xl p-2.5 text-xs text-gray-300 focus:outline-hidden focus:border-brand-primary transition-all font-normal leading-relaxed resize-none"
                    value={addLancheIngredientes}
                    onChange={(e) => setAddLancheIngredientes(e.target.value)}
                  />
                </div>

                {/* Tipo de Pão / Categoria do Lanche */}
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide font-mono">
                    Tipo de Pão / Categoria:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAddLancheCategoria('lanches')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        addLancheCategoria === 'lanches'
                          ? 'border-brand-primary bg-brand-primary/10 text-white font-black'
                          : 'border-[#333] bg-[#111] text-gray-400 hover:text-white hover:border-[#444]'
                      }`}
                    >
                      <span className="text-base">🍔</span>
                      <span>Pão Hambúrguer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddLancheCategoria('pao_frances')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        addLancheCategoria === 'pao_frances'
                          ? 'border-brand-primary bg-brand-primary/10 text-white font-black'
                          : 'border-[#333] bg-[#111] text-gray-400 hover:text-white hover:border-[#444]'
                      }`}
                    >
                      <span className="text-base">🥖</span>
                      <span>Pão Francês</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setAddLancheCategoria('hotdog')}
                      className={`py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 truncate ${
                        addLancheCategoria === 'hotdog'
                          ? 'border-brand-primary bg-brand-primary/10 text-white font-black'
                          : 'border-[#333] bg-[#111] text-gray-400 hover:text-white hover:border-[#444]'
                      }`}
                      title="Cachorro Quente"
                    >
                      <span>🌭 Hot Dog</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddLancheCategoria('porcoes')}
                      className={`py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 truncate ${
                        addLancheCategoria === 'porcoes'
                          ? 'border-brand-primary bg-brand-primary/10 text-white font-black'
                          : 'border-[#333] bg-[#111] text-gray-400 hover:text-white hover:border-[#444]'
                      }`}
                      title="Porções"
                    >
                      <span>🍟 Porções</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddLancheCategoria('bebidas')}
                      className={`py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 truncate ${
                        addLancheCategoria === 'bebidas'
                          ? 'border-[#ff5500] bg-[#ff5500]/10 text-white font-black'
                          : 'border-[#333] bg-[#111] text-gray-400 hover:text-white hover:border-[#444]'
                      }`}
                      title="Bebidas"
                    >
                      <span>🥤 Bebida</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1.5 border-t border-[#2d2d2d]">
                <button
                  type="button"
                  onClick={() => setIsAddLancheOpen(false)}
                  className="flex-1 py-3 text-xs font-bold border border-[#2d2d2d] hover:bg-[#222] rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-black uppercase tracking-wider bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl transition-all hover:shadow-lg hover:shadow-brand-primary/10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={12} className="stroke-[3]" />
                  <span>Gravar Lanche</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= PERSISTENT BOTTOM FLOATING ACTION CART BAR ================= */}
      {cartItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-0 right-0 z-30 px-4 sm:px-6 animate-slideUp">
          <div 
            onClick={() => setIsCartOpen(true)}
            className="max-w-md mx-auto bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-5 rounded-2xl flex items-center justify-between shadow-2xl shadow-brand-primary/30 border border-brand-secondary/40 backdrop-blur-md cursor-pointer hover:scale-103 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="bg-white text-brand-primary text-xs font-black rounded-xl py-1 px-2.5 flex items-center justify-center shadow-sm">
                {cartItemCount}
              </span>
              <div>
                <span className="block text-xs uppercase font-mono font-bold tracking-widest text-[#ffe6d6]">Seu pedido atual</span>
                <span className="block text-sm font-bold font-sans">Visualizar Carrinho</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="font-display text-lg tracking-wider text-yellow-300">
                R$ {cartSubtotal.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[10px] text-gray-300 ml-1 font-mono uppercase font-bold">(Ver Carrinho)</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
