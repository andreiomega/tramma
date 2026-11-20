/* =====================================================================
   Tramma — dados fixos
   ---------------------------------------------------------------------
   Tudo o que, numa loja de verdade, viria do servidor. Aqui é um objeto
   JS carregado por <script> comum, porque o projeto abre direto do
   arquivo (file://), sem servidor, e por isso não pode usar fetch.
   Arquivo compartilhado (site/ e app/). Cada etapa acrescenta só o que
   a página dela usa.
   ===================================================================== */

window.TRAMMA = window.TRAMMA || {};

/* ---------- Regras comerciais (decisões da especificação) ---------- */
TRAMMA.rules = {
  installmentsMax: 6,       // até 6x sem juros
  installmentMin: 30,       // parcela mínima de R$ 30
  firstExchangeFree: true,  // primeira troca grátis
  exchangeDays: 30          // prazo de troca: 30 dias
};

/* ---------- Categorias ---------- */
TRAMMA.categories = [
  { id: "gola-careca", name: "Gola careca" },
  { id: "gola-v",      name: "Gola V" },
  { id: "henley",      name: "Henley" },
  { id: "manga-longa", name: "Manga longa" },
  { id: "oversized",   name: "Oversized" }
];

/* ---------- Catálogo ----------
   price: preço cheio · salePrice: preço em promoção (null = sem promoção)
   weight: gramatura em g/m² · composition: composição do tecido
   stock: unidades no total (0 = esgotado; até 5 = últimas unidades)
   rating: nota de 1 a 5 (null = sem avaliações) · reviews: quantidade
   isNew / isBestSeller: selos de novidade e mais vendido
   Cada produto foi pensado para mostrar um estado do card. */
TRAMMA.products = [
  { id: "essencial-careca", name: "Camiseta Essencial", category: "gola-careca",
    price: 149, salePrice: null, weight: 180, composition: "100% algodão Pima",
    colors: ["Branco", "Preto", "Cinza mescla", "Azul-marinho"], sizes: ["PP", "P", "M", "G", "GG", "XGG"],
    stock: 120, rating: 4.8, reviews: 214, isNew: false, isBestSeller: true },

  { id: "essencial-v", name: "Camiseta Essencial gola V", category: "gola-v",
    price: 149, salePrice: 119, weight: 180, composition: "100% algodão Pima",
    colors: ["Branco", "Preto", "Areia"], sizes: ["P", "M", "G", "GG"],
    stock: 64, rating: 4.6, reviews: 88, isNew: false, isBestSeller: true },

  { id: "pesada-careca", name: "Camiseta Pesada", category: "gola-careca",
    price: 189, salePrice: null, weight: 240, composition: "100% algodão egípcio",
    colors: ["Off-white", "Preto", "Verde-oliva"], sizes: ["P", "M", "G", "GG", "XGG"],
    stock: 40, rating: 4.9, reviews: 132, isNew: false, isBestSeller: true },

  { id: "henley-curta", name: "Henley manga curta", category: "henley",
    price: 179, salePrice: null, weight: 200, composition: "100% algodão Pima",
    colors: ["Cinza mescla", "Azul-marinho"], sizes: ["P", "M", "G", "GG"],
    stock: 4, rating: 4.7, reviews: 41, isNew: false, isBestSeller: false },

  { id: "manga-longa-careca", name: "Manga longa Essencial", category: "manga-longa",
    price: 199, salePrice: null, weight: 200, composition: "100% algodão Pima",
    colors: ["Branco", "Preto"], sizes: ["P", "M", "G", "GG"],
    stock: 35, rating: null, reviews: 0, isNew: true, isBestSeller: false },

  { id: "oversized-pesada", name: "Oversized Pesada", category: "oversized",
    price: 219, salePrice: null, weight: 260, composition: "100% algodão egípcio",
    colors: ["Preto", "Off-white", "Marrom"], sizes: ["P", "M", "G", "GG"],
    stock: 50, rating: 4.5, reviews: 27, isNew: true, isBestSeller: false },

  { id: "linho-careca", name: "Camiseta de linho", category: "gola-careca",
    price: 229, salePrice: null, weight: 160, composition: "55% linho, 45% algodão",
    colors: ["Areia", "Branco"], sizes: ["P", "M", "G", "GG"],
    stock: 0, rating: 4.4, reviews: 19, isNew: false, isBestSeller: false },

  { id: "henley-longa", name: "Henley manga longa em algodão Pima com botões de madrepérola", category: "henley",
    price: 239, salePrice: 199, weight: 220, composition: "100% algodão Pima",
    colors: ["Off-white", "Cinza chumbo"], sizes: ["P", "M", "G", "GG"],
    stock: 22, rating: 4.8, reviews: 36, isNew: false, isBestSeller: false },

  { id: "leve-v", name: "Camiseta Leve gola V", category: "gola-v",
    price: 129, salePrice: null, weight: 140, composition: "92% algodão, 8% elastano",
    colors: ["Branco", "Preto", "Azul-claro"], sizes: ["PP", "P", "M", "G", "GG"],
    stock: 80, rating: null, reviews: 0, isNew: true, isBestSeller: false },

  { id: "oversized-listrada", name: "Oversized listrada", category: "oversized",
    price: 209, salePrice: 169, weight: 220, composition: "100% algodão",
    colors: ["Azul e branco", "Preto e branco"], sizes: ["P", "M", "G", "GG"],
    stock: 3, rating: 4.2, reviews: 12, isNew: false, isBestSeller: false },

  { id: "pima-pocket", name: "Camiseta Essencial com bolso", category: "gola-careca",
    price: 159, salePrice: null, weight: 180, composition: "100% algodão Pima",
    colors: ["Branco", "Cinza mescla", "Verde-oliva"], sizes: ["P", "M", "G", "GG"],
    stock: 70, rating: 4.7, reviews: 58, isNew: false, isBestSeller: true },

  { id: "termica-longa", name: "Manga longa térmica", category: "manga-longa",
    price: 249, salePrice: null, weight: 280, composition: "100% algodão, malha waffle",
    colors: ["Off-white", "Preto"], sizes: ["P", "M", "G", "GG"],
    stock: 28, rating: 4.6, reviews: 23, isNew: true, isBestSeller: false }
];

