/* =========================================================================
   TRAMMA — LISTAGEM / CATEGORIA
   Filtros, ordenação e paginação 100% no navegador, só manipulando o DOM.
   Os filtros atualizam a lista na hora; a contagem é anunciada (aria-live).
   ========================================================================= */

var POR_PAGINA = 8;
var paginaAtual = 1;

var form = document.getElementById('form-filtros');
var lista = document.getElementById('lista-produtos');
var contagem = document.getElementById('contagem');
var vazio = document.getElementById('vazio');
var paginacao = document.getElementById('paginacao');
var ordem = document.getElementById('ordem');
var painel = document.getElementById('painel-filtros');

/* ---------- Monta os checkboxes de tamanho e cor a partir dos dados ---------- */
document.getElementById('filtro-tamanhos').innerHTML = TAMANHOS.map(function (t) {
  return '<label class="opcao"><input class="checkbox" type="checkbox" name="tamanho" value="' + t + '"> ' + t + '</label>';
}).join('');

document.getElementById('filtro-cores').innerHTML = Object.keys(CORES).map(function (chave) {
  return '<label class="opcao"><input class="checkbox" type="checkbox" name="cor" value="' + chave + '"> ' +
    '<span class="card-produto__cor" style="--cor-produto:' + CORES[chave].hex + '" aria-hidden="true"></span>' +
    CORES[chave].nome + '</label>';
}).join('');

/* ---------- Lê a URL: ?categoria=essenciais ou ?busca=gola ---------- */
var parametros = new URLSearchParams(location.search);
var termoBusca = (parametros.get('busca') || '').trim();
var categoriaURL = parametros.get('categoria') || '';
var radioCategoria = form.querySelector('input[name="categoria"][value="' + categoriaURL + '"]');
if (radioCategoria) radioCategoria.checked = true;

/* No desktop o painel de filtros fica sempre aberto. */
var desktop = window.matchMedia('(min-width: 1024px)');
function ajustarPainel() { painel.open = desktop.matches; }
ajustarPainel();
desktop.addEventListener('change', ajustarPainel);

/* ---------- Valores marcados de um grupo de checkboxes ---------- */
function marcados(nome) {
  return Array.from(form.querySelectorAll('input[name="' + nome + '"]:checked')).map(function (i) { return i.value; });
}

/* ---------- Aplica filtros e ordenação ---------- */
function filtrar() {
  var categoria = form.querySelector('input[name="categoria"]:checked').value;
  var tamanhos = marcados('tamanho');
  var cores = marcados('cor');
  var modelagens = marcados('modelagem');
  var termo = termoBusca.toLowerCase();

  var resultado = PRODUTOS.filter(function (p) {
    if (termo && p.nome.toLowerCase().indexOf(termo) === -1) return false;
    if (categoria && p.categoria !== categoria) return false;
    if (modelagens.length && modelagens.indexOf(p.modelagem) === -1) return false;
    /* Cor: o produto precisa ter pelo menos uma das cores marcadas */
    if (cores.length && !cores.some(function (c) { return p.cores.indexOf(c) !== -1; })) return false;
    /* Tamanho: pelo menos um dos marcados precisa estar disponível (não esgotado) */
    if (tamanhos.length && !tamanhos.some(function (t) { return p.esgotados.indexOf(t) === -1; })) return false;
    return true;
  });

  var criterio = ordem.value;
  resultado.sort(function (a, b) {
    if (criterio === 'menor-preco') return a.preco - b.preco;
    if (criterio === 'maior-preco') return b.preco - a.preco;
    if (criterio === 'avaliacao') return b.nota - a.nota;
    return 0; /* relevância: ordem do catálogo */
  });

  /* O título da página acompanha a categoria ou a busca */
  var titulo = termoBusca ? 'Resultados para “' + termoBusca + '”'
    : (categoria ? CATEGORIAS[categoria] : 'Todas as camisetas');
  document.getElementById('titulo-listagem').textContent = titulo;
  document.title = titulo + ' | Tramma';

  return resultado;
}

/* ---------- Desenha a lista e a paginação ---------- */
function desenhar() {
  var resultado = filtrar();
  var totalPaginas = Math.max(1, Math.ceil(resultado.length / POR_PAGINA));
  if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
  var inicio = (paginaAtual - 1) * POR_PAGINA;

  lista.innerHTML = resultado.slice(inicio, inicio + POR_PAGINA).map(cardProdutoHTML).join('');
  contagem.textContent = resultado.length === 1 ? '1 camiseta' : resultado.length + ' camisetas';
  vazio.hidden = resultado.length > 0;

  /* A paginação só aparece se houver mais de uma página */
  if (totalPaginas < 2) { paginacao.innerHTML = ''; return; }
  var botoes = '';
  for (var i = 1; i <= totalPaginas; i++) {
    botoes += '<li><button type="button" data-pagina="' + i + '"' +
      (i === paginaAtual ? ' aria-current="page"' : '') + '>' +
      '<span class="visualmente-oculto">Página </span>' + i + '</button></li>';
  }
  paginacao.innerHTML = '<ul>' + botoes + '</ul>';
}

/* ---------- Eventos ---------- */
form.addEventListener('change', function () { paginaAtual = 1; desenhar(); });
ordem.addEventListener('change', desenhar);

/* "reset" limpa o formulário; esperamos o navegador terminar para redesenhar */
form.addEventListener('reset', function () {
  termoBusca = '';
  setTimeout(function () { paginaAtual = 1; desenhar(); }, 0);
});
document.getElementById('limpar-vazio').addEventListener('click', function () { form.reset(); });

paginacao.addEventListener('click', function (evento) {
  var botao = evento.target.closest('[data-pagina]');
  if (!botao) return;
  paginaAtual = Number(botao.getAttribute('data-pagina'));
  desenhar();
  /* Leva o foco ao título: quem usa teclado não fica perdido no fim da página */
  var titulo = document.getElementById('titulo-listagem');
  titulo.setAttribute('tabindex', '-1');
  titulo.focus();
});

desenhar();
