import { MenuItem } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // --- LANCHES ---
  {
    nome: "X-HAMBÚRGUER",
    preco: 18.00,
    ingredientes: "Pão de hambúrguer, carne, alface, tomate, batata palha, maionese e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-BURGUER",
    preco: 16.00,
    ingredientes: "Pão de hambúrguer, carne, batata palha, maionese e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-SALADA",
    preco: 20.00,
    ingredientes: "Pão de hambúrguer, alface, tomate e maionese.",
    categoria: "lanches"
  },
  {
    nome: "X-SALADA EGG",
    preco: 24.00,
    ingredientes: "Pão de hambúrguer, alface, tomate, ovo e maionese.",
    categoria: "lanches"
  },
  {
    nome: "X-SALADA FRANGO",
    preco: 25.00,
    ingredientes: "Pão de hambúrguer, alface, tomate, presunto, alface, batata, molho e frango desfiado, maionese e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-SALADA BACON",
    preco: 25.00,
    ingredientes: "Pão de hambúrguer, alface, presunto, alface, batata, molho, 2 fatias de bacon, maionese e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-EGG",
    preco: 23.00,
    ingredientes: "Pão de hambúrguer, filé de frango, presunto, queijo, ovo, alface, maionese, queijo e batata palha, molho e maionese e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-EGG DUPLO",
    preco: 27.00,
    ingredientes: "Pão de hambúrguer, presunto, queijo, 2 ovos, alface, molho, queijo e batata palha, molho e maionese e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-EGG BACON",
    preco: 28.00,
    ingredientes: "Pão de hambúrguer, bacon, ovo, alface, presunto, queijo, maionese, queijo e batata palha, molho e maionese e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-EGG CALABRESA",
    preco: 27.00,
    ingredientes: "Pão de hambúrguer, calabresa, ovo, alface, presunto, queijo, queijo e batata palha, molho e maionese e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-BACON",
    preco: 25.00,
    ingredientes: "Pão de hambúrguer, presunto, queijo, ovo, alface, maionese, queijo e batata palha, molho e maionese e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-FRANGO",
    preco: 30.00,
    ingredientes: "Pão de hambúrguer, filé de frango, presunto, queijo, alface, maionese, queijo e batata palha, molho e maionese e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-FRANGO C/ CATUPIRY",
    preco: 32.00,
    ingredientes: "Pão de hambúrguer, frango, bacon, presunto, queijo, alface, maionese, queijo e batata palha, molho e maionese e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-FRANGO BACON",
    preco: 25.00,
    ingredientes: "Pão de hambúrguer, calabresa, presunto, queijo, alface, maionese, queijo e batata palha, molho e maionese e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-BAGACEIRA",
    preco: 45.00,
    ingredientes: "4 carnes de hambúrguer, 4 ovos, 2 calabresas, 2 filés de frango, bacon, queijo, calabresa, 2 fatias de presunto, 2 fatias de queijo, bauru, cozido, tomate, alface, alface, maionese, ketchup e mostarda.",
    categoria: "lanches"
  },

  // --- LANCHES GOURMET / ESPECIAIS ---
  {
    nome: "X-CALAFRANGO",
    preco: 28.00,
    ingredientes: "Calabresa, hambúrguer, filé de frango, presunto, queijo, tomate, alface, maionese, ketchup, mostarda e batata palha.",
    categoria: "lanches"
  },
  {
    nome: "X-CALABACON",
    preco: 29.00,
    ingredientes: "Calabresa, hambúrguer, bacon, presunto, queijo, tomate, alface, maionese, ketchup, mostarda e batata palha.",
    categoria: "lanches"
  },
  {
    nome: "X-TUDO",
    preco: 29.00,
    ingredientes: "Hambúrguer, filé de frango, calabresa, bacon, ovo, presunto, queijo, alface, tomate, milho, batata palha e maionese.",
    categoria: "lanches"
  },
  {
    nome: "X-GORDINHO",
    preco: 31.00,
    ingredientes: "2 Hambúrgueres, 2 ovos, filé de frango, calabresa, bacon, presunto, queijo, alface, tomate, milho e batata palha.",
    categoria: "lanches"
  },
  {
    nome: "X-CHURRASCO",
    preco: 35.00,
    ingredientes: "Contra-filé, cebola, presunto, queijo, milho, ovo, tomate, alface, maionese, ketchup, mostarda, catupiry e batata palha.",
    categoria: "lanches"
  },
  {
    nome: "X-CHURRASCO SIMPLES",
    preco: 30.00,
    ingredientes: "Contra-filé, vinagrete, maionese, mostarda, ketchup, presunto e milho em pão francês macio.",
    categoria: "lanches"
  },
  {
    nome: "X-CALABRESA ACEBOLADA",
    preco: 35.00,
    ingredientes: "Calabresa, cebola, ovo, hambúrguer, presunto, queijo, alface, tomate, milho, batata palha, catupiry, cheddar, maionese, ketchup e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-OMELETE",
    preco: 29.00,
    ingredientes: "Ovos, bacon, presunto, queijo, catupiry, tomate, alface, batata palha, maionese e molho especial.",
    categoria: "lanches"
  },
  {
    nome: "X-BAURU",
    preco: 28.00,
    ingredientes: "Coxão mole, presunto, queijo, ovo, alface, tomate, milho, batata palha, maionese, ketchup e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-BAURU COM FRANGO",
    preco: 33.00,
    ingredientes: "Coxão mole, frango desfiado, presunto, queijo, ovo, alface, tomate, milho, batata palha, maionese, ketchup e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-BAURU COM BACON",
    preco: 35.00,
    ingredientes: "Coxão mole, bacon crocante, presunto, queijo, ovo, alface, tomate, milho, batata palha, maionese, ketchup e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-BAURU COM CALABRESA",
    preco: 33.00,
    ingredientes: "Coxão mole, calabresa fatiada, presunto, queijo, ovo, alface, tomate, milho, batata palha, maionese, ketchup e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-MODA DA CASA",
    preco: 38.00,
    ingredientes: "3 carnes de hambúrguer, filé de frango, bacon, calabresa, 3 fatias de presunto, 3 fatias de queijo, 3 ovos, batata palha, tomate, milho, alface, ketchup, maionese e mostarda.",
    categoria: "lanches"
  },
  {
    nome: "X-ESPECIAL PATY LANCHES",
    preco: 42.00,
    ingredientes: "4 carnes de hambúrguer, 4 ovos, filé de frango, bacon, catupiry, calabresa, presunto, queijo, batata palha, tomate, milho, alface, ketchup, maionese e mostarda.",
    categoria: "lanches"
  },

  // --- PORÇÕES ---
  {
    nome: "Calabresa Acebolada",
    preco: 40.00,
    ingredientes: "Generosa porção de calabresa grelhada com cebolas caramelizadas.",
    categoria: "porcoes"
  },
  {
    nome: "Contra-filé Acebolado",
    preco: 65.00,
    ingredientes: "Nobre tira de contra-filé acebolado preparado na chapa quente.",
    categoria: "porcoes"
  },
  {
    nome: "Filezinho de Frango",
    preco: 47.00,
    ingredientes: "Tiras de frango suculentas e empanadas/grelhadas bem temperadas.",
    categoria: "porcoes"
  },
  {
    nome: "Batata Frita",
    preco: 30.00,
    ingredientes: "Batatas fritas super crocantes e douradas.",
    categoria: "porcoes"
  },
  {
    nome: "Batata Frita com Bacon",
    preco: 34.00,
    ingredientes: "Batatas fritas com pedacinhos de bacon bem crocante por cima.",
    categoria: "porcoes"
  },
  {
    nome: "Batata Frita com Bacon e Queijo",
    preco: 42.00,
    ingredientes: "Batata frita coberta com queijo derretido sob pedaços generosos de bacon.",
    categoria: "porcoes"
  },

  // --- CACHORRO QUENTE ---
  {
    nome: "Cachorro Duplo",
    preco: 19.00,
    ingredientes: "2 salsichas, molho especial caseiro, ketchup, tomate, milho, batata palha, maionese e mostarda.",
    categoria: "hotdog"
  },
  {
    nome: "Cachorro Quente com Frango",
    preco: 23.00,
    ingredientes: "Salsicha, frango desfiado temperado, batata palha, tomate, milho, ketchup, maionese e mostarda.",
    categoria: "hotdog"
  },
  {
    nome: "Cachorro Quente com Bacon",
    preco: 25.00,
    ingredientes: "Salsicha, bacon, batata palha, tomate, milho, ketchup, maionese e mostarda.",
    categoria: "hotdog"
  },
  {
    nome: "Cachorro Quente com Bacon II",
    preco: 30.00,
    ingredientes: "Hambúrguer, salsicha, bacon, ovo, presunto, queijo, batata palha, tomate, milho, ketchup, maionese e mostarda.",
    categoria: "hotdog"
  },

  // --- PÃO FRANCÊS ---
  {
    nome: "Americano",
    preco: 25.00,
    ingredientes: "3 fatias de presunto, 3 fatias de queijo, ovo frito, tomate, alface, ketchup, maionese e mostarda.",
    categoria: "pao_frances"
  },
  {
    nome: "Misto Quente",
    preco: 17.00,
    ingredientes: "3 fatias de presunto, 3 fatias de queijo, tomate fatiado, ketchup, maionese e mostarda.",
    categoria: "pao_frances"
  },
  {
    nome: "Misto Quente de Frango",
    preco: 25.00,
    ingredientes: "3 fatias de presunto, 3 fatias de queijo, frango desfiado temperado, ketchup, maionese e mostarda.",
    categoria: "pao_frances"
  },
  {
    nome: "Misto Quente de Bacon",
    preco: 26.00,
    ingredientes: "3 fatias de presunto, 3 fatias de queijo, bacon grelhado crocante, ketchup, maionese e mostarda.",
    categoria: "pao_frances"
  },
  {
    nome: "Prensado de Frango",
    preco: 23.00,
    ingredientes: "Pão de francês prensado recheado de frango com catupiry, queijo cheddar caseiro, tomate e mostarda.",
    categoria: "pao_frances"
  },
  {
    nome: "Frango Especial no Francês",
    preco: 38.00,
    ingredientes: "Frango desfiado, contra-filé fatiado, ovo, presunto, queijo, tomate, alface, milho, batata palha, maionese, mostarda, catupiry e cheddar.",
    categoria: "pao_frances"
  },
  {
    nome: "Especial de Linguiça",
    preco: 35.00,
    ingredientes: "Bife caseiro de linguiça, presunto, muçarela, cebola grelhada, catupiry, cheddar, ovo, alface, milho, batata palha, ketchup, maionese e mostarda.",
    categoria: "pao_frances"
  },
  {
    nome: "Especial de Linguiça Simples",
    preco: 32.00,
    ingredientes: "Bife caseiro de linguiça, presunto, muçarela, tomate, alface, milho, ketchup, maionese e mostarda.",
    categoria: "pao_frances"
  },

  // --- BEBIDAS ---
  {
    nome: "Coca-Cola 2 Litros",
    preco: 15.00,
    ingredientes: "Garrafa retornável ou PET Coca-Cola geladíssima.",
    categoria: "bebidas"
  },
  {
    nome: "Coca Lata",
    preco: 6.00,
    ingredientes: "Lata de Coca-Cola original de 350ml.",
    categoria: "bebidas"
  },
  {
    nome: "Cerveja Lata",
    preco: 5.00,
    ingredientes: "Cerveja em lata skool / brahma premium.",
    categoria: "bebidas"
  },
  {
    nome: "Refrigerantes 2 Litros (Outros)",
    preco: 12.00,
    ingredientes: "Garrafas de 2 Litros (Fanta Laranja, Uva, Guaraná Antarctica ou Pepsi).",
    categoria: "bebidas"
  },
  {
    nome: "Outros Refrigerantes (Lata)",
    preco: 6.00,
    ingredientes: "Guaraná Antarctica, Sprite fanta uva ou laranja lata.",
    categoria: "bebidas"
  },
  {
    nome: "Outras Marcas 2 Litros",
    preco: 10.00,
    ingredientes: "Guaraná Convenção, tubaína, etc de 2 Litros.",
    categoria: "bebidas"
  }
];
