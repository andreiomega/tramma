/* =====================================================================
   Tramma — dados fixos
   ---------------------------------------------------------------------
   Tudo o que, numa loja de verdade, viria do servidor. Aqui é um objeto
   JS carregado por <script> comum, porque o projeto abre direto do
   arquivo (file://), sem servidor, e por isso não pode usar fetch.
   Arquivo compartilhado (site/ e app/). Cada etapa acrescenta só o que
   a página dela usa.

   IDIOMA: todo texto que a pessoa lê vem em par, { pt: "...", en: "..." }.
   As duas versões ficam juntas para ninguém esquecer de traduzir uma
   delas. TRAMMA.text() (i18n.js) escolhe a do idioma da página.
   Os ids, as cores ("Preto") e os tamanhos são códigos: não se traduzem.
   VALORES: sempre em reais. A conversão para dólar é feita na hora de
   mostrar (TRAMMA.money, no i18n.js).
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

/* ---------- Categorias ----------
   O nome de cada categoria fica no dicionário do i18n.js
   ("category.gola-careca"), porque ele aparece também nos menus do HTML. */
TRAMMA.categories = [
  { id: "gola-careca" },
  { id: "gola-v" },
  { id: "henley" },
  { id: "manga-longa" },
  { id: "oversized" }
];

/* ---------- Catálogo ----------
   price: preço cheio · salePrice: preço em promoção (null = sem promoção)
   weight: gramatura em g/m² · composition: composição do tecido
   stock: unidades no total (0 = esgotado; até 5 = últimas unidades)
   rating: nota de 1 a 5 (null = sem avaliações) · reviews: quantidade
   isNew / isBestSeller: selos de novidade e mais vendido
   Cada produto foi pensado para mostrar um estado do card. */
