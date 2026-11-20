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
  exchangeDays: 30,         // prazo de troca: 30 dias
  freeShippingMin: 299,     // frete grátis acima de R$ 299
  pixDiscount: 0.05         // 5% de desconto no Pix
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
    cta: "Ver a coleção Essencial", href: "categoria.html?c=gola-careca", image: "img/fotos/slider-1.jpg",
    alt: "Pessoa vestindo camiseta branca lisa, enquadrada do peito até a cintura" },
  { eyebrow: "Novidade", title: "Oversized Pesada, 260 g/m²",
    text: "Malha encorpada, ombro caído e gola reforçada que não abre.",
    cta: "Conhecer a Oversized", href: "produto.html?id=oversized-pesada", image: "img/fotos/slider-2.jpg",
    alt: "Pessoa vestindo camiseta preta lisa, enquadrada do peito até a cintura" },
  { eyebrow: "Sem juros", title: "Em até 6x, e a primeira troca é grátis",
    text: "Errou o tamanho? Você tem 30 dias para trocar, sem custo na primeira vez.",
    cta: "Ver as regras de troca", href: "trocas.html", image: "img/fotos/slider-3.jpg",
    alt: "Camisetas dobradas em várias cores sobre uma superfície de madeira" }
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

/* ---------- Fotos ----------
   Banco gratuito (Unsplash/Pexels), com crédito em img/fotos/CREDITOS.md.
   Cada foto tem um nome de arquivo fixo. Enquanto o arquivo não existe,
   a página mostra o placeholder (ver o script no <head> do index.html). */
TRAMMA.photo = {
  product:  function (id) { return "img/fotos/produto-" + id + ".jpg"; },
  category: function (id) { return "img/fotos/categoria-" + id + ".jpg"; }
};

/* ---------- Cores do catálogo (amostras no card) ---------- */
TRAMMA.colorHex = {
  "Branco": "#FFFFFF", "Off-white": "#F2EEE6", "Preto": "#15171A", "Cinza mescla": "#A7A9AC",
  "Cinza chumbo": "#4A4D52", "Azul-marinho": "#1F2A44", "Azul-claro": "#A9C4E2", "Areia": "#D8C8AA",
  "Verde-oliva": "#6B6B3A", "Marrom": "#5B3E2B", "Azul e branco": "#3B5BA9", "Preto e branco": "#15171A"
};

/* ---------- Faixa de benefícios (regras da especificação) ---------- */
TRAMMA.benefits = [
  { icon: "truck",         title: "Frete grátis",       text: "Nas compras acima de R$ 299" },
  { icon: "credit-card",   title: "Até 6x sem juros",   text: "Parcela mínima de R$ 30" },
  { icon: "repeat",        title: "Primeira troca grátis", text: "Em até 30 dias depois da entrega" },
  { icon: "badge-percent", title: "5% off no Pix",      text: "Desconto no valor dos produtos" }
];

/* ---------- Vitrine com abas ---------- */
TRAMMA.showcaseTabs = [
  { id: "mais-vendidos", label: "Mais vendidos", href: "loja.html?ordem=mais-vendidos",
    pick: function (p) { return p.isBestSeller; } },
  { id: "novidades",     label: "Novidades",     href: "loja.html?ordem=novidades",
    pick: function (p) { return p.isNew; } },
  { id: "promocoes",     label: "Promoções",     href: "loja.html?promocao=1",
    pick: function (p) { return !!p.salePrice; } }
];

/* ---------- Banner de campanha ---------- */
TRAMMA.campaign = {
  eyebrow: "Linha Pesada", title: "Malha de 240 a 260 g/m²",
  text: "Encorpada, opaca e com caimento firme. Feita para durar anos, não estações.",
  cta: "Ver a linha Pesada", href: "loja.html?gramatura=pesada",
  image: "img/fotos/campanha.jpg",
  alt: "Pessoa de costas, com camiseta preta, diante de uma parede de tijolos claros"
};

/* ---------- Na vida real (galeria) ---------- */
TRAMMA.gallery = [
  { image: "img/fotos/vida-real-1.jpg", alt: "Pessoa de camiseta branca lisa num gramado" },
  { image: "img/fotos/vida-real-2.jpg", alt: "Pessoa de camiseta branca e bolsa marrom numa escada" },
  { image: "img/fotos/vida-real-3.jpg", alt: "Pessoa de camiseta branca e saia xadrez diante de uma parede verde" },
  { image: "img/fotos/vida-real-4.jpg", alt: "Pessoa de camiseta preta num museu, com quadros ao fundo" },
  { image: "img/fotos/vida-real-5.jpg", alt: "Pessoa de camiseta branca lisa com as mãos nos bolsos" },
  { image: "img/fotos/vida-real-6.jpg", alt: "Pessoa de camiseta preta e jeans diante de uma parede de concreto" }
];

/* ---------- Perguntas frequentes (home) ---------- */
TRAMMA.faq = [
  { q: "O que é gramatura?",
    a: "É o peso do tecido por metro quadrado (g/m²). Quanto maior, mais encorpada e opaca é a malha. Nossas camisetas vão de 140 g/m² (leves) a 280 g/m² (térmicas)." },
  { q: "Como escolho o tamanho?",
    a: "Cada produto tem uma tabela de medidas em centímetros. Compare com uma camiseta que você já tem e gosta do caimento." },
  { q: "Qual o prazo de entrega?",
    a: "Depende do CEP. Você vê o prazo e o valor do frete na página do produto, antes de colocar na sacola." },
  { q: "Como funciona a troca?",
    a: "Você tem 30 dias depois da entrega para trocar. A primeira troca é grátis: geramos a etiqueta de envio para você." },
  { q: "Posso pagar com Pix?",
    a: "Sim. No Pix, você tem 5% de desconto no valor dos produtos. Também aceitamos cartão em até 6x sem juros e boleto." }
];

/* ---------- Texto alternativo das fotos de produto ----------
   Descreve a foto que está no arquivo (banco gratuito), não a peça ideal.
   Quando a foto mudar, o texto muda junto. */
(function () {
  var alts = {
    "essencial-careca":   "Camiseta branca lisa pendurada num cabide, contra uma parede cinza",
    "essencial-v":        "Camiseta branca lisa estendida sobre a mesa, com folhas e uma câmera ao lado",
    "pesada-careca":      "Duas camisetas pretas lisas, de manga curta e manga longa, em cabides de madeira",
    "henley-curta":       "Pessoa vestindo uma henley azul-marinho com botões na gola",
    "manga-longa-careca": "Camiseta branca de manga longa dobrada, ao lado de um par de tênis brancos",
    "oversized-pesada":   "Pessoa de óculos vestindo uma camiseta preta larga, em estúdio claro",
    "linho-careca":       "Camiseta branca lisa pendurada numa parede branca",
    "henley-longa":       "Duas camisetas dobradas, preta e verde-clara, com galhos de algodão",
    "leve-v":             "Camiseta branca lisa estendida sobre madeira clara, com limões e um chapéu",
    "oversized-listrada": "Detalhe de uma camiseta listrada azul e branca, dobrada",
    "pima-pocket":        "Camiseta azul-clara mesclada pendurada num cabide, contra uma parede branca",
    "termica-longa":      "Pessoa vestindo camiseta branca de manga longa e calça branca"
  };
  TRAMMA.products.forEach(function (p) { p.photoAlt = alts[p.id]; });
})();
