/* =====================================================================
   Tramma — idioma (i18n)
   ---------------------------------------------------------------------
   "i18n" é a abreviação de internationalization: o i, 18 letras, o n.

   O que este arquivo faz:
   1. Decide o idioma da página: ?lang=en no endereço, depois a escolha
      salva, depois o padrão (português).
   2. Guarda os textos da interface em dois dicionários, pt e en.
      O conteúdo (produtos, slides, FAQ) fica no data.js, com pt e en
      lado a lado; ver TRAMMA.text().
   3. Formata dinheiro e números no idioma. O idioma traz a moeda junto:
      real em português, dólar em inglês.
   4. Traduz o HTML marcado com data-i18n e data-i18n-attr.

   Vem depois do store.js (precisa dele para lembrar a escolha) e antes
   de components.js e das páginas, que usam TRAMMA.t().
   Arquivo compartilhado: é idêntico em site/ e app/.
   ===================================================================== */

window.TRAMMA = window.TRAMMA || {};

/* ---------- 1. Qual idioma ---------- */
TRAMMA.lang = (function () {
  var supported = ["pt", "en"];
  var fromUrl = new URLSearchParams(location.search).get("lang");
  // O link com ?lang=en vale primeiro e vira a escolha salva:
  // quem abre o link da aula continua em inglês nas próximas páginas.
  if (supported.indexOf(fromUrl) !== -1) {
    TRAMMA.store.set("lang", fromUrl);
    return fromUrl;
  }
  var saved = TRAMMA.store.get("lang", null);
  return supported.indexOf(saved) !== -1 ? saved : "pt";
})();

/* Cada idioma com o seu código de região (para o lang do <html> e para
   o formato de números) e a sua moeda. */
TRAMMA.locale = {
  pt: { tag: "pt-BR", currency: "BRL" },
  en: { tag: "en",    currency: "USD", numberTag: "en-US" }
}[TRAMMA.lang];

/* Câmbio fixo e didático: R$ 5 = US$ 1, sem cotação do dia.
   Os preços ficam guardados em reais no data.js; a conversão só
   acontece na hora de mostrar. */
TRAMMA.exchangeRate = { BRL: 1, USD: 5 };

/* ---------- 2. Textos da interface ----------
   Chave com nome (não o texto em português como chave): se o texto
   mudar, a chave continua a mesma. {nome} marca um valor que entra na
   hora, como TRAMMA.t("greeting", { name: "Ana" }). */
