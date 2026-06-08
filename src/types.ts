export interface MenuItem {
  nome: string;
  preco: number;
  ingredientes: string;
  categoria: 'lanches' | 'porcoes' | 'hotdog' | 'pao_frances' | 'bebidas';
}

export interface CartItem {
  id: string; // Unique ID to distinguish item configurations (item name + obs + additional)
  nome: string;
  precoBase: number;
  precoFinal: number;
  obs: string;
  adicional: boolean;
  qtd: number;
  categoria: string;
}

export interface CheckoutDetails {
  tipoServico: 'entrega' | 'retirada' | 'mesa';
  mesaNumero?: string;
  endereco?: string;
  formaPagamento?: 'Dinheiro' | 'Cartão' | 'PIX';
  trocoPara?: string;
  telefone?: string;
}