TRAMMA.products = (function () {
  // Composições que se repetem entre produtos.
  var PIMA     = { pt: "100% algodão Pima",    en: "100% Pima cotton" };
  var EGYPTIAN = { pt: "100% algodão egípcio", en: "100% Egyptian cotton" };

  return [
    { id: "essencial-careca", isFeatured: true, name: { pt: "Camiseta Essencial", en: "Essential Tee" }, category: "gola-careca",
      price: 149, salePrice: null, weight: 180, composition: PIMA,
      colors: ["Branco", "Preto", "Cinza mescla", "Azul-marinho"], sizes: ["PP", "P", "M", "G", "GG", "XGG"],
      stock: 120, rating: 4.8, reviews: 214, isNew: false, isBestSeller: true },

    { id: "essencial-v", name: { pt: "Camiseta Essencial gola V", en: "Essential V-neck Tee" }, category: "gola-v",
      price: 149, salePrice: 119, weight: 180, composition: PIMA,
      colors: ["Branco", "Preto", "Areia"], sizes: ["P", "M", "G", "GG"],
      stock: 64, rating: 4.6, reviews: 88, isNew: false, isBestSeller: true },

    { id: "pesada-careca", name: { pt: "Camiseta Pesada", en: "Heavy Tee" }, category: "gola-careca",
      price: 189, salePrice: null, weight: 240, composition: EGYPTIAN,
      colors: ["Off-white", "Preto", "Verde-oliva"], sizes: ["P", "M", "G", "GG", "XGG"],
      stock: 40, rating: 4.9, reviews: 132, isNew: false, isBestSeller: true },

    { id: "henley-curta", isFeatured: true, name: { pt: "Henley manga curta", en: "Short-sleeve Henley" }, category: "henley",
      price: 179, salePrice: null, weight: 200, composition: PIMA,
      colors: ["Cinza mescla", "Azul-marinho"], sizes: ["P", "M", "G", "GG"],
      stock: 4, rating: 4.7, reviews: 41, isNew: false, isBestSeller: false },

    { id: "manga-longa-careca", name: { pt: "Manga longa Essencial", en: "Essential Long Sleeve" }, category: "manga-longa",
      price: 199, salePrice: null, weight: 200, composition: PIMA,
      colors: ["Branco", "Preto"], sizes: ["P", "M", "G", "GG"],
      stock: 35, rating: null, reviews: 0, isNew: true, isBestSeller: false },

    { id: "oversized-pesada", isFeatured: true, name: { pt: "Oversized Pesada", en: "Heavy Oversized" }, category: "oversized",
      price: 219, salePrice: null, weight: 260, composition: EGYPTIAN,
      colors: ["Preto", "Off-white", "Marrom"], sizes: ["P", "M", "G", "GG"],
      stock: 50, rating: 4.5, reviews: 27, isNew: true, isBestSeller: false },

    { id: "linho-careca", name: { pt: "Camiseta de linho", en: "Linen Tee" }, category: "gola-careca",
      price: 229, salePrice: null, weight: 160, composition: { pt: "55% linho, 45% algodão", en: "55% linen, 45% cotton" },
      colors: ["Areia", "Branco"], sizes: ["P", "M", "G", "GG"],
      stock: 0, rating: 4.4, reviews: 19, isNew: false, isBestSeller: false },

    { id: "henley-longa", isFeatured: true,
      name: { pt: "Henley manga longa em algodão Pima com botões de madrepérola",
              en: "Long-sleeve Henley in Pima cotton with mother-of-pearl buttons" }, category: "henley",
      price: 239, salePrice: 199, weight: 220, composition: PIMA,
      colors: ["Off-white", "Cinza chumbo"], sizes: ["P", "M", "G", "GG"],
      stock: 22, rating: 4.8, reviews: 36, isNew: false, isBestSeller: false },

    { id: "leve-v", name: { pt: "Camiseta Leve gola V", en: "Light V-neck Tee" }, category: "gola-v",
      price: 129, salePrice: null, weight: 140, composition: { pt: "92% algodão, 8% elastano", en: "92% cotton, 8% elastane" },
      colors: ["Branco", "Preto", "Azul-claro"], sizes: ["PP", "P", "M", "G", "GG"],
      stock: 80, rating: null, reviews: 0, isNew: true, isBestSeller: false },

    { id: "oversized-listrada", name: { pt: "Oversized listrada", en: "Striped Oversized" }, category: "oversized",
      price: 209, salePrice: 169, weight: 220, composition: { pt: "100% algodão", en: "100% cotton" },
      colors: ["Azul e branco", "Preto e branco"], sizes: ["P", "M", "G", "GG"],
      stock: 3, rating: 4.2, reviews: 12, isNew: false, isBestSeller: false },

    { id: "pima-pocket", name: { pt: "Camiseta Essencial com bolso", en: "Essential Pocket Tee" }, category: "gola-careca",
      price: 159, salePrice: null, weight: 180, composition: PIMA,
      colors: ["Branco", "Cinza mescla", "Verde-oliva"], sizes: ["P", "M", "G", "GG"],
      stock: 70, rating: 4.7, reviews: 58, isNew: false, isBestSeller: true },

    { id: "termica-longa", name: { pt: "Manga longa térmica", en: "Thermal Long Sleeve" }, category: "manga-longa",
      price: 249, salePrice: null, weight: 280, composition: { pt: "100% algodão, malha waffle", en: "100% cotton, waffle knit" },
      colors: ["Off-white", "Preto"], sizes: ["P", "M", "G", "GG"],
      stock: 28, rating: 4.6, reviews: 23, isNew: true, isBestSeller: false }
  ];
})();