TRAMMA.i18n = {
  pt: {
    /* Página */
    "meta.title": "Tramma | Camisetas básicas premium",
    "meta.description": "Camisetas básicas de algodão Pima e egípcio, com gramatura e composição informadas. Loja fictícia, criada para aulas.",
    "app.meta.title": "Tramma | App",
    "app.meta.description": "Versão app da Tramma, loja fictícia de camisetas básicas premium, criada para aulas.",
    "skip": "Pular para o conteúdo",
    "home.h1": "Tramma, camisetas básicas premium",
    "logo.label": "Tramma, página inicial",
    "language.label": "Idioma",

    /* Faixa, cabeçalho e menus */
    "announcement": "Assine a newsletter e ganhe 10% na primeira compra",
    "menu.open": "Abrir menu",
    "menu.close": "Fechar menu",
    "menu.title": "Menu",
    "nav.main": "Principal",
    "nav.shortcuts": "Atalhos",
    "nav.all": "Todos os produtos",
    "nav.new": "Novidades",
    "nav.tees": "Camisetas",
    "nav.categories": "Categorias",
    "nav.byStyle": "Por modelo",
    "nav.byWeight": "Por gramatura",
    "nav.weightLight": "Leve, até 160 g/m²",
    "nav.weightMedium": "Média, de 180 a 200 g/m²",
    "nav.weightHeavy": "Pesada, 220 g/m² ou mais",
    "nav.highlights": "Destaques",
    "nav.bestSellers": "Mais vendidos",
    "nav.onSale": "Em promoção",
    "nav.allTees": "Ver todas as camisetas",
    "nav.about": "Sobre a Tramma",
    "nav.blog": "Blog",
    "category.gola-careca": "Gola careca",
    "category.gola-v": "Gola V",
    "category.henley": "Henley",
    "category.manga-longa": "Manga longa",
    "category.oversized": "Oversized",

    /* Conta, favoritos e sacola */
    "account.signIn": "Entrar",
    "account.create": "Criar conta",
    "account.mine": "Minha conta",
    "account.orders": "Meus pedidos",
    "account.signOut": "Sair da conta",
    "greeting": "Olá, {name}",
    "favorites": "Favoritos",
    "bag": "Sacola",
    "bag.label.empty": "Sacola, vazia",
    "bag.label.one": "Sacola, 1 item",
    "bag.label.many": "Sacola, {n} itens",

    /* Busca */
    "search.label": "Buscar produtos",
    "search.placeholder": "Buscar camisetas",
    "search.submit": "Buscar",
    "search.close": "Fechar busca",

    /* Estados da home */
    "loading": "Carregando produtos…",
    "error.title": "Não foi possível carregar os produtos",
    "error.text": "Verifique sua conexão e tente de novo.",
    "error.retry": "Tentar de novo",

    /* Slider */
    "carousel.label": "Destaques",
    "carousel.roledescription": "carrossel",
    "carousel.slide": "slide",
    "carousel.position": "{n} de {total}",
    "carousel.goTo": "Ir para o slide {n} de {total}",
    "carousel.prev": "Slide anterior",
    "carousel.next": "Próximo slide",
    "carousel.pause": "Pausar a passagem dos slides",
    "carousel.play": "Retomar a passagem dos slides",

    /* Seções da home */
    "benefits.label": "Benefícios",
    "showcase.eyebrow": "Vitrine",
    "showcase.title": "Escolhidas a dedo",
    "showcase.all": "Ver todos os produtos",
    "showcase.allTab": "Ver todos: {tab}",
    "categories.title": "Compre por modelo",
    "categories.all": "Ver todas",
    "categories.allHidden": " as camisetas",
    "spec.eyebrow": "Ficha técnica",
    "spec.title": "O que faz uma camiseta durar",
    "spec.text": "Toda peça mostra gramatura e composição. Você compara antes de comprar, como faria com qualquer produto técnico.",
    "spec.alt": "Detalhe aproximado de uma malha de algodão em tom cru",
    "spec.weight": "Gramatura",
    "spec.weightValue": "140 a 280 g/m²",
    "spec.yarn": "Fio",
    "spec.yarnValue": "Algodão Pima e egípcio, fio longo",
    "spec.seam": "Costura",
    "spec.seamValue": "Dupla na barra e nas mangas",
    "spec.collar": "Gola",
    "spec.collarValue": "Ribana com elastano, não abre",
    "spec.link": "Conheça nossos tecidos",
    "recommended.title": "Recomendados para você",
    "recent.title": "Vistos recentemente",
    "gallery.eyebrow": "Na vida real",
    "gallery.title": "Feitas para o dia a dia",
    "about.eyebrow": "Sobre a Tramma",
    "about.title": "Camiseta básica, levada a sério",
    "about.text": "A Tramma faz um produto só, e faz com cuidado: fio longo, malha estável e costura que aguenta lavagem. Em vez de coleção nova a cada estação, a gente melhora as mesmas peças.",
    "about.link": "Conheça a Tramma",
    "faq.title": "Perguntas frequentes",
    "faq.all": "Ver todas as perguntas",

    /* Card de produto */
    "card.soldOut": "Esgotado",
    "card.lastUnits": "Últimas unidades",
    "card.new": "Novo",
    "card.bestSeller": "Mais vendido",
    "card.colors": "Cores: {list}.",
    "card.reviews": " avaliações",
    "card.rating": "Nota {value} de 5.",
    "card.noReviews": "Sem avaliações",
    "card.was": "De ",
    "card.now": "por ",
    "card.installments": "ou {n}x de {value} sem juros",
    "card.favorite": "Favoritar {name}",

    /* Favoritos e toasts */
    "favorites.signIn": "Entre na sua conta para salvar favoritos.",
    "favorites.added": "Adicionado aos favoritos.",
    "favorites.removed": "Removido dos favoritos.",
    "undo": "Desfazer",

    /* Newsletter e rodapé */
    "newsletter.title": "Receba novidades e ofertas",
    "newsletter.incentive": "Assine e ganhe 10% na primeira compra.",
    "newsletter.perk1": "Frete grátis na primeira compra",
    "newsletter.perk2": "Novidades antes de todo mundo",
    "newsletter.perk3": "Ofertas só para assinantes",
    "newsletter.trust": "Sem spam. Você cancela quando quiser.",
    "newsletter.email": "E-mail",
    "newsletter.submit": "Assinar a newsletter",
    "newsletter.sending": "Enviando…",
    "newsletter.errorEmpty": "Informe seu e-mail.",
    "newsletter.errorInvalid": "Digite um e-mail válido, como nome@exemplo.com.",
    "newsletter.done": "Pronto. Você vai receber novidades e ofertas no e-mail {email}. Seu cupom de boas-vindas (10% e frete grátis na primeira compra): {code}.",
    "newsletter.already": "Você já recebe a newsletter no e-mail {email}.",
    "footer.label": "Rodapé",
    "footer.help": "Ajuda",
    "footer.shipping": "Entrega e prazos",
    "footer.exchanges": "Trocas e devoluções",
    "footer.track": "Rastrear pedido",
    "footer.brand": "A Tramma",
    "footer.tagline": "Camiseta básica premium: tecido, caimento e durabilidade.",
    "footer.social": "Redes sociais",
    "footer.sizes": "Tabela de medidas",
    "footer.cookies": "Preferências de cookies",
    "footer.payment": "Pagamento: Pix, boleto ou cartão de crédito em até 6x sem juros.",
    "footer.fictional": "Tramma é uma loja fictícia, criada para aulas de design de interfaces.",

    /* Cookies */
    "cookies.title": "Cookies",
    "cookies.text": "Usamos cookies essenciais para a loja funcionar. Os outros nos ajudam a melhorar o site, e você escolhe se aceita.",
    "app.cookies.text": "Usamos cookies essenciais para o app funcionar. Os outros nos ajudam a melhorar o app, e você escolhe se aceita.",
    "cookies.all": "Aceitar todos",
    "cookies.essential": "Só os essenciais",
    "cookies.customize": "Personalizar cookies",
    "cookies.savedAll": "Preferência salva: todos os cookies.",
    "cookies.savedEssential": "Preferência salva: só os cookies essenciais.",

    /* App */
    "app.notifications": "Notificações",
    "app.home": "Início",
    "app.orders": "Pedidos",
    "app.account": "Conta",
    "app.offline": "Sem conexão. Você ainda vê o que já foi carregado.",
    "app.online": "Conexão de volta."
  },

  en: {
    "meta.title": "Tramma | Premium basic tees",
    "meta.description": "Basic tees in Pima and Egyptian cotton, with fabric weight and composition on every product. A fictional store, made for teaching.",
    "app.meta.title": "Tramma | App",
    "app.meta.description": "App version of Tramma, a fictional store of premium basic tees, made for teaching.",
    "skip": "Skip to content",
    "home.h1": "Tramma, premium basic tees",
    "logo.label": "Tramma, home page",
    "language.label": "Language",

    "announcement": "Subscribe to our newsletter and get 10% off your first order",
    "menu.open": "Open menu",
    "menu.close": "Close menu",
    "menu.title": "Menu",
    "nav.main": "Main",
    "nav.shortcuts": "Shortcuts",
    "nav.all": "All products",
    "nav.new": "New in",
    "nav.tees": "Tees",
    "nav.categories": "Categories",
    "nav.byStyle": "By style",
    "nav.byWeight": "By fabric weight",
    "nav.weightLight": "Light, up to 160 g/m²",
    "nav.weightMedium": "Medium, 180 to 200 g/m²",
    "nav.weightHeavy": "Heavy, 220 g/m² or more",
    "nav.highlights": "Highlights",
    "nav.bestSellers": "Best sellers",
    "nav.onSale": "On sale",
    "nav.allTees": "See all tees",
    "nav.about": "About Tramma",
    "nav.blog": "Blog",
    "category.gola-careca": "Crew neck",
    "category.gola-v": "V-neck",
    "category.henley": "Henley",
    "category.manga-longa": "Long sleeve",
    "category.oversized": "Oversized",

    "account.signIn": "Sign in",
    "account.create": "Create account",
    "account.mine": "My account",
    "account.orders": "My orders",
    "account.signOut": "Sign out",
    "greeting": "Hi, {name}",
    "favorites": "Favorites",
    "bag": "Bag",
    "bag.label.empty": "Bag, empty",
    "bag.label.one": "Bag, 1 item",
    "bag.label.many": "Bag, {n} items",

    "search.label": "Search products",
    "search.placeholder": "Search tees",
    "search.submit": "Search",
    "search.close": "Close search",

    "loading": "Loading products…",
    "error.title": "We couldn't load the products",
    "error.text": "Check your connection and try again.",
    "error.retry": "Try again",

    "carousel.label": "Highlights",
    "carousel.roledescription": "carousel",
    "carousel.slide": "slide",
    "carousel.position": "{n} of {total}",
    "carousel.goTo": "Go to slide {n} of {total}",
    "carousel.prev": "Previous slide",
    "carousel.next": "Next slide",
    "carousel.pause": "Pause the slideshow",
    "carousel.play": "Resume the slideshow",

    "benefits.label": "Benefits",
    "showcase.eyebrow": "Showcase",
    "showcase.title": "Hand-picked",
    "showcase.all": "See all products",
    "showcase.allTab": "See all: {tab}",
    "categories.title": "Shop by style",
    "categories.all": "See all",
    "categories.allHidden": " tees",
    "spec.eyebrow": "Spec sheet",
    "spec.title": "What makes a tee last",
    "spec.text": "Every piece lists its fabric weight and composition. You compare before you buy, as you would with any technical product.",
    "spec.alt": "Close-up of a raw-colored cotton knit",
    "spec.weight": "Fabric weight",
    "spec.weightValue": "140 to 280 g/m²",
    "spec.yarn": "Yarn",
    "spec.yarnValue": "Pima and Egyptian cotton, long staple",
    "spec.seam": "Stitching",
    "spec.seamValue": "Double-stitched hem and sleeves",
    "spec.collar": "Collar",
    "spec.collarValue": "Rib knit with elastane, keeps its shape",
    "spec.link": "Discover our fabrics",
    "recommended.title": "Recommended for you",
    "recent.title": "Recently viewed",
    "gallery.eyebrow": "In real life",
    "gallery.title": "Made for every day",
    "about.eyebrow": "About Tramma",
    "about.title": "The basic tee, taken seriously",
    "about.text": "Tramma makes one product, and makes it with care: long-staple yarn, a stable knit and seams that survive the wash. Instead of a new collection every season, we keep improving the same pieces.",
    "about.link": "Get to know Tramma",
    "faq.title": "Frequently asked questions",
    "faq.all": "See all questions",

    "card.soldOut": "Sold out",
    "card.lastUnits": "Last few left",
    "card.new": "New",
    "card.bestSeller": "Best seller",
    "card.colors": "Colors: {list}.",
    "card.reviews": " reviews",
    "card.rating": "Rated {value} out of 5.",
    "card.noReviews": "No reviews yet",
    "card.was": "Was ",
    "card.now": "now ",
    "card.installments": "or {n} interest-free payments of {value}",
    "card.favorite": "Add {name} to favorites",

    "favorites.signIn": "Sign in to save favorites.",
    "favorites.added": "Added to favorites.",
    "favorites.removed": "Removed from favorites.",
    "undo": "Undo",

    "newsletter.title": "Get news and offers",
    "newsletter.incentive": "Subscribe and get 10% off your first order.",
    "newsletter.perk1": "Free shipping on your first order",
    "newsletter.perk2": "New arrivals before anyone else",
    "newsletter.perk3": "Subscriber-only offers",
    "newsletter.trust": "No spam. Unsubscribe anytime.",
    "newsletter.email": "Email",
    "newsletter.submit": "Subscribe to the newsletter",
    "newsletter.sending": "Sending…",
    "newsletter.errorEmpty": "Enter your email.",
    "newsletter.errorInvalid": "Enter a valid email, like name@example.com.",
    "newsletter.done": "Done. You'll get news and offers at {email}. Your welcome code (10% off and free shipping on your first order): {code}.",
    "newsletter.already": "You already get the newsletter at {email}.",
    "footer.label": "Footer",
    "footer.help": "Help",
    "footer.shipping": "Shipping and delivery times",
    "footer.exchanges": "Exchanges and returns",
    "footer.track": "Track your order",
    "footer.brand": "Tramma",
    "footer.tagline": "Premium basic tees: fabric, fit and durability.",
    "footer.social": "Social media",
    "footer.sizes": "Size chart",
    "footer.cookies": "Cookie preferences",
    "footer.payment": "Payment: Pix, boleto or credit card in up to 6 interest-free payments.",
    "footer.fictional": "Tramma is a fictional store, made for interface design classes.",

    "cookies.title": "Cookies",
    "cookies.text": "We use essential cookies to run the store. The others help us improve the site, and you choose whether to accept them.",
    "app.cookies.text": "We use essential cookies to run the app. The others help us improve the app, and you choose whether to accept them.",
    "cookies.all": "Accept all",
    "cookies.essential": "Essential only",
    "cookies.customize": "Customize cookies",
    "cookies.savedAll": "Preference saved: all cookies.",
    "cookies.savedEssential": "Preference saved: essential cookies only.",

    "app.notifications": "Notifications",
    "app.home": "Home",
    "app.orders": "Orders",
    "app.account": "Account",
    "app.offline": "You're offline. You can still see what has already loaded.",
    "app.online": "Back online."
  }
};

