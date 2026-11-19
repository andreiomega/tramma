/* =========================================================================
   TRAMMA APP — NAVEGAÇÃO ENTRE TELAS E COMPORTAMENTOS DO APP
   1. Rotas por #hash (#inicio, #buscar, #produto/id, #sacola, #checkout…)
   2. Telas: início, buscar, produto, sacola, checkout, conta
   Reaproveita do site: produtos.js (dados) e comum.js (sacola, tema, toast, <dialog>).
   ========================================================================= */

/* No app, o produto abre numa tela interna, não em outra página. */
linkProduto = function (id) { return '#produto/' + id; };

var ABAS = ['inicio', 'buscar', 'sacola', 'conta'];     /* destinos da bottom nav */
var produtoAtual = null;
var telaAnterior = null;


/* =========================================================================
   1. NAVEGAÇÃO
   O hash da URL diz qual tela mostrar. Vantagens: funciona via file://,
   cada tela tem um endereço e o botão voltar do navegador/celular funciona.
   ========================================================================= */
function navegar() {
  var partes = (location.hash.slice(1) || 'inicio').split('/');
  var nome = partes[0];
  var tela = document.querySelector('[data-tela="' + nome + '"]');
  if (!tela) { location.hash = '#inicio'; return; }

  /* Prepara o conteúdo da tela antes de mostrar */
  if (nome === 'produto') abrirProduto(partes[1]);
  if (nome === 'sacola') desenharSacola();
  if (nome === 'checkout') desenharCheckout();
  if (nome === 'buscar') desenharBusca();

  /* Esconde as outras e mostra a nova, com a transição certa */
  document.querySelectorAll('[data-tela]').forEach(function (t) { t.hidden = t !== tela; });
  var empilhada = ABAS.indexOf(nome) === -1;
  var voltando = telaAnterior && ABAS.indexOf(telaAnterior) === -1 && !empilhada;
  tela.classList.remove('tela--empurrar', 'tela--voltar', 'tela--aba');
  void tela.offsetWidth; /* reinicia a animação CSS */
  tela.classList.add(empilhada ? 'tela--empurrar' : (voltando ? 'tela--voltar' : 'tela--aba'));
  telaAnterior = nome;

  /* Barra superior: título da tela e botão voltar só nas telas empilhadas */
  var titulo = nome === 'produto' && produtoAtual ? produtoAtual.nome : tela.getAttribute('data-titulo');
  var tituloEl = document.getElementById('titulo-tela');
  tituloEl.textContent = titulo;
  document.title = titulo === 'Tramma' ? 'Tramma' : titulo + ' | Tramma';
  document.getElementById('voltar').hidden = !empilhada;

  /* Bottom nav: marca a aba atual (telas empilhadas mantêm a aba de origem) */
  var abaAtiva = empilhada ? (nome === 'produto' ? 'buscar' : 'sacola') : nome;
  document.querySelectorAll('[data-aba]').forEach(function (a) {
    if (a.getAttribute('data-aba') === abaAtiva) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  /* Nova tela começa do topo, e o foco vai ao título: o leitor de tela anuncia onde a pessoa está */
  window.scrollTo(0, 0);
  tituloEl.focus();
}

window.addEventListener('hashchange', navegar);
document.getElementById('voltar').addEventListener('click', function () {
  history.length > 1 ? history.back() : (location.hash = '#inicio');
});


/* =========================================================================
   2a. INÍCIO
   ========================================================================= */
function tagsCategorias(ativa) {
  var tags = [['', 'Todas']].concat(Object.keys(CATEGORIAS).map(function (c) { return [c, CATEGORIAS[c]]; }));
  return tags.map(function (t) {
    return '<li><button class="tag" type="button" data-categoria="' + t[0] + '" aria-pressed="' + (t[0] === ativa) + '">' + t[1] + '</button></li>';
  }).join('');
}

document.getElementById('inicio-tags').innerHTML = tagsCategorias(null);
document.getElementById('inicio-lista').innerHTML = PRODUTOS.slice()
  .sort(function (a, b) { return b.avaliacoes - a.avaliacoes; })
  .slice(0, 6).map(cardProdutoHTML).join('');

/* Tocar numa categoria no início leva à aba Buscar já filtrada */
document.getElementById('inicio-tags').addEventListener('click', function (evento) {
  var tag = evento.target.closest('[data-categoria]');
  if (!tag) return;
  filtroCategoria = tag.getAttribute('data-categoria');
  location.hash = '#buscar';
});


/* =========================================================================
   2b. BUSCAR — texto, categoria (tags) e filtros no bottom sheet
   ========================================================================= */
var filtroCategoria = '';
var campoBusca = document.getElementById('app-busca');
var formFiltros = document.getElementById('form-filtros');

function desenharBusca() {
  document.getElementById('buscar-tags').innerHTML = tagsCategorias(filtroCategoria);
  var termo = campoBusca.value.trim().toLowerCase();
  var modelagens = Array.from(formFiltros.querySelectorAll('[name="modelagem"]:checked')).map(function (i) { return i.value; });
  var ordem = formFiltros.querySelector('[name="ordem"]:checked').value;

  var lista = PRODUTOS.filter(function (p) {
    return (!termo || p.nome.toLowerCase().indexOf(termo) !== -1) &&
      (!filtroCategoria || p.categoria === filtroCategoria) &&
      (!modelagens.length || modelagens.indexOf(p.modelagem) !== -1);
  }).sort(function (a, b) {
    if (ordem === 'menor-preco') return a.preco - b.preco;
    if (ordem === 'maior-preco') return b.preco - a.preco;
    return 0;
  });

  document.getElementById('buscar-lista').innerHTML = lista.map(cardProdutoHTML).join('');
  document.getElementById('buscar-contagem').textContent =
    lista.length === 1 ? '1 camiseta' : lista.length + ' camisetas';
}

campoBusca.addEventListener('input', desenharBusca);
document.getElementById('form-busca').addEventListener('submit', function (e) { e.preventDefault(); campoBusca.blur(); });
document.getElementById('buscar-tags').addEventListener('click', function (evento) {
  var tag = evento.target.closest('[data-categoria]');
  if (!tag) return;
  filtroCategoria = tag.getAttribute('data-categoria');
  desenharBusca();
  document.querySelector('#buscar-tags [data-categoria="' + filtroCategoria + '"]').focus();
});
formFiltros.addEventListener('change', desenharBusca);
formFiltros.addEventListener('reset', function () { setTimeout(desenharBusca, 0); });


/* =========================================================================
   2c. PRODUTO — cor na tela; tamanho no bottom sheet
   ========================================================================= */
function abrirProduto(id) {
  produtoAtual = buscarProduto(id) || PRODUTOS[0];
  var p = produtoAtual;
  document.getElementById('produto-nome').textContent = p.nome;
  document.getElementById('produto-badge').innerHTML = p.badge
    ? '<span class="badge badge--' + p.badge.tom + '">' + p.badge.texto + '</span>' : '';
  document.getElementById('produto-rating').innerHTML = ratingHTML(p.nota, p.avaliacoes);
  document.getElementById('produto-preco').innerHTML = precoHTML(p, 'heading-2');
  document.getElementById('produto-descricao').textContent = p.descricao;
  document.getElementById('produto-ficha').innerHTML = [
    ['Composição', '100% ' + p.tecido.toLowerCase()],
    ['Gramatura', p.gramatura + ' g/m²'],
    ['Modelagem', p.modelagem]
  ].map(function (l) { return '<div class="ficha__linha"><dt>' + l[0] + '</dt><dd>' + l[1] + '</dd></div>'; }).join('');

  document.getElementById('produto-cores').innerHTML = p.cores.map(function (chave, i) {
    return '<input type="radio" name="app-cor" id="app-cor-' + chave + '" value="' + chave + '"' + (i === 0 ? ' checked' : '') + '>' +
      '<label class="seletor-cor__amostra" for="app-cor-' + chave + '" style="--cor-produto:' + CORES[chave].hex + '">' +
      '<span class="visualmente-oculto">' + CORES[chave].nome + '</span></label>';
  }).join('');

  document.getElementById('produto-tamanhos').innerHTML = TAMANHOS.map(function (t) {
    var esgotado = p.esgotados.indexOf(t) !== -1;
    return '<input type="radio" name="app-tamanho" id="app-tam-' + t + '" value="' + t + '"' + (esgotado ? ' disabled' : '') + '>' +
      '<label class="seletor-tamanho__caixa" for="app-tam-' + t + '">' + t +
      (esgotado ? '<span class="visualmente-oculto"> (esgotado)</span>' : '') + '</label>';
  }).join('');
  document.getElementById('erro-tamanho').hidden = true;
  aplicarCor();
}

function aplicarCor() {
  var marcada = document.querySelector('[name="app-cor"]:checked');
  if (!marcada) return;
  document.getElementById('produto-cor-nome').textContent = CORES[marcada.value].nome;
  document.getElementById('produto-imagem').style.setProperty('--cor-produto', CORES[marcada.value].hex);
}
document.getElementById('produto-cores').addEventListener('change', aplicarCor);
document.getElementById('produto-tamanhos').addEventListener('change', function () {
  document.getElementById('erro-tamanho').hidden = true;
});

/* Envio do bottom sheet: valida o tamanho, adiciona, fecha e confirma com toast */
document.getElementById('form-tamanho').addEventListener('submit', function (evento) {
  evento.preventDefault();
  var tamanho = document.querySelector('[name="app-tamanho"]:checked');
  if (!tamanho) {
    document.getElementById('erro-tamanho').hidden = false;
    document.querySelector('[name="app-tamanho"]:not(:disabled)').focus();
    return;
  }
  var cor = document.querySelector('[name="app-cor"]:checked').value;
  Sacola.adicionar(produtoAtual.id, cor, tamanho.value, 1);
  document.getElementById('sheet-tamanho').close();
  mostrarToast('Adicionada à sacola', 'Ver sacola', '#sacola');
});


/* =========================================================================
   2d. SACOLA
   ========================================================================= */
function desenharSacola() {
  var itens = Sacola.itens();
  var vazia = itens.length === 0;
  document.getElementById('sacola-lista').innerHTML = itens.map(itemSacolaHTML).join('');
  document.getElementById('sacola-vazia').hidden = !vazia;
  document.getElementById('sacola-resumo').hidden = vazia;
  if (vazia) return;
  var subtotal = Sacola.subtotal();
  var frete = calcularFrete(subtotal);
  document.getElementById('sacola-subtotal').textContent = formatarPreco(subtotal);
  document.getElementById('sacola-frete').textContent = frete === 0 ? 'Grátis' : formatarPreco(frete);
  document.getElementById('sacola-total').textContent = formatarPreco(subtotal + frete);
}
/* comum.js avisa quando o stepper ou o remover mudam a sacola */
document.addEventListener('sacola-mudou', desenharSacola);


/* =========================================================================
   2e. CHECKOUT (versão curta): validação no envio, erro junto ao campo
   ========================================================================= */
function desenharCheckout() {
  var subtotal = Sacola.subtotal();
  document.getElementById('checkout-total').textContent = formatarPreco(subtotal + calcularFrete(subtotal));
}

var REGRAS_APP = {
  'ck-nome': function (v) { return v ? '' : 'Preencha o seu nome completo'; },
  'ck-email': function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Informe um e-mail no formato nome@exemplo.com'; },
  'ck-cep': function (v) { return v.replace(/\D/g, '').length === 8 ? '' : 'Informe um CEP com 8 números'; }
};

document.getElementById('form-checkout').addEventListener('submit', function (evento) {
  evento.preventDefault();
  if (Sacola.itens().length === 0) {
    mostrarToast('Sua sacola está vazia');
    return;
  }
  var primeiroErro = null;
  Object.keys(REGRAS_APP).forEach(function (id) {
    var campo = document.getElementById(id);
    var erro = document.getElementById(id + '-erro');
    var mensagem = REGRAS_APP[id](campo.value.trim());
    if (mensagem) {
      campo.setAttribute('aria-invalid', 'true');
      erro.innerHTML = '<svg class="icone icone--sm" aria-hidden="true"><use href="#icone-erro"></use></svg>' + mensagem;
      erro.hidden = false;
      primeiroErro = primeiroErro || campo;
    } else {
      campo.removeAttribute('aria-invalid');
      erro.hidden = true;
    }
  });
  if (primeiroErro) { primeiroErro.focus(); return; }
  Sacola.salvar([]);
  location.hash = '#confirmado';
});


/* =========================================================================
   2f. CONTA — escolha de tema (sistema, claro, escuro)
   ========================================================================= */
var temaGuardado = lerArmazenamento('tramma-tema', null);
if (temaGuardado) document.querySelector('[name="tema"][value="' + temaGuardado + '"]').checked = true;

document.querySelector('[data-tela="conta"]').addEventListener('change', function (evento) {
  if (evento.target.name !== 'tema') return;
  var valor = evento.target.value;
  if (valor === 'sistema') {
    document.documentElement.removeAttribute('data-theme');
    gravarArmazenamento('tramma-tema', null);
  } else {
    document.documentElement.setAttribute('data-theme', valor);
    gravarArmazenamento('tramma-tema', valor);
  }
});


/* ---------- Início ---------- */
navegar();