/* ---------- Slider da home ---------- */
TRAMMA.heroSlides = [
  { eyebrow: { pt: "Coleção Essencial", en: "Essential collection" },
    title:   { pt: "A camiseta que dura mais que a estação", en: "The tee that outlasts the season" },
    text:    { pt: "Algodão Pima de 180 g/m², costura dupla e caimento que não deforma na lavagem.",
               en: "Pima cotton at 180 g/m², double stitching and a fit that holds its shape in the wash." },
    cta:     { pt: "Ver a coleção Essencial", en: "See the Essential collection" },
    href: "categoria.html?c=gola-careca", image: "img/fotos/slider-1.jpg",
    alt:     { pt: "Pessoa vestindo camiseta branca lisa, enquadrada do peito até a cintura",
               en: "Person wearing a plain white tee, framed from chest to waist" } },
  // Slide 2: a malha LEVE. A Pesada já tem a campanha só dela, mais abaixo.
  { eyebrow: { pt: "Novidade", en: "New in" },
    title:   { pt: "Camiseta Leve, 140 g/m²", en: "Light Tee, 140 g/m²" },
    text:    { pt: "Malha fina com um toque de elastano, feita para os dias quentes.",
               en: "A fine knit with a touch of elastane, made for hot days." },
    cta:     { pt: "Conhecer a Leve", en: "Discover the Light Tee" },
    href: "produto.html?id=leve-v", image: "img/fotos/slider-2.jpg",
    alt:     { pt: "Pessoa vestindo camiseta preta lisa, enquadrada do peito até a cintura",
               en: "Person wearing a plain black tee, framed from chest to waist" } },
  // Slide 3: as cores fixas, a promessa da marca (melhorar as mesmas peças).
  // Parcelamento e troca já estão na faixa de benefícios, logo abaixo.
  { eyebrow: { pt: "Cores", en: "Colors" },
    title:   { pt: "As mesmas cores o ano todo", en: "The same colors all year round" },
    text:    { pt: "São 12 cores fixas. Achou a sua? Ela continua aqui na próxima compra.",
               en: "12 permanent colors. Found yours? It will still be here next time." },
    cta:     { pt: "Ver todas as cores", en: "See all colors" },
    href: "loja.html", image: "img/fotos/slider-3.jpg",
    alt:     { pt: "Camisetas dobradas em várias cores sobre uma superfície de madeira",
               en: "Tees in several colors, folded on a wooden surface" } }
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

/* ---------- Cores do catálogo ----------
   A chave em português é o código da cor: é ela que fica gravada na
   sacola. hex: a amostra no card · name: o nome que a pessoa lê. */
TRAMMA.colors = {
  "Branco":         { hex: "#FFFFFF", name: { pt: "Branco",         en: "White" } },
  "Off-white":      { hex: "#F2EEE6", name: { pt: "Off-white",      en: "Off-white" } },
  "Preto":          { hex: "#15171A", name: { pt: "Preto",          en: "Black" } },
  "Cinza mescla":   { hex: "#A7A9AC", name: { pt: "Cinza mescla",   en: "Heather gray" } },
  "Cinza chumbo":   { hex: "#4A4D52", name: { pt: "Cinza chumbo",   en: "Charcoal" } },
  "Azul-marinho":   { hex: "#1F2A44", name: { pt: "Azul-marinho",   en: "Navy" } },
  "Azul-claro":     { hex: "#A9C4E2", name: { pt: "Azul-claro",     en: "Light blue" } },
  "Areia":          { hex: "#D8C8AA", name: { pt: "Areia",          en: "Sand" } },
  "Verde-oliva":    { hex: "#6B6B3A", name: { pt: "Verde-oliva",    en: "Olive" } },
  "Marrom":         { hex: "#5B3E2B", name: { pt: "Marrom",         en: "Brown" } },
  "Azul e branco":  { hex: "#3B5BA9", name: { pt: "Azul e branco",  en: "Blue and white" } },
  "Preto e branco": { hex: "#15171A", name: { pt: "Preto e branco", en: "Black and white" } }
};

/* ---------- Faixa de benefícios (regras da especificação) ----------
   {freeShipping} e {installmentMin} viram dinheiro na moeda do idioma
   (home.js), a partir das regras acima: o valor nunca fica escrito à mão. */
TRAMMA.benefits = [
  { icon: "truck",
    title: { pt: "Frete grátis", en: "Free shipping" },
    text:  { pt: "Nas compras acima de {freeShipping}", en: "On orders over {freeShipping}" } },
  { icon: "credit-card",
    title: { pt: "Até 6x sem juros", en: "Up to 6 interest-free payments" },
    text:  { pt: "Parcela mínima de {installmentMin}", en: "Minimum payment of {installmentMin}" } },
  { icon: "repeat",
    title: { pt: "Primeira troca grátis", en: "First exchange free" },
    text:  { pt: "Em até 30 dias depois da entrega", en: "Within 30 days of delivery" } },
  { icon: "badge-percent",
    title: { pt: "5% off no Pix", en: "5% off with Pix" },
    text:  { pt: "Desconto no valor dos produtos", en: "Discount on the product total" } }
];

/* ---------- Vitrine com abas ---------- */
/* Cupom de boas-vindas da newsletter: 10% na primeira compra. */
TRAMMA.newsletterCoupon = { code: "BEMVINDO10", percent: 10 };

/* Curadoria da vitrine (site): as 4 listas do Aurum, mais Novidades.
   Ordem: o que a loja escolheu, o que chegou, prova social (volume e nota,
   juntas) e, por último, promoção: marca premium não abre pelo desconto.
   Destaques usa a marcação isFeatured; Mais bem avaliados, a nota. */
TRAMMA.curation = [
  { id: "destaques",     label: { pt: "Destaques",          en: "Featured" },    href: "loja.html?destaque=1",
    pick: function (p) { return p.isFeatured; } },
  { id: "novidades",     label: { pt: "Novidades",          en: "New in" },      href: "loja.html?ordem=novidades",
    pick: function (p) { return p.isNew; } },
  { id: "mais-vendidos", label: { pt: "Mais vendidos",      en: "Best sellers" }, href: "loja.html?ordem=mais-vendidos",
    pick: function (p) { return p.isBestSeller; } },
  { id: "mais-avaliados", label: { pt: "Mais bem avaliados", en: "Top rated" },  href: "loja.html?ordem=avaliacao",
    pick: function (p) { return (p.rating || 0) >= 4.7; } },
  { id: "promocoes",     label: { pt: "Promoções",          en: "On sale" },     href: "loja.html?promocao=1",
    pick: function (p) { return !!p.salePrice; } }
];

/* Vitrine antiga, com 3 abas: só o app ainda usa. */
TRAMMA.showcaseTabs = [
  { id: "mais-vendidos", label: { pt: "Mais vendidos", en: "Best sellers" }, href: "loja.html?ordem=mais-vendidos",
    pick: function (p) { return p.isBestSeller; } },
  { id: "novidades",     label: { pt: "Novidades",     en: "New in" },       href: "loja.html?ordem=novidades",
    pick: function (p) { return p.isNew; } },
  { id: "promocoes",     label: { pt: "Promoções",     en: "On sale" },      href: "loja.html?promocao=1",
    pick: function (p) { return !!p.salePrice; } }
];

/* ---------- Banner de campanha ---------- */
TRAMMA.campaign = {
  eyebrow: { pt: "Linha Pesada", en: "Heavy line" },
  title:   { pt: "Malha de 240 a 260 g/m²", en: "Fabric from 240 to 260 g/m²" },
  text:    { pt: "Encorpada, opaca e com caimento firme. Feita para durar anos, não estações.",
             en: "Dense, opaque and with a firm drape. Made to last years, not seasons." },
  cta:     { pt: "Ver a linha Pesada", en: "See the Heavy line" },
  href: "loja.html?gramatura=pesada",
  image: "img/fotos/campanha.jpg",
  alt:     { pt: "Pessoa de costas, com camiseta preta, diante de uma parede de tijolos claros",
             en: "Person seen from behind in a black tee, in front of a light brick wall" }
};

/* ---------- Na vida real (galeria) ---------- */
TRAMMA.gallery = [
  { image: "img/fotos/vida-real-1.jpg", alt: { pt: "Pessoa de camiseta branca lisa num gramado",
                                               en: "Person in a plain white tee on a lawn" } },
  { image: "img/fotos/vida-real-2.jpg", alt: { pt: "Pessoa de camiseta branca e bolsa marrom numa escada",
                                               en: "Person in a white tee with a brown bag on a staircase" } },
  { image: "img/fotos/vida-real-3.jpg", alt: { pt: "Pessoa de camiseta branca e saia xadrez diante de uma parede verde",
                                               en: "Person in a white tee and a plaid skirt in front of a green wall" } },
  { image: "img/fotos/vida-real-4.jpg", alt: { pt: "Pessoa de camiseta preta num museu, com quadros ao fundo",
                                               en: "Person in a black tee in a museum, with paintings in the background" } },
  { image: "img/fotos/vida-real-5.jpg", alt: { pt: "Pessoa de camiseta branca lisa com as mãos nos bolsos",
                                               en: "Person in a plain white tee with hands in pockets" } },
  { image: "img/fotos/vida-real-6.jpg", alt: { pt: "Pessoa de camiseta preta e jeans diante de uma parede de concreto",
                                               en: "Person in a black tee and jeans in front of a concrete wall" } }
];

/* ---------- Perguntas frequentes (home) ---------- */
TRAMMA.faq = [
  { q: { pt: "O que é gramatura?", en: "What is fabric weight?" },
    a: { pt: "É o peso do tecido por metro quadrado (g/m²). Quanto maior, mais encorpada e opaca é a malha. Nossas camisetas vão de 140 g/m² (leves) a 280 g/m² (térmicas).",
         en: "It's the weight of the fabric per square meter (g/m²). The higher it is, the denser and more opaque the knit. Our tees range from 140 g/m² (light) to 280 g/m² (thermal)." } },
  { q: { pt: "Como escolho o tamanho?", en: "How do I choose my size?" },
    a: { pt: "Cada produto tem uma tabela de medidas em centímetros. Compare com uma camiseta que você já tem e gosta do caimento.",
         en: "Every product has a size chart in centimeters. Compare it with a tee you already own and like the fit of." } },
  { q: { pt: "Qual o prazo de entrega?", en: "How long does delivery take?" },
    a: { pt: "Depende do CEP. Você vê o prazo e o valor do frete na página do produto, antes de colocar na sacola.",
         en: "It depends on your postal code. You see the delivery time and the shipping cost on the product page, before adding to your bag." } },
  { q: { pt: "Como funciona a troca?", en: "How do exchanges work?" },
    a: { pt: "Você tem 30 dias depois da entrega para trocar. A primeira troca é grátis: geramos a etiqueta de envio para você.",
         en: "You have 30 days after delivery to exchange. Your first exchange is free: we create the shipping label for you." } },
  { q: { pt: "Posso pagar com Pix?", en: "Can I pay with Pix?" },
    a: { pt: "Sim. No Pix, você tem 5% de desconto no valor dos produtos. Também aceitamos cartão em até 6x sem juros e boleto.",
         en: "Yes. With Pix, Brazil's instant payment, you get 5% off the product total. We also take credit cards in up to 6 interest-free payments, and boleto." } }
];

/* ---------- Texto alternativo das fotos de produto ----------
   Descreve a foto que está no arquivo (banco gratuito), não a peça ideal.
   Quando a foto mudar, o texto muda junto. */
(function () {
  var alts = {
    "essencial-careca":   { pt: "Camiseta branca lisa pendurada num cabide, contra uma parede cinza",
                            en: "Plain white tee on a hanger, against a gray wall" },
    "essencial-v":        { pt: "Camiseta branca lisa estendida sobre a mesa, com folhas e uma câmera ao lado",
                            en: "Plain white tee laid flat on a table, with leaves and a camera beside it" },
    "pesada-careca":      { pt: "Duas camisetas pretas lisas, de manga curta e manga longa, em cabides de madeira",
                            en: "Two plain black tees, short and long sleeve, on wooden hangers" },
    "henley-curta":       { pt: "Pessoa vestindo uma henley azul-marinho com botões na gola",
                            en: "Person wearing a navy henley with buttons at the collar" },
    "manga-longa-careca": { pt: "Camiseta branca de manga longa dobrada, ao lado de um par de tênis brancos",
                            en: "Folded white long-sleeve tee next to a pair of white sneakers" },
    "oversized-pesada":   { pt: "Pessoa de óculos vestindo uma camiseta preta larga, em estúdio claro",
                            en: "Person with glasses wearing a loose black tee, in a bright studio" },
    "linho-careca":       { pt: "Camiseta branca lisa pendurada numa parede branca",
                            en: "Plain white tee hanging on a white wall" },
    "henley-longa":       { pt: "Duas camisetas dobradas, preta e verde-clara, com galhos de algodão",
                            en: "Two folded tees, black and light green, with cotton branches" },
    "leve-v":             { pt: "Camiseta branca lisa estendida sobre madeira clara, com limões e um chapéu",
                            en: "Plain white tee laid flat on light wood, with lemons and a hat" },
    "oversized-listrada": { pt: "Detalhe de uma camiseta listrada azul e branca, dobrada",
                            en: "Close-up of a folded blue and white striped tee" },
    "pima-pocket":        { pt: "Camiseta azul-clara mesclada pendurada num cabide, contra uma parede branca",
                            en: "Light blue heather tee on a hanger, against a white wall" },
    "termica-longa":      { pt: "Pessoa vestindo camiseta branca de manga longa e calça branca",
                            en: "Person wearing a white long-sleeve tee and white trousers" }
  };
  TRAMMA.products.forEach(function (p) { p.photoAlt = alts[p.id]; });
})();
