/* =====================================================================
   Tramma — home (I1)
   ---------------------------------------------------------------------
   Monta as seções da home a partir dos dados e controla os estados:
   loading (esqueleto) → carregada · error-load · guest/logged ·
   vistos recentemente (com ou sem).

   PARÂMETROS DE REVISÃO (temporários, para ver cada estado em aula):
   ?estado=logged      entra com a "conta completa" (saudação, recomendados, vistos)
   ?estado=loading     fica no esqueleto, sem terminar de carregar
   ?estado=error-load  a primeira carga falha; "Tentar de novo" funciona

   Arquivo compartilhado: é idêntico em site/ e app/.
   ===================================================================== */

(function () {
  var ui = TRAMMA.ui;
  var esc = ui.esc;
  var t = TRAMMA.t;       // texto da interface pela chave (i18n.js)
  var text = TRAMMA.text; // conteúdo do data.js no idioma da página
  var review = TRAMMA.session.reviewState;
  var account = TRAMMA.session.account();
  var LOAD_TIME = 800; // espera simulada da rede, em ms
  var failNext = review === "error-load";

  /* ---------- Elementos fixos ----------
     Cada init ignora o elemento que a página não tem. Por isso este mesmo
     arquivo serve ao app, que não tem faixa de aviso, cabeçalho do site,
     menu lateral, newsletter nem rodapé. */
  ui.initLanguageSwitcher(document.getElementById("language-switcher"));
  ui.initLanguageSwitcher(document.getElementById("menu-language-switcher"));
  ui.initSheet(document.getElementById("site-menu"), document.getElementById("site-menu-open"));
  ui.renderSheetAccount(document.getElementById("site-menu-account"));
  ui.renderHeaderAccount(document.getElementById("header-account"));
  ui.initNavigationMenu(document.getElementById("navigation-menu"));
  ui.initHeaderSearch(document.querySelector(".site-header"));
  ui.initFooterColumns(document.querySelector(".site-footer"));
  ui.updateBagCounter();
  ui.initNewsletter(document.getElementById("newsletter"));
  ui.initNewsletter(document.getElementById("newsletter-band"));
  ui.initCookieBanner(document.getElementById("cookie-banner"));
  ui.initFavorites(document.getElementById("main"));

  /* =====================================================================
     Conteúdo fixo: dado local, aparece na hora (não depende da carga)
     ===================================================================== */

  /* ---------- Saudação (só logged) ---------- */
  if (account) {
    var greeting = document.getElementById("greeting");
    greeting.textContent = t("greeting", { name: account.name.split(" ")[0] });
    greeting.hidden = false;
  }

  /* ---------- Faixa de benefícios ----------
     Os valores vêm das regras (data.js) e saem na moeda do idioma. */
  var ruleValues = {
    freeShipping: TRAMMA.money(TRAMMA.rules.freeShippingMin),
    installmentMin: TRAMMA.money(TRAMMA.rules.installmentMin)
  };
  document.getElementById("benefits-list").innerHTML = TRAMMA.benefits.map(function (b) {
    return '<li class="benefit-strip__item">' + ui.icon(b.icon) +
      '<p><span class="benefit-strip__title">' + esc(text(b.title)) + '</span>' +
      '<span class="benefit-strip__text">' + esc(text(b.text, ruleValues)) + '</span></p></li>';
  }).join("");

  /* ---------- Banner de campanha ---------- */
  var c = TRAMMA.campaign;
  document.getElementById("campaign").innerHTML =
    '<img class="campaign-banner__media" src="' + c.image + '" alt="' + esc(text(c.alt)) + '" width="1600" height="900" loading="lazy">' +
    '<div class="container campaign-banner__content">' +
      '<p class="eyebrow">' + esc(text(c.eyebrow)) + '</p>' +
      '<h2 class="campaign-banner__title" id="campaign-title">' + esc(text(c.title)) + '</h2>' +
      '<p>' + esc(text(c.text)) + '</p>' +
      '<a class="button" href="' + c.href + '">' + esc(text(c.cta)) + '</a>' +
    '</div>';

  /* ---------- Mosaico de categorias ----------
     A foto tem alt="": o nome da categoria, logo abaixo, já é o texto do link. */
  document.getElementById("categories-list").innerHTML = TRAMMA.categories.map(function (cat) {
    return '<li><a class="category-tile" href="categoria.html?c=' + cat.id + '">' +
      '<span class="category-tile__media"><img src="' + TRAMMA.photo.category(cat.id) + '" alt="" width="400" height="500" loading="lazy"></span>' +
      '<span class="category-tile__name">' + esc(t("category." + cat.id)) + ui.icon("arrow-right", "sm") + '</span>' +
    '</a></li>';
  }).join("");

  /* ---------- Na vida real (só no app, até ele receber a ordem nova) ---------- */
  var galleryList = document.getElementById("gallery-list");
  if (galleryList) galleryList.innerHTML = TRAMMA.gallery.map(function (g) {
    return '<li><img src="' + g.image + '" alt="' + esc(text(g.alt)) + '" width="600" height="600" loading="lazy"></li>';
  }).join("");

  /* ---------- Perguntas frequentes (accordion) ---------- */
  document.getElementById("faq-list").innerHTML = TRAMMA.faq.map(function (f) {
    return '<details class="accordion__item">' +
      '<summary class="accordion__trigger">' + esc(text(f.q)) + ui.icon("chevron-down") + '</summary>' +
      '<div class="accordion__content"><p>' + esc(text(f.a)) + '</p></div>' +
    '</details>';
  }).join("");

  /* =====================================================================
     Conteúdo de produtos: passa pelos estados loading / error-load
     ===================================================================== */

  var byId = {};
  TRAMMA.products.forEach(function (p) { byId[p.id] = p; });
  var favorites = account ? account.favorites || [] : [];

  /* ---------- Vitrine com abas (só no app, até ele receber a vitrine nova) ----------
     O site já usa a vitrine com chips. Sem a seção, este bloco não roda. */
  var hasTabs = !!document.getElementById("showcase-tabs");
  if (hasTabs) {
  var tabList = document.querySelector("#showcase-tabs .tabs__list");
  var panels = document.getElementById("showcase-panels");
  tabList.innerHTML = TRAMMA.showcaseTabs.map(function (s) {
    return '<button type="button" class="tabs__trigger" role="tab" id="tab-' + s.id + '" aria-controls="panel-' + s.id + '">' + esc(text(s.label)) + '</button>';
  }).join("");
  panels.innerHTML = TRAMMA.showcaseTabs.map(function (s) {
    // tabindex="0": o painel recebe foco, para quem usa teclado chegar ao conteúdo.
    return '<div class="tabs__panel" role="tabpanel" id="panel-' + s.id + '" aria-labelledby="tab-' + s.id + '" tabindex="0"><ul class="rail" role="list"></ul></div>';
  }).join("");
  // O botão "Ver todos" acompanha a aba escolhida.
  var showcaseAll = document.getElementById("showcase-all");
  ui.initTabs(document.getElementById("showcase-tabs"), function (tab) {
    var s = TRAMMA.showcaseTabs.filter(function (x) { return "tab-" + x.id === tab.id; })[0];
    showcaseAll.href = s.href;
    showcaseAll.textContent = t("showcase.allTab", { tab: text(s.label).toLowerCase() });
  });
  }

  /* ---------- Vitrine com chips ----------
     Curadoria por MOMENTO: Destaques, Novidades, Mais vendidos, Mais bem
     avaliados e Promoções (dados em TRAMMA.curation). Não repete o eixo de "Compre por modelo", que
     navega por tipo de camiseta. Mesmo componente tabs; os ids levam
     "chip-" para não colidir com a vitrine antiga, que o app ainda usa. */
  // O app ainda não tem esta seção: sem ela, a lista de chips fica vazia.
  var hasChips = !!document.getElementById("showcase-chips");
  var chips = !hasChips ? [] : TRAMMA.curation.map(function (s) {
    return { id: s.id, label: text(s.label), href: s.href,
      // Mais bem avaliados: maior nota primeiro.
      pick: function () {
        var list = TRAMMA.products.filter(s.pick);
        return s.id === "mais-avaliados" ? list.sort(function (a, b) { return b.rating - a.rating; }) : list;
      } };
  });
  if (hasChips) {
  document.querySelector("#showcase-chips-tabs .tabs__list").innerHTML = chips.map(function (c) {
    return '<button type="button" class="tabs__trigger" role="tab" id="chip-' + c.id + '" aria-controls="chip-panel-' + c.id + '">' + esc(c.label) + '</button>';
  }).join("");
  document.getElementById("showcase-chips-panels").innerHTML = chips.map(function (c) {
    return '<div class="tabs__panel" role="tabpanel" id="chip-panel-' + c.id + '" aria-labelledby="chip-' + c.id + '" tabindex="0"><ul class="rail" role="list"></ul></div>';
  }).join("");
  var chipsAll = document.getElementById("showcase-chips-all");
  ui.initTabs(document.getElementById("showcase-chips-tabs"), function (tab) {
    var c = chips.filter(function (x) { return "chip-" + x.id === tab.id; })[0];
    chipsAll.href = c.href;
    chipsAll.textContent = t("showcase.allTab", { tab: c.label.toLowerCase() });
  });
  }

  // Cada lista de produtos: o <ul>, a seção que a envolve e a regra que escolhe os produtos.
  var lists = (hasTabs ? TRAMMA.showcaseTabs : []).map(function (s) {
    return { list: document.querySelector("#panel-" + s.id + " ul"), section: document.getElementById("showcase"),
      pick: function () { return TRAMMA.products.filter(s.pick).slice(0, 4); } };
  });
  chips.forEach(function (c) {
    lists.push({ list: document.querySelector("#chip-panel-" + c.id + " ul"), section: document.getElementById("showcase-chips"),
      pick: function () { return c.pick().slice(0, 4); } });
  });
  lists.push({ list: document.querySelector("#recommended ul"), section: document.getElementById("recommended"), onlyLogged: true,
    pick: function () {
      // Recomendados: os mais bem avaliados que a pessoa ainda não favoritou nem viu.
      var seen = favorites.concat(account.recentlyViewed || []);
      return TRAMMA.products
        .filter(function (p) { return seen.indexOf(p.id) === -1 && p.stock > 0 && p.rating; })
        .sort(function (a, b) { return b.rating - a.rating; })
        .slice(0, 4);
    } });
  lists.push({ list: document.querySelector("#recently-viewed ul"), section: document.getElementById("recently-viewed"),
    pick: function () {
      var ids = account ? account.recentlyViewed || [] : TRAMMA.store.get("recently-viewed", []);
      return ids.map(function (id) { return byId[id]; }).filter(Boolean);
    } });

  function rail(products) {
    return products.map(function (p) { return '<li>' + ui.productCard(p, favorites) + '</li>'; }).join("");
  }

  function skeletons(n) {
    var html = "";
    for (var i = 0; i < n; i++) html += '<li>' + ui.productCardSkeleton() + '</li>';
    return html;
  }

  /* ---------- Slider ---------- */
  function renderHero() {
    var slides = TRAMMA.heroSlides;
    var hero = document.getElementById("hero");
    hero.innerHTML =
      // Os controles vêm ANTES dos slides no HTML: assim o botão de pausar
      // é o primeiro item do Tab (padrão APG). No visual, ficam na base.
      '<div class="carousel__controls"><div class="container carousel__controls-inner">' +
        '<button type="button" class="button" data-variant="ghost" data-size="icon" data-carousel-toggle></button>' +
        '<div class="carousel__dots">' +
          slides.map(function (s, i) {
            return '<button type="button" class="carousel__dot" aria-label="' + esc(t("carousel.goTo", { n: i + 1, total: slides.length })) + '"></button>';
          }).join("") +
        '</div>' +
        '<div class="carousel__nav">' +
          '<button type="button" class="button" data-variant="ghost" data-size="icon" data-carousel-prev aria-label="' + esc(t("carousel.prev")) + '">' + ui.icon("chevron-left") + '</button>' +
          '<button type="button" class="button" data-variant="ghost" data-size="icon" data-carousel-next aria-label="' + esc(t("carousel.next")) + '">' + ui.icon("chevron-right") + '</button>' +
        '</div>' +
      '</div></div>' +
      '<div class="carousel__viewport" aria-live="off">' +
        '<div class="carousel__track">' +
          slides.map(function (s, i) {
            return '<div class="carousel__slide" role="group" aria-roledescription="' + esc(t("carousel.slide")) + '" aria-label="' + esc(t("carousel.position", { n: i + 1, total: slides.length })) + '">' +
              '<div class="carousel__media"><img src="' + s.image + '" alt="' + esc(text(s.alt)) + '" width="1600" height="900"></div>' +
              '<div class="carousel__content container">' +
                '<p class="carousel__eyebrow eyebrow">' + esc(text(s.eyebrow)) + '</p>' +
                // h2: o h1 da página é o título "Tramma", escondido visualmente.
                '<h2 class="carousel__title">' + esc(text(s.title)) + '</h2>' +
                '<p>' + esc(text(s.text)) + '</p>' +
                '<a class="button" href="' + s.href + '">' + esc(text(s.cta)) + '</a>' +
              '</div>' +
            '</div>';
          }).join("") +
        '</div>' +
      '</div>';
    ui.initCarousel(hero);
  }

  /* ---------- Estados ---------- */
  var main = document.getElementById("main");
  var errorBox = document.getElementById("home-error");
  var heroSkeleton = '<div class="skeleton" data-shape="hero" aria-hidden="true"></div>';

  function setLoading() {
    main.setAttribute("aria-busy", "true");
    errorBox.hidden = true;
    document.getElementById("hero").innerHTML = heroSkeleton;
    lists.forEach(function (l) {
      // Seções que dependem de dados da pessoa só aparecem se fizerem sentido.
      l.section.hidden = (l.onlyLogged && !account) || (l.section.id === "recently-viewed" && !l.pick().length);
      l.list.innerHTML = skeletons(4);
    });
    document.getElementById("loading-status").textContent = t("loading");
  }

  function setLoaded() {
    main.removeAttribute("aria-busy");
    renderHero();
    lists.forEach(function (l) {
      if (l.section.hidden) return;
      l.list.innerHTML = rail(l.pick());
    });
    document.getElementById("loading-status").textContent = "";
  }

  function setError() {
    main.removeAttribute("aria-busy");
    document.getElementById("hero").innerHTML = "";
    lists.forEach(function (l) { l.section.hidden = true; });
    errorBox.hidden = false;
    document.getElementById("loading-status").textContent = "";
  }

  function load() {
    setLoading();
    if (review === "loading") return; // revisão: fica no esqueleto
    var fail = failNext;
    failNext = false; // só a primeira tentativa falha
    TRAMMA.simulate(LOAD_TIME, fail).then(setLoaded, setError);
  }

  document.getElementById("home-retry").addEventListener("click", function () {
    load();
    main.focus(); // o botão some; o foco volta ao começo do conteúdo
  });

  load();
})();
