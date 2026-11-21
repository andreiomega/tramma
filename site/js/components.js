/* =====================================================================
   Tramma — comportamento dos componentes
   ---------------------------------------------------------------------
   Cada bloco liga o comportamento de um componente do components.css.
   O HTML funciona e é legível sem este arquivo; o JS acrescenta a
   interação. Arquivo compartilhado (site/ e app/).
   ===================================================================== */

window.TRAMMA = window.TRAMMA || {};

TRAMMA.ui = (function () {

  /* ---------- Utilitários ---------- */

  /* Ícone do sprite. aria-hidden porque o significado vem do texto ou do
     aria-label do botão, nunca só do desenho. */
  function icon(name, size) {
    return '<svg class="icon"' + (size ? ' data-size="' + size + '"' : "") +
      ' aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>';
  }

  /* Dinheiro na moeda do idioma (o i18n.js converte e formata). */
  var money = TRAMMA.money;
  var t = TRAMMA.t;
  var text = TRAMMA.text;

  /* Escapa texto antes de pôr no HTML (boa prática mesmo com dados fixos). */
  function esc(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Parcelamento: até 6x sem juros, parcela mínima de R$ 30.
     Devolve o número de parcelas (1 = só à vista). */
  function installments(value) {
    var r = TRAMMA.rules;
    return Math.max(1, Math.min(r.installmentsMax, Math.floor(value / r.installmentMin)));
  }

  /* ---------- COLOR SWATCH ----------
     Até 4 bolinhas e "+n". O nome das cores vai por extenso para o leitor de tela. */
  function swatches(colors) {
    var shown = colors.slice(0, 4);
    var names = colors.map(function (c) { return TRAMMA.colors[c] ? text(TRAMMA.colors[c].name) : c; });
    return '<p class="color-swatch">' +
      '<span class="sr-only">' + esc(t("card.colors", { list: names.join(", ") })) + '</span>' +
      shown.map(function (c) {
        return '<span class="color-swatch__dot" style="background:' + (TRAMMA.colors[c] ? TRAMMA.colors[c].hex : "#ccc") + '" aria-hidden="true"></span>';
      }).join("") +
      (colors.length > 4 ? '<span aria-hidden="true">+' + (colors.length - 4) + '</span>' : '') +
    '</p>';
  }

  /* ---------- TABS ----------
     Padrão Tabs do WAI-ARIA, com ativação automática: a seta já mostra
     o painel (os painéis são leves, não carregam nada novo). */
  function initTabs(root, onChange) {
    if (!root) return;
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    function select(tab, moveFocus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1; // só a aba ativa entra no Tab
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (moveFocus) tab.focus();
      if (onChange) onChange(tab);
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab, false); });
      tab.addEventListener("keydown", function (e) {
        var next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (next === undefined) return;
        e.preventDefault();
        select(tabs[(next + tabs.length) % tabs.length], true);
      });
    });
    select(tabs[0], false);
  }

  /* ---------- PRODUCT CARD ---------- */

  function productCard(p, favorites) {
    var final = p.salePrice || p.price;
    var soldOut = p.stock === 0;
    var isFav = favorites.indexOf(p.id) !== -1;
    var n = installments(final); // calculado em reais; só o valor mostrado é convertido
    var name = text(p.name);

    // Selos: no máximo 2, na ordem de importância para a compra.
    var badges = [];
    if (soldOut) badges.push(['secondary', t("card.soldOut")]);
    else if (p.stock <= 5) badges.push(['outline', t("card.lastUnits")]);
    if (p.salePrice) badges.push(['destructive', "-" + Math.round((1 - p.salePrice / p.price) * 100) + "%"]);
    if (p.isNew) badges.push(['default', t("card.new")]);
    if (p.isBestSeller) badges.push(['secondary', t("card.bestSeller")]);
    badges = badges.slice(0, 2);

    var rating = p.rating
      ? icon("star", "sm") + '<span class="rating__value">' + TRAMMA.number(p.rating) + '</span>' +
        '<span>(' + p.reviews + '<span class="sr-only">' + t("card.reviews") + '</span>)</span>' +
        '<span class="sr-only">' + t("card.rating", { value: TRAMMA.number(p.rating) }) + '</span>'
      : '<span>' + t("card.noReviews") + '</span>';

    var price = p.salePrice
      ? '<span class="price__old"><span class="sr-only">' + t("card.was") + '</span><s>' + money(p.price) + '</s></span>' +
        '<span class="price__current"><span class="sr-only">' + t("card.now") + '</span>' + money(p.salePrice) + '</span>'
      : '<span class="price__current">' + money(p.price) + '</span>';
    if (n > 1) price += '<span class="price__installments">' + t("card.installments", { n: n, value: money(final / n) }) + '</span>';

    return '' +
      '<article class="product-card"' + (soldOut ? ' data-state="sold-out"' : '') + '>' +
        '<div class="product-card__media">' +
          // Placeholder até as fotos existirem: o alt já descreve a foto final.
          '<img src="' + TRAMMA.photo.product(p.id) + '" alt="' + esc(p.photoAlt ? text(p.photoAlt) : name) + '" width="400" height="500" loading="lazy">' +
          (badges.length ? '<div class="product-card__badges">' +
            badges.map(function (b) { return '<span class="badge" data-variant="' + b[0] + '">' + b[1] + '</span>'; }).join("") +
          '</div>' : '') +
          '<button type="button" class="button product-card__favorite" data-variant="ghost" data-size="icon"' +
            ' aria-pressed="' + isFav + '" data-favorite="' + p.id + '" aria-label="' + esc(t("card.favorite", { name: name })) + '">' +
            icon("heart") + '</button>' +
        '</div>' +
        '<h3 class="product-card__name"><a class="product-card__link" href="produto.html?id=' + p.id + '">' + esc(name) + '</a></h3>' +
        '<p class="product-card__spec">' + p.weight + ' g/m² · ' + esc(text(p.composition)) + '</p>' +
        swatches(p.colors) +
        '<p class="rating">' + rating + '</p>' +
        '<p class="price">' + price + '</p>' +
      '</article>';
  }

  /* Esqueleto do card, para o estado loading. */
  function productCardSkeleton() {
    return '<div class="product-card" aria-hidden="true">' +
      '<div class="skeleton" data-shape="media"></div>' +
      '<div class="skeleton" data-shape="line"></div>' +
      '<div class="skeleton" data-shape="line-short"></div>' +
    '</div>';
  }

  /* ---------- TOAST ----------
     toast("Mensagem", { label: "Desfazer", onAction: fn }) ou
     toast("Mensagem", { label: "Entrar", href: "entrar.html" })
     Some sozinho em 6 s. Com ação, o tempo é maior que o mínimo de
     leitura, e a ação também existe em outro lugar da página. */
  function toast(message, action) {
    var region = document.getElementById("toast-region");
    if (!region) return;
    region.innerHTML = ""; // um aviso por vez
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = '<span class="toast__message">' + esc(message) + '</span>';
    if (action) {
      var btn = document.createElement(action.href ? "a" : "button");
      btn.className = "button";
      btn.setAttribute("data-variant", "ghost");
      btn.textContent = action.label;
      if (action.href) btn.href = action.href;
      else {
        btn.type = "button";
        btn.addEventListener("click", function () { action.onAction(); el.remove(); });
      }
      el.appendChild(btn);
    }
    region.appendChild(el);
    setTimeout(function () { el.remove(); }, 6000);
  }

  /* ---------- FAVORITAR ----------
     guest: não grava; avisa e oferece entrar (favoritos exigem login).
     logged: marca/desmarca, grava na conta e oferece desfazer (undo). */
  function initFavorites(root) {
    root.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-favorite]");
      if (!btn) return;
      var account = TRAMMA.session.account();
      if (!account) {
        toast(t("favorites.signIn"), { label: t("account.signIn"), href: "entrar.html" });
        return;
      }
      var id = btn.getAttribute("data-favorite");
      function apply(on) {
        var favs = (TRAMMA.session.account().favorites || []).filter(function (f) { return f !== id; });
        if (on) favs.push(id);
        TRAMMA.session.update({ favorites: favs });
        // Atualiza todos os botões do mesmo produto (ele pode aparecer em mais de uma seção).
        document.querySelectorAll('[data-favorite="' + id + '"]').forEach(function (b) {
          b.setAttribute("aria-pressed", String(on));
        });
      }
      var on = btn.getAttribute("aria-pressed") !== "true";
      apply(on);
      toast(on ? t("favorites.added") : t("favorites.removed"),
        { label: t("undo"), onAction: function () { apply(!on); } });
    });
  }

  /* ---------- SHEET ----------
     showModal() já prende o foco, fecha com Esc e deixa o fundo inerte.
     Aqui: abrir pelo botão, fechar pelo X ou tocando fora, devolver o foco. */
  function initSheet(sheet, opener) {
    if (!sheet || !opener) return;
    opener.addEventListener("click", function () {
      sheet.showModal();
      opener.setAttribute("aria-expanded", "true");
      document.body.setAttribute("data-scroll-lock", "");
    });
    sheet.addEventListener("close", function () {
      opener.setAttribute("aria-expanded", "false");
      document.body.removeAttribute("data-scroll-lock");
      opener.focus(); // devolve o foco a quem abriu
    });
    sheet.addEventListener("click", function (e) {
      // Clique no próprio <dialog> (e não num filho) = clique no fundo escuro.
      if (e.target === sheet || e.target.closest("[data-sheet-close]")) sheet.close();
    });
  }

  /* ---------- LANGUAGE SWITCHER (seletor de idioma) ----------
     Cada opção é um link de verdade (?lang=en): funciona até sem JS.
     O JS só acrescenta três coisas:
     - mantém os outros parâmetros do endereço (ex.: ?estado=logged);
     - marca o idioma atual com aria-current;
     - depois da troca, devolve o foco ao seletor. A página recarrega,
       e sem isso quem usa teclado voltaria para o começo da página. */
  function initLanguageSwitcher(root) {
    if (!root) return;
    root.querySelectorAll("[data-lang]").forEach(function (link) {
      var lang = link.getAttribute("data-lang");
      var params = new URLSearchParams(location.search);
      params.set("lang", lang);
      link.href = "?" + params.toString();
      if (lang === TRAMMA.lang) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
      // Guarda QUAL seletor foi usado: a página tem dois (faixa e menu),
      // e o foco volta para o mesmo depois do recarregamento.
      link.addEventListener("click", function () {
        TRAMMA.store.set("lang-focus", root.id);
      });
    });
    if (TRAMMA.store.get("lang-focus", false) === root.id) {
      TRAMMA.store.remove("lang-focus");
      var current = root.querySelector('[aria-current="true"]');
      if (current) current.focus();
    }
  }

  /* ---------- CAROUSEL ----------
     Padrão Carousel do WAI-ARIA Authoring Practices. */
  function initCarousel(root) {
    if (!root) return;
    var slides = root.querySelectorAll(".carousel__slide");
    var dots = root.querySelectorAll(".carousel__dot");
    var viewport = root.querySelector(".carousel__viewport");
    var track = root.querySelector(".carousel__track");
    var toggle = root.querySelector("[data-carousel-toggle]");
    var current = 0;
    var timer = null;
    var DELAY = 6000;
    // Pausa pedida pela pessoa (botão) é diferente de pausa temporária (mouse/foco).
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var userPaused = reduceMotion;
    var hovering = false, focusInside = false;

    function show(index, byUser) {
      current = (index + slides.length) % slides.length;
      // O trilho desliza; os slides fora de vista ficam inert (fora do Tab
      // e do leitor de tela), mas continuam visíveis durante o deslize.
      track.style.transform = "translateX(" + (-100 * current) + "%)";
      slides.forEach(function (s, i) { s.inert = i !== current; });
      dots.forEach(function (d, i) {
        if (i === current) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });
      // Só anuncia a troca quando foi a pessoa que pediu.
      viewport.setAttribute("aria-live", byUser ? "polite" : "off");
    }

    function sync() {
      var playing = !userPaused && !hovering && !focusInside;
      clearInterval(timer);
      if (playing) timer = setInterval(function () { show(current + 1, false); }, DELAY);
      root.setAttribute("data-state", userPaused ? "paused" : "playing");
      // O botão mostra a ação que vai acontecer, não o estado atual.
      toggle.setAttribute("aria-label", userPaused ? t("carousel.play") : t("carousel.pause"));
      toggle.innerHTML = icon(userPaused ? "play" : "pause");
    }

    toggle.addEventListener("click", function () { userPaused = !userPaused; sync(); });
    root.querySelector("[data-carousel-prev]").addEventListener("click", function () { show(current - 1, true); });
    root.querySelector("[data-carousel-next]").addEventListener("click", function () { show(current + 1, true); });
    dots.forEach(function (d, i) { d.addEventListener("click", function () { show(i, true); }); });

    root.addEventListener("mouseenter", function () { hovering = true; sync(); });
    root.addEventListener("mouseleave", function () { hovering = false; sync(); });
    root.addEventListener("focusin", function () { focusInside = true; sync(); });
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) { focusInside = false; sync(); }
    });

    // Arrastar com o dedo: atalho para anterior/próximo (os botões continuam lá).
    var startX = null;
    viewport.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        userPaused = true; // quem arrasta quer controlar: a passagem automática para
        show(current + (dx < 0 ? 1 : -1), true);
        sync();
      }
      startX = null;
    });

    show(0, false);
    sync();
  }

  /* ---------- COOKIE BANNER (LGPD) ----------
     Aparece até a pessoa escolher. "Personalizar" leva à página de
     cookies (U23), que nasce numa etapa futura. */
  function initCookieBanner(banner) {
    if (!banner) return;
    if (TRAMMA.store.get("cookie-consent", null)) return; // já escolheu
    banner.hidden = false;
    banner.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-consent]");
      if (!btn) return;
      TRAMMA.store.set("cookie-consent", { choice: btn.getAttribute("data-consent"), date: new Date().toISOString() });
      banner.hidden = true;
      toast(btn.getAttribute("data-consent") === "all" ? t("cookies.savedAll") : t("cookies.savedEssential"));
      document.getElementById("main").focus(); // o foco não fica num elemento que sumiu
    });
  }

  /* ---------- NEWSLETTER ----------
     Estados: empty · error-empty · error-invalid · submitting · success · já inscrito.
     Valida só no envio (não interrompe enquanto a pessoa digita). */
  function initNewsletter(root) {
    if (!root) return;
    var form = root.querySelector("form");
    var input = form.querySelector("input");
    var error = form.querySelector(".field__error");
    var errorText = error.querySelector("span");
    var submit = form.querySelector('[type="submit"]');
    var done = root.querySelector(".newsletter__done");
    var doneText = done.querySelector("p");
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setError(message) {
      if (message) {
        errorText.textContent = message;
        error.hidden = false;
        input.setAttribute("aria-invalid", "true");
        input.focus();
      } else {
        error.hidden = true;
        input.removeAttribute("aria-invalid");
      }
    }

    function showDone(message) {
      form.hidden = true;
      doneText.textContent = message;
      done.hidden = false;
      done.focus();
    }

    // Quem já assinou neste navegador vê a confirmação direto.
    var saved = TRAMMA.store.get("newsletter", null);
    if (saved) { form.hidden = true; doneText.textContent = t("newsletter.already", { email: saved }); done.hidden = false; }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (submit.getAttribute("aria-busy") === "true") return; // ignora clique duplo
      var value = input.value.trim();
      if (!value) return setError(t("newsletter.errorEmpty"));
      if (!EMAIL.test(value)) return setError(t("newsletter.errorInvalid"));
      setError(null);

      submit.setAttribute("aria-busy", "true");
      submit.textContent = t("newsletter.sending");
      TRAMMA.simulate(1000).then(function () {
        submit.removeAttribute("aria-busy");
        submit.textContent = t("newsletter.submit");
        TRAMMA.store.set("newsletter", value);
        // O cupom vem junto na confirmação: é o incentivo prometido na seção.
        showDone(t("newsletter.done", { email: value, code: TRAMMA.newsletterCoupon.code }));
      });
    });
  }

  /* ---------- CONTADOR DA SACOLA ---------- */
  function updateBagCounter() {
    var account = TRAMMA.session.account();
    var bag = account ? account.bag || [] : TRAMMA.store.get("bag", []);
    var total = bag.reduce(function (sum, item) { return sum + item.qty; }, 0);
    document.querySelectorAll("[data-bag-link]").forEach(function (link) {
      var counter = link.querySelector(".counter");
      counter.textContent = total > 99 ? "99+" : total;
      counter.hidden = total === 0;
      link.setAttribute("aria-label", total === 0 ? t("bag.label.empty") : total === 1 ? t("bag.label.one") : t("bag.label.many", { n: total }));
    });
  }

  /* ---------- CONTA NO MENU (sheet) ----------
     guest: entrar, criar conta, favoritos e pedidos
     logged: saudação, conta, pedidos, favoritos e sair.
     Favoritos e pedidos aparecem nos dois estados: no celular, o menu é o
     único caminho para eles. Sem login, as páginas pedem para entrar. */
  function renderSheetAccount(container) {
    if (!container) return;
    var account = TRAMMA.session.account();
    var shortcuts =
      '<a class="sheet__link" href="pedidos.html">' + t("account.orders") + '</a>' +
      '<a class="sheet__link" href="favoritos.html">' + t("favorites") + '</a>';
    if (!account) {
      container.innerHTML =
        '<a class="button" href="entrar.html">' + t("account.signIn") + '</a>' +
        '<a class="button" data-variant="outline" href="criar-conta.html">' + t("account.create") + '</a>' +
        shortcuts;
      return;
    }
    container.innerHTML =
      '<p class="sheet__greeting">' + esc(t("greeting", { name: account.name.split(" ")[0] })) + '</p>' +
      '<a class="sheet__link" href="conta.html">' + t("account.mine") + '</a>' +
      shortcuts +
      '<button type="button" class="button" data-variant="outline" data-sign-out>' + t("account.signOut") + '</button>';
    container.querySelector("[data-sign-out]").addEventListener("click", function () {
      TRAMMA.store.remove("session");
      location.href = "index.html"; // recarrega sem o parâmetro de revisão
    });
  }

  /* ---------- CONTA NO CABEÇALHO (desktop) ---------- */
  function renderHeaderAccount(link) {
    if (!link) return;
    var account = TRAMMA.session.account();
    if (!account) return; // guest: o HTML já diz "Entrar"
    link.href = "conta.html";
    link.querySelector("span").textContent = t("greeting", { name: account.name.split(" ")[0] });
  }

  /* ---------- NAVIGATION MENU (mega menu, desktop) ----------
     Padrão "disclosure navigation" (WAI-ARIA):
     - clique no botão abre/fecha; só um painel aberto por vez;
     - Esc fecha e devolve o foco ao botão;
     - clique fora ou foco saindo do item fecha. */
  function initNavigationMenu(nav) {
    if (!nav) return;
    var triggers = nav.querySelectorAll(".navigation-menu__trigger");

    function setOpen(trigger, open) {
      trigger.setAttribute("aria-expanded", String(open));
      document.getElementById(trigger.getAttribute("aria-controls")).hidden = !open;
    }
    function closeAll() { triggers.forEach(function (t) { setOpen(t, false); }); }

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var open = trigger.getAttribute("aria-expanded") !== "true";
        closeAll();
        setOpen(trigger, open);
      });
      trigger.parentElement.addEventListener("focusout", function (e) {
        if (!trigger.parentElement.contains(e.relatedTarget)) setOpen(trigger, false);
      });
    });

    nav.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var open = nav.querySelector('.navigation-menu__trigger[aria-expanded="true"]');
      if (open) { setOpen(open, false); open.focus(); }
    });
    document.addEventListener("click", function (e) { if (!nav.contains(e.target)) closeAll(); });
  }

  /* ---------- BUSCA DO CABEÇALHO (desktop, padrão Insider) ----------
     A lupa abre o campo no lugar do menu; o X ou o Esc fecham.
     Foco: vai para o campo ao abrir e volta para a lupa ao fechar. */
  function initHeaderSearch(header) {
    if (!header) return;
    var toggle = header.querySelector(".site-header__search-toggle");
    var form = header.querySelector(".site-header__search");
    if (!toggle || !form) return;
    var input = form.querySelector("input");

    function setOpen(open) {
      form.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      if (open) { header.setAttribute("data-search", "open"); input.focus(); }
      else { header.removeAttribute("data-search"); toggle.focus(); }
    }
    toggle.addEventListener("click", function () { setOpen(true); });
    form.querySelector("[data-search-close]").addEventListener("click", function () { setOpen(false); });
    form.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- RODAPÉ: sanfona no celular, colunas no desktop ----------
     Os grupos são <details>. A partir de 768px eles ficam sempre abertos,
     e o <summary> sai da ordem do Tab, porque lá ele vira só um título
     de coluna. matchMedia reage quando a janela muda de largura. */
  function initFooterColumns(footer) {
    if (!footer) return;
    var items = footer.querySelectorAll(".accordion__item");
    var wide = window.matchMedia("(min-width: 768px)");
    function apply() {
      items.forEach(function (d) {
        var summary = d.querySelector("summary");
        if (wide.matches) { d.open = true; summary.setAttribute("tabindex", "-1"); }
        else { d.open = false; summary.removeAttribute("tabindex"); }
      });
    }
    apply();
    wide.addEventListener("change", apply);
  }

  return {
    initTabs: initTabs,
    renderHeaderAccount: renderHeaderAccount,
    initNavigationMenu: initNavigationMenu,
    initHeaderSearch: initHeaderSearch,
    initFooterColumns: initFooterColumns,
    renderSheetAccount: renderSheetAccount,
    icon: icon, money: money, esc: esc,
    productCard: productCard, productCardSkeleton: productCardSkeleton,
    toast: toast, initFavorites: initFavorites, initSheet: initSheet,
    initLanguageSwitcher: initLanguageSwitcher, initCarousel: initCarousel,
    initCookieBanner: initCookieBanner, initNewsletter: initNewsletter,
    updateBagCounter: updateBagCounter
  };
})();