/* ---------- Funções que as páginas usam ---------- */

/* Troca {nome} pelo valor. O resultado é texto puro: quem for pôr no
   innerHTML passa antes pelo esc() do components.js. */
TRAMMA.fill = function (text, vars) {
  return !vars ? text : text.replace(/\{(\w+)\}/g, function (all, name) {
    return name in vars ? vars[name] : all;
  });
};

/* Texto da interface pela chave. Se faltar no idioma escolhido, usa o
   português; se faltar nos dois, mostra a chave, para o erro aparecer. */
TRAMMA.t = function (key, vars) {
  var text = TRAMMA.i18n[TRAMMA.lang][key];
  if (text === undefined) text = TRAMMA.i18n.pt[key];
  if (text === undefined) text = key;
  return TRAMMA.fill(text, vars);
};

/* Conteúdo do data.js: { pt: "...", en: "..." } vira o texto do idioma.
   Texto sem tradução (string comum, como "Henley") passa direto. */
TRAMMA.text = function (field, vars) {
  if (field && typeof field === "object") field = field[TRAMMA.lang] || field.pt;
  return TRAMMA.fill(field, vars);
};

/* Dinheiro: recebe o valor em reais e mostra na moeda do idioma.
   R$ 1.234,56 em português · $246.91 em inglês. */
