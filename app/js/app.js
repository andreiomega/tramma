/* =====================================================================
   Tramma — moldura do app
   ---------------------------------------------------------------------
   Só o que é do app: o aviso de conexão (offline-banner).
   O contador da sacola na bottom nav já é atualizado pelo
   components.js (updateBagCounter), que o home.js chama.

   Estados do aviso:
   offline · a conexão caiu. O aviso fica até ela voltar.
   online  · a conexão voltou. O aviso confirma e some em 4 s.

   PARÂMETRO DE REVISÃO (temporário, para ver os estados em aula):
   ?estado=offline  começa sem conexão e simula a volta em 8 s.
   Para testar de verdade: no DevTools, aba Network, opção "Offline".
   ===================================================================== */

(function () {
  var ui = TRAMMA.ui;
  var region = document.getElementById("connection-status");
  var hideTimer;

  // Os textos (i18n.js) dizem o que aconteceu e o que a pessoa pode esperar.
  var states = {
    offline: { icon: "wifi-off", text: TRAMMA.t("app.offline") },
    online:  { icon: "check",    text: TRAMMA.t("app.online") }
  };

  function show(name) {
    clearTimeout(hideTimer);
    var s = states[name];
    region.innerHTML =
      '<div class="offline-banner" data-state="' + name + '">' +
        ui.icon(s.icon, "sm") + '<p>' + ui.esc(s.text) + '</p>' +
      '</div>';
    // "De volta" é só uma confirmação: some sozinho.
    // "Sem conexão" fica, porque continua valendo.
    if (name === "online") {
      hideTimer = setTimeout(function () { region.innerHTML = ""; }, 4000);
    }
  }

  // O navegador avisa quando a conexão cai e quando volta.
  window.addEventListener("offline", function () { show("offline"); });
  window.addEventListener("online", function () { show("online"); });

  if (TRAMMA.session.reviewState === "offline") {
    show("offline");
    setTimeout(function () { show("online"); }, 8000);
  } else if (navigator.onLine === false) {
    show("offline"); // o app já abriu sem conexão
  }
})();
