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
   ===================================================================== */

(function () {
  var ui = TRAMMA.ui;
  var review = TRAMMA.session.reviewState;
  var account = TRAMMA.session.account();
  var LOAD_TIME = 800; // espera simulada da rede, em ms
  var failNext = review === "error-load";

  /* ---------- Elementos fixos (valem em toda página do site) ---------- */
  ui.initAnnouncementBar(document.getElementById("announcement-bar"));
  ui.initSheet(document.getElementById("site-menu"), document.getElementById("site-menu-open"));
  ui.renderSheetAccount(document.getElementById("site-menu-account"));
  ui.renderHeaderAccount(document.getElementById("header-account"));
  ui.initNavigationMenu(document.getElementById("navigation-menu"));
  ui.initFooterColumns(document.querySelector(".site-footer"));
  ui.updateBagCounter();
  ui.initNewsletter(document.getElementById("newsletter"));
  ui.initCookieBanner(document.getElementById("cookie-banner"));
  ui.initFavorites(document.getElementById("main"));

  /* ---------- Atalhos de categoria: dado local, aparece na hora ---------- */
  document.getElementById("categories-list").innerHTML = TRAMMA.categories.map(function (c) {
    return '<li><a class="category-chip" href="categoria.html?c=' + c.id + '">' + ui.esc(c.name) + '</a></li>';
  }).join("");

  /* ---------- Saudação (só logged) ---------- */
  if (account) {
    var greeting = document.getElementById("greeting");
    greeting.querySelector("[data-name]").textContent = account.name.split(" ")[0];
    greeting.hidden = false;
  }

  /* ---------- Seções de produto ---------- */
  var byId = {};
  TRAMMA.products.forEach(function (p) { byId[p.id] = p; });
  var favorites = account ? account.favorites || [] : [];

  // Cada seção: o id da <section> e a regra que escolhe os produtos.
  var sections = [
    { id: "new-arrivals", pick: function () { return TRAMMA.products.filter(function (p) { return p.isNew; }); } },
    { id: "best-sellers", pick: function () { return TRAMMA.products.filter(function (p) { return p.isBestSeller; }); } },
    { id: "recommended", onlyLogged: true, pick: function () {
        // Recomendados: os mais bem avaliados que a pessoa ainda não favoritou nem viu.
        var seen = favorites.concat(account.recentlyViewed || []);
        return TRAMMA.products
          .filter(function (p) { return seen.indexOf(p.id) === -1 && p.stock > 0 && p.rating; })
          .sort(function (a, b) { return b.rating - a.rating; })
          .slice(0, 4);
      } },
    { id: "recently-viewed", pick: function () {
        var ids = account ? account.recentlyViewed || [] : TRAMMA.store.get("recently-viewed", []);
        return ids.map(function (id) { return byId[id]; }).filter(Boolean);
      } }
  ];

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
      '<div class="carousel__viewport" aria-live="off">' +
        slides.map(function (s, i) {
          return '<div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' de ' + slides.length + '"' + (i ? ' hidden' : '') + '>' +
            '<div class="carousel__media"><img src="img/placeholder.svg" alt="' + ui.esc(s.alt) + '" width="800" height="600"></div>' +
            '<div class="carousel__content">' +
              '<p class="carousel__eyebrow">' + ui.esc(s.eyebrow) + '</p>' +
              // h2: o h1 da página é o título "Tramma", escondido visualmente.
              '<h2 class="carousel__title">' + ui.esc(s.title) + '</h2>' +
              '<p>' + ui.esc(s.text) + '</p>' +
              '<a class="button" href="' + s.href + '">' + ui.esc(s.cta) + '</a>' +
            '</div>' +
          '</div>';
        }).join("") +
      '</div>' +
      '<div class="carousel__controls">' +
        // O botão de pausar vem primeiro na ordem do teclado (padrão APG).
        '<button type="button" class="button" data-variant="ghost" data-size="icon" data-carousel-toggle></button>' +
        '<div class="carousel__dots">' +
          slides.map(function (s, i) {
            return '<button type="button" class="carousel__dot" aria-label="Ir para o slide ' + (i + 1) + ' de ' + slides.length + '"></button>';
          }).join("") +
        '</div>' +
        '<div class="carousel__nav">' +
          '<button type="button" class="button" data-variant="ghost" data-size="icon" data-carousel-prev aria-label="Slide anterior">' + ui.icon("chevron-left") + '</button>' +
          '<button type="button" class="button" data-variant="ghost" data-size="icon" data-carousel-next aria-label="Próximo slide">' + ui.icon("chevron-right") + '</button>' +
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
    sections.forEach(function (s) {
      var el = document.getElementById(s.id);
      // Seções que dependem de dados da pessoa só aparecem se fizerem sentido.
      el.hidden = (s.onlyLogged && !account) || (s.id === "recently-viewed" && !s.pick().length);
      el.querySelector("ul").innerHTML = skeletons(4);
    });
    document.getElementById("loading-status").textContent = "Carregando produtos…";
  }

  function setLoaded() {
    main.removeAttribute("aria-busy");
    renderHero();
    sections.forEach(function (s) {
      var el = document.getElementById(s.id);
      if (el.hidden) return;
      var products = s.pick();
      el.hidden = products.length === 0;
      el.querySelector("ul").innerHTML = rail(products);
    });
    document.getElementById("loading-status").textContent = "";
  }

  function setError() {
    main.removeAttribute("aria-busy");
    document.getElementById("hero").innerHTML = "";
    sections.forEach(function (s) { document.getElementById(s.id).hidden = true; });
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
