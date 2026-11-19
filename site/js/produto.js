/* =========================================================================
   TRAMMA — PÁGINA DE PRODUTO
   1. Carrega o produto pelo ?id= da URL     4. Quantidade (stepper)
   2. Galeria (troca de vista)              5. Adicionar à sacola (com validação)
   3. Variações de cor e tamanho            6. Produtos relacionados
   ========================================================================= */

var parametros = new URLSearchParams(location.search);
var produto = buscarProduto(parametros.get('id')) || PRODUTOS[0];

/* ---------- 1. Preenche a página com os dados do produto ---------- */
document.title = produto.nome + ' | Tramma';
document.getElementById('produto-nome').textContent = produto.nome;
document.getElementById('produto-rating').innerHTML = ratingHTML(produto.nota, produto.avaliacoes);
document.getElementById('produto-preco').innerHTML = precoHTML(produto, 'heading-2');
document.getElementById('produto-descricao').textContent = produto.descricao;
if (produto.badge) {
  document.getElementById('produto-badge').innerHTML =
    '<span class="badge badge--' + produto.badge.tom + '">' + produto.badge.texto + '</span>';
}
var linkCategoria = document.getElementById('breadcrumb-categoria');
linkCategoria.textContent = CATEGORIAS[produto.categoria];
linkCategoria.href = 'categoria.html?categoria=' + produto.categoria;

/* Ficha técnica: lista de termos e definições (<dl>) */
var ficha = [
  ['Composição', '100% ' + produto.tecido.toLowerCase()],
  ['Gramatura', produto.gramatura + ' g/m²'],
  ['Modelagem', produto.modelagem],
  ['Cuidados', 'Lavar do avesso, em água fria. Não usar alvejante. Secar à sombra.'],
  ['Modelo da foto', '1,80 m, veste M']
];
document.getElementById('produto-ficha').innerHTML = ficha.map(function (linha) {
  return '<div class="ficha__linha"><dt>' + linha[0] + '</dt><dd>' + linha[1] + '</dd></div>';
}).join('');


/* ---------- 3. Variações: cor e tamanho como radios nativos ---------- */
var opcoesCor = document.getElementById('opcoes-cor');
opcoesCor.innerHTML = produto.cores.map(function (chave, i) {
  var cor = CORES[chave];
  return '<input type="radio" name="cor" id="cor-' + chave + '" value="' + chave + '"' + (i === 0 ? ' checked' : '') + '>' +
    '<label class="seletor-cor__amostra" for="cor-' + chave + '" style="--cor-produto:' + cor.hex + '">' +
    '<span class="visualmente-oculto">' + cor.nome + '</span></label>';
}).join('');

document.getElementById('opcoes-tamanho').innerHTML = TAMANHOS.map(function (t) {
  var esgotado = produto.esgotados.indexOf(t) !== -1;
  return '<input type="radio" name="tamanho" id="tam-' + t + '" value="' + t + '"' + (esgotado ? ' disabled' : '') + '>' +
    '<label class="seletor-tamanho__caixa" for="tam-' + t + '">' + t +
    (esgotado ? '<span class="visualmente-oculto"> (esgotado)</span>' : '') + '</label>';
}).join('');

/* Ao trocar a cor: atualiza o nome escrito e pinta todas as ilustrações */
function aplicarCor() {
  var chave = document.querySelector('input[name="cor"]:checked').value;
  document.getElementById('cor-escolhida').textContent = CORES[chave].nome;
  document.querySelectorAll('[data-cor]').forEach(function (el) {
    el.style.setProperty('--cor-produto', CORES[chave].hex);
  });
}
opcoesCor.addEventListener('change', aplicarCor);
aplicarCor();

/* Escolher um tamanho esconde a mensagem de erro, se ela estiver visível */
document.getElementById('opcoes-tamanho').addEventListener('change', function () {
  document.getElementById('erro-tamanho').hidden = true;
});


/* ---------- 2. Galeria: cada miniatura mostra uma "vista" (zoom na gola ou na barra) ---------- */
var principal = document.getElementById('imagem-principal');
var descricoesVista = { frente: 'vista de frente', gola: 'detalhe da gola', barra: 'detalhe da barra' };

document.querySelector('.galeria__miniaturas').addEventListener('click', function (evento) {
  var botao = evento.target.closest('[data-vista]');
  if (!botao) return;
  document.querySelectorAll('[data-vista]').forEach(function (b) {
    b.setAttribute('aria-pressed', String(b === botao));
  });
  var vista = botao.getAttribute('data-vista');
  principal.className = 'ilustracao vista--' + vista;
  principal.setAttribute('aria-label', 'Ilustração da camiseta, ' + descricoesVista[vista]);
});


/* ---------- 4. Quantidade ---------- */
var quantidade = 1;
var saidaQuantidade = document.getElementById('quantidade');
document.querySelectorAll('[data-passo]').forEach(function (botao) {
  botao.addEventListener('click', function () {
    quantidade = Math.min(10, Math.max(1, quantidade + Number(botao.getAttribute('data-passo'))));
    saidaQuantidade.textContent = quantidade;
  });
});


/* ---------- 5. Adicionar à sacola ----------
   O botão nunca fica desabilitado. Se faltar o tamanho, mostramos o erro
   ao lado das opções e levamos o foco até elas. */
document.getElementById('form-compra').addEventListener('submit', function (evento) {
  evento.preventDefault();
  var tamanho = document.querySelector('input[name="tamanho"]:checked');
  if (!tamanho) {
    document.getElementById('erro-tamanho').hidden = false;
    document.querySelector('input[name="tamanho"]:not(:disabled)').focus();
    return;
  }
  var cor = document.querySelector('input[name="cor"]:checked').value;
  Sacola.adicionar(produto.id, cor, tamanho.value, quantidade);
  mostrarToast(produto.nome + ' adicionada à sacola', 'Ver sacola', 'sacola.html');
});


/* ---------- 6. Relacionados: mesma categoria primeiro, até 4 ---------- */
var relacionados = PRODUTOS.filter(function (p) { return p.id !== produto.id && p.categoria === produto.categoria; })
  .concat(PRODUTOS.filter(function (p) { return p.id !== produto.id && p.categoria !== produto.categoria; }))
  .slice(0, 4);
document.getElementById('lista-relacionados').innerHTML = relacionados.map(cardProdutoHTML).join('');

/* Link do rodapé "Tabela de medidas" (#medidas) abre o modal direto */
if (location.hash === '#medidas') {
  document.getElementById('modal-medidas').showModal();
}