/* ---------- Slider da home ---------- */
TRAMMA.heroSlides = [
  { eyebrow: "Coleção Essencial", title: "A camiseta que dura mais que a estação",
    text: "Algodão Pima de 180 g/m², costura dupla e caimento que não deforma na lavagem.",
    cta: "Ver a coleção Essencial", href: "categoria.html?c=gola-careca",
    alt: "Camisetas Essencial dobradas em pilha, nas cores branco, preto e cinza" },
  { eyebrow: "Novidade", title: "Oversized Pesada, 260 g/m²",
    text: "Malha encorpada, ombro caído e gola reforçada que não abre.",
    cta: "Conhecer a Oversized", href: "produto.html?id=oversized-pesada",
    alt: "Pessoa vestindo a camiseta Oversized Pesada preta" },
  { eyebrow: "Sem juros", title: "Em até 6x, e a primeira troca é grátis",
    text: "Errou o tamanho? Você tem 30 dias para trocar, sem custo na primeira vez.",
    cta: "Ver as regras de troca", href: "trocas.html",
    alt: "Etiqueta de tamanho costurada na gola de uma camiseta" }
];

/* ---------- Contas de demonstração ----------
   Por enquanto, só os campos que a home usa. As próximas etapas
   acrescentam pedidos, endereços, cartões etc. */
TRAMMA.demoAccounts = {
  nova: {
    name: "Bruno Lima", email: "bruno@exemplo.com",
    favorites: [], recentlyViewed: [], bag: []
  },
  completa: {
    name: "Ana Souza", email: "ana@exemplo.com",
    favorites: ["pesada-careca", "henley-longa"],
    recentlyViewed: ["oversized-pesada", "henley-curta", "linho-careca", "essencial-v"],
    bag: [{ id: "essencial-careca", size: "M", color: "Preto", qty: 2 }]
  }
};
