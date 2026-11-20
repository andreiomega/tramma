/* =====================================================================
   Tramma — store (persistência)
   ---------------------------------------------------------------------
   Guarda no localStorage o que a pessoa cria ou altera (sessão, sacola,
   favoritos, preferências...). Todo acesso passa por try/catch: em aba
   anônima, com armazenamento bloqueado ou cheio, o localStorage lança
   erro. Nesse caso a loja continua funcionando, só não lembra entre
   visitas (os dados ficam na memória enquanto a página estiver aberta).
   Arquivo compartilhado (site/ e app/).
   ===================================================================== */

window.TRAMMA = window.TRAMMA || {};

TRAMMA.store = (function () {
  var PREFIX = "tramma:";   // evita conflito com outros sites no mesmo endereço (file://)
  var memory = {};          // reserva para quando o localStorage falhar

  function get(key, fallback) {
    try {
      var raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return key in memory ? memory[key] : fallback;
    }
  }

  function set(key, value) {
    memory[key] = value;
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* segue só na memória */ }
  }

  function remove(key) {
    delete memory[key];
    try { localStorage.removeItem(PREFIX + key); } catch (e) { /* nada a fazer */ }
  }

  return { get: get, set: set, remove: remove };
})();

/* ---------------------------------------------------------------------
   Sessão
   A sessão guarda só qual conta de demonstração está logada.
   PARÂMETRO DE REVISÃO (temporário): ?estado=logged entra com a
   "conta completa" sem passar pelo login, só nesta visita (não grava).
   Sai quando a tela de login existir.
   --------------------------------------------------------------------- */
TRAMMA.session = (function () {
  var params = new URLSearchParams(location.search);
  var review = params.get("estado");

  function current() {
    if (review === "logged") return { account: "completa" };
    if (review === "guest") return null;
    return TRAMMA.store.get("session", null);
  }

  /* Devolve a conta logada (com os dados que a pessoa alterou) ou null. */
  function account() {
    var s = current();
    if (!s) return null;
    var seed = TRAMMA.demoAccounts[s.account];
    var saved = TRAMMA.store.get("account:" + s.account, {});
    return Object.assign({ id: s.account }, seed, saved);
  }

  /* Grava uma alteração na conta logada (ex.: favoritos). */
  function update(changes) {
    var s = current();
    if (!s) return;
    var saved = TRAMMA.store.get("account:" + s.account, {});
    TRAMMA.store.set("account:" + s.account, Object.assign(saved, changes));
  }

  return { current: current, account: account, update: update, reviewState: review };
})();

/* ---------------------------------------------------------------------
   Simulação de rede: espera um tempo e resolve (ou falha).
   Deixa os estados loading e submitting visíveis.
   --------------------------------------------------------------------- */
TRAMMA.simulate = function (ms, shouldFail) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () { shouldFail ? reject(new Error("simulado")) : resolve(); }, ms);
  });
};
