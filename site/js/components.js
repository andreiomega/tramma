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

  /* Formato brasileiro: R$ 1.234,56 */
  function money(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

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

  /* ---------- PRODUCT CARD ---------- */

  function productCard(p, favorites) {
    var final = p.salePrice || p.price;
    var soldOut = p.stock === 0;
    var isFav = favorites.indexOf(p.id) !== -1;
    var n = installments(final);

    // Selos: no máximo 2, na ordem de importância para a compra.
    var badges = [];
    if (soldOut) badges.push(['secondary', "Esgotado"]);
    else if (p.stock <= 5) badges.push(['outline', "Últimas unidades"]);
    if (p.salePrice) badges.push(['destructive', "-" + Math.round((1 - p.salePrice / p.price) * 100) + "%"]);
    if (p.isNew) badges.push(['default', "Novo"]);
    if (p.isBestSeller) badges.push(['secondary', "Mais vendido"]);
    badges = badges.slice(0, 2);

    var rating = p.rating
      ? icon("star", "sm") + '<span class="rating__value">' + p.rating.toLocaleString("pt-BR") + '</span>' +
        '<span>(' + p.reviews + '<span class="sr-only"> avaliações</span>)</span>' +
        '<span class="sr-only">Nota ' + p.rating.toLocaleString("pt-BR") + ' de 5.</span>'
      : '<span>Sem avaliações</span>';

    var price = p.salePrice
      ? '<span class="price__old"><span class="sr-only">De </span><s>' + money(p.price) + '</s></span>' +
        '<span class="price__current"><span class="sr-only">por </span>' + money(p.salePrice) + '</span>'
      : '<span class="price__current">' + money(p.price) + '</span>';
    if (n > 1) price += '<span class="price__installments">ou ' + n + 'x de ' + money(final / n) + ' sem juros</span>';

    return '' +
      '<article class="product-card"' + (soldOut ? ' data-state="sold-out"' : '') + '>' +
        '<div class="product-card__media">' +
          // Placeholder até as fotos existirem: o alt já descreve a foto final.
          '<img src="img/placeholder.svg" alt="' + esc(p.name) + ', vista de frente sobre fundo cinza-claro" width="400" height="500" loading="lazy">' +
          (badges.length ? '<div class="product-card__badges">' +
            badges.map(function (b) { return '<span class="badge" data-variant="' + b[0] + '">' + b[1] + '</span>'; }).join("") +
          '</div>' : '') +
          '<button type="button" class="button product-card__favorite" data-variant="ghost" data-size="icon"' +
            ' aria-pressed="' + isFav + '" data-favorite="' + p.id + '" aria-label="Favoritar ' + esc(p.name) + '">' +
            icon("heart") + '</button>' +
        '</div>' +
        '<h3 class="product-card__name"><a class="product-card__link" href="produto.html?id=' + p.id + '">' + esc(p.name) + '</a></h3>' +
        '<p class="product-card__spec">' + p.weight + ' g/m² · ' + esc(p.composition) + '</p>' +
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
        toast("Entre na sua conta para salvar favoritos.", { label: "Entrar", href: "entrar.html" });
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
      toast(on ? "Adicionado aos favoritos." : "Removido dos favoritos.",
        { label: "Desfazer", onAction: function () { apply(!on); } });
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

  /* ---------- ANNOUNCEMENT BAR ----------
     Fechada pela pessoa, continua fechada nas próximas visitas. */
  function initAnnouncementBar(bar) {
    if (!bar) return;
    if (TRAMMA.store.get("announcement-closed", false)) { bar.hidden = true; return; }
    bar.querySelector("[data-close]").addEventListener("click", function () {
      bar.hidden = true;
      TRAMMA.store.set("announcement-closed", true);
      // O botão sumiu: o foco vai para o começo do cabeçalho, e não se perde.
      var next = document.querySelector(".site-header button, .site-header a");
      if (next) next.focus();
    });
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
      toggle.setAttribute("aria-label", userPaused ? "Retomar a passagem dos slides" : "Pausar a passagem dos slides");
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
      toast(btn.getAttribute("data-consent") === "all" ? "Preferência salva: todos os cookies." : "Preferência salva: só os cookies essenciais.");
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
    if (saved) { form.hidden = true; doneText.textContent = "Você já recebe a newsletter no e-mail " + saved + "."; done.hidden = false; }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (submit.getAttribute("aria-busy") === "true") return; // ignora clique duplo
      var value = input.value.trim();
      if (!value) return setError("Informe seu e-mail.");
      if (!EMAIL.test(value)) return setError("Digite um e-mail válido, como nome@exemplo.com.");
      setError(null);

      submit.setAttribute("aria-busy", "true");
      submit.textContent = "Enviando…";
      TRAMMA.simulate(1000).then(function () {
        submit.removeAttribute("aria-busy");
        submit.textContent = "Assinar a newsletter";
        TRAMMA.store.set("newsletter", value);
        showDone("Pronto. Você vai receber novidades e ofertas no e-mail " + value + ".");
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
      link.setAttribute("aria-label", total === 0 ? "Sacola, vazia" : "Sacola, " + total + (total === 1 ? " item" : " itens"));
    });
  }

  /* ---------- CONTA NO MENU (sheet) ----------
     guest: entrar e criar conta · logged: saudação, conta, pedidos e sair. */
  function renderSheetAccount(container) {
    if (!container) return;
    var account = TRAMMA.session.account();
    if (!account) {
      container.innerHTML =
        '<a class="button" href="entrar.html">Entrar</a>' +
        '<a class="button" data-variant="outline" href="criar-conta.html">Criar conta</a>';
      return;
    }
    container.innerHTML =
      '<p class="sheet__greeting">Olá, ' + esc(account.name.split(" ")[0]) + '</p>' +
      '<a class="sheet__link" href="conta.html">Minha conta</a>' +
      '<a class="sheet__link" href="pedidos.html">Meus pedidos</a>' +
      '<button type="button" class="button" data-variant="outline" data-sign-out>Sair da conta</button>';
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
    link.querySelector("span").textContent = "Olá, " + account.name.split(" ")[0];
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
    renderHeaderAccount: renderHeaderAccount,
    initNavigationMenu: initNavigationMenu,
    initFooterColumns: initFooterColumns,
    renderSheetAccount: renderSheetAccount,
    icon: icon, money: money, esc: esc,
    productCard: productCard, productCardSkeleton: productCardSkeleton,
    toast: toast, initFavorites: initFavorites, initSheet: initSheet,
    initAnnouncementBar: initAnnouncementBar, initCarousel: initCarousel,
    initCookieBanner: initCookieBanner, initNewsletter: initNewsletter,
    updateBagCounter: updateBagCounter
  };
})();