TRAMMA.money = function (brl) {
  var value = brl / TRAMMA.exchangeRate[TRAMMA.locale.currency];
  return value.toLocaleString(TRAMMA.locale.numberTag || TRAMMA.locale.tag,
    { style: "currency", currency: TRAMMA.locale.currency });
};

/* Número no formato do idioma: 4,8 em português · 4.8 em inglês. */
TRAMMA.number = function (value) {
  return value.toLocaleString(TRAMMA.locale.numberTag || TRAMMA.locale.tag);
};

/* ---------- 4. Traduz o HTML marcado ----------
   data-i18n="chave"                 troca o texto do elemento
   data-i18n-attr="atributo:chave"   troca atributos (vários com ";")
   O português escrito no HTML é o padrão sem JS e a referência para
   quem lê o código; o dicionário é quem manda. */
TRAMMA.translatePage = function (root) {
  root = root || document;
  root.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = TRAMMA.t(el.getAttribute("data-i18n"));
  });
  root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
    el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
      var parts = pair.split(":");
      el.setAttribute(parts[0].trim(), TRAMMA.t(parts[1].trim()));
    });
  });
};

/* O lang do <html> diz ao leitor de tela em que idioma pronunciar
   (WCAG 3.1.1). Muda antes de traduzir, junto com o resto. */
document.documentElement.lang = TRAMMA.locale.tag;
TRAMMA.translatePage();
