/* =========================================================================
   TRAMMA — CATÁLOGO (dados fictícios)
   Os dados ficam num objeto JavaScript comum, carregado por <script>.
   Não usamos fetch nem JSON externo: o projeto precisa abrir via file://.
   ========================================================================= */

/* Cores do tecido. São DADOS do produto, não tokens de interface. */
var CORES = {
  'branco-cru':   { nome: 'Branco-cru',   hex: '#F4EFE4' },
  'preto':        { nome: 'Preto',        hex: '#1A1A1A' },
  'cinza-mescla': { nome: 'Cinza-mescla', hex: '#9A9A9A' },
  'marinho':      { nome: 'Marinho',      hex: '#1F2A44' },
  'oliva':        { nome: 'Oliva',        hex: '#5A6340' },
  'areia':        { nome: 'Areia',        hex: '#D8C6A3' },
  'terracota':    { nome: 'Terracota',    hex: '#B5583A' }
};

var TAMANHOS = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];

var CATEGORIAS = {
  'essenciais':  'Essenciais',
  'pesadas':     'Pesadas',
  'manga-longa': 'Manga longa',
  'kits':        'Kits'
};

var PRODUTOS = [
  {
    id: 'essencial-gola-careca', nome: 'Essencial Gola Careca', categoria: 'essenciais',
    modelagem: 'Regular', tecido: 'Algodão penteado', gramatura: 180,
    preco: 99, precoAnterior: null, badge: { texto: 'Mais vendido', tom: 'neutro' },
    cores: ['branco-cru', 'preto', 'cinza-mescla', 'marinho', 'oliva', 'areia'],
    esgotados: ['XGG'], nota: 4.8, avaliacoes: 126,
    descricao: 'A camiseta que vai com tudo. Malha de algodão penteado com toque macio, gola careca com ribana firme e costura dupla na barra.'
  },
  {
    id: 'essencial-gola-v', nome: 'Essencial Gola V', categoria: 'essenciais',
    modelagem: 'Regular', tecido: 'Algodão penteado', gramatura: 180,
    preco: 99, precoAnterior: null, badge: null,
    cores: ['branco-cru', 'preto', 'marinho'],
    esgotados: [], nota: 4.6, avaliacoes: 48,
    descricao: 'O mesmo tecido da Essencial, com decote em V de profundidade média. Fica bem sozinha ou sob uma camisa aberta.'
  },
  {
    id: 'essencial-slim', nome: 'Essencial Slim', categoria: 'essenciais',
    modelagem: 'Ajustada', tecido: 'Algodão penteado', gramatura: 180,
    preco: 109, precoAnterior: null, badge: { texto: 'Novo', tom: 'marca' },
    cores: ['preto', 'cinza-mescla', 'marinho', 'oliva'],
    esgotados: ['PP'], nota: 4.5, avaliacoes: 22,
    descricao: 'Modelagem mais próxima do corpo, com manga um pouco mais curta. Para quem prefere um caimento ajustado.'
  },
  {
    id: 'essencial-com-bolso', nome: 'Essencial com Bolso', categoria: 'essenciais',
    modelagem: 'Regular', tecido: 'Algodão penteado', gramatura: 180,
    preco: 109, precoAnterior: null, badge: null,
    cores: ['branco-cru', 'areia', 'oliva'],
    esgotados: [], nota: 4.7, avaliacoes: 35,
    descricao: 'A Essencial com um bolso no peito, costurado no mesmo tecido. Um detalhe pequeno que muda o visual.'
  },
  {
    id: 'pesada-oversized', nome: 'Pesada Oversized', categoria: 'pesadas',
    modelagem: 'Ampla', tecido: 'Algodão penteado', gramatura: 240,
    preco: 139, precoAnterior: null, badge: { texto: 'Últimas unidades', tom: 'aviso' },
    cores: ['preto', 'branco-cru', 'terracota'],
    esgotados: ['P', 'XGG'], nota: 4.9, avaliacoes: 87,
    descricao: 'Malha encorpada de 240 g/m², ombro caído e corpo amplo. Estrutura que mantém a forma lavagem após lavagem.'
  },
  {
    id: 'pesada-gola-alta', nome: 'Pesada Gola Alta', categoria: 'pesadas',
    modelagem: 'Regular', tecido: 'Algodão penteado', gramatura: 240,
    preco: 139, precoAnterior: null, badge: null,
    cores: ['cinza-mescla', 'marinho', 'preto'],
    esgotados: [], nota: 4.6, avaliacoes: 19,
    descricao: 'Tecido pesado com gola um pouco mais alta e estreita. Visual limpo, quase de alfaiataria.'
  },
  {
    id: 'henley', nome: 'Henley', categoria: 'pesadas',
    modelagem: 'Regular', tecido: 'Algodão penteado', gramatura: 200,
    preco: 139, precoAnterior: null, badge: { texto: 'Novo', tom: 'marca' },
    cores: ['areia', 'oliva', 'marinho'],
    esgotados: [], nota: 4.4, avaliacoes: 12,
    descricao: 'Gola careca com abertura de três botões. Fica entre a camiseta e a camisa.'
  },
  {
    id: 'manga-longa-essencial', nome: 'Manga Longa Essencial', categoria: 'manga-longa',
    modelagem: 'Regular', tecido: 'Algodão penteado', gramatura: 180,
    preco: 129, precoAnterior: null, badge: null,
    cores: ['branco-cru', 'preto', 'cinza-mescla', 'marinho'],
    esgotados: ['GG'], nota: 4.7, avaliacoes: 41,
    descricao: 'A Essencial em versão manga longa, com punho em ribana. Para dias frios ou por baixo de outras peças.'
  },
  {
    id: 'pima', nome: 'Pima', categoria: 'essenciais',
    modelagem: 'Regular', tecido: 'Algodão pima', gramatura: 160,
    preco: 179, precoAnterior: null, badge: null,
    cores: ['branco-cru', 'preto', 'areia'],
    esgotados: [], nota: 4.9, avaliacoes: 29,
    descricao: 'Algodão pima de fibra longa: mais macio, com brilho sutil e menos bolinhas com o uso.'
  },
  {
    id: 'kit-3-essenciais', nome: 'Kit 3 Essenciais', categoria: 'kits',
    modelagem: 'Regular', tecido: 'Algodão penteado', gramatura: 180,
    preco: 269, precoAnterior: 297, badge: { texto: 'Promoção', tom: 'sucesso' },
    cores: ['preto', 'branco-cru', 'cinza-mescla'],
    esgotados: [], nota: 4.8, avaliacoes: 64,
    descricao: 'Três Essenciais Gola Careca do mesmo tamanho, na cor que você escolher. Sai mais em conta que comprar separado.'
  }
];


/* ---------- Funções de apoio (usadas por todas as páginas) ---------- */

/* Endereço da página de um produto. O site usa produto.html?id=…;
   a versão app substitui esta função para usar as telas internas (#produto/…).
   Assim, este arquivo pode ser idêntico nas duas pastas. */
var linkProduto = function (id) {
  return 'produto.html?id=' + id;
};

/* Procura um produto pelo id. */
function buscarProduto(id) {
  for (var i = 0; i < PRODUTOS.length; i++) {
    if (PRODUTOS[i].id === id) return PRODUTOS[i];
  }
  return null;
}

/* Formata número como moeda brasileira: 99 → "R$ 99,00". */
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* Ilustração da camiseta em SVG. A cor vem da custom property --cor-produto
   do elemento pai, então trocar a cor é só trocar essa variável.
   aria-hidden: a imagem é decorativa; o nome do produto já está em texto. */
function ilustracaoSVG() {
  return '<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">' +
    '<path d="M70 30 L50 38 L20 62 L34 88 L52 78 L52 175 L148 175 L148 78 L166 88 L180 62 L150 38 L130 30 C124 42 112 48 100 48 C88 48 76 42 70 30 Z"/>' +
    '</svg>';
}

/* Estrelas da avaliação (decorativas) + nota em texto. */
function ratingHTML(nota, avaliacoes) {
  var estrelas = '';
  for (var i = 1; i <= 5; i++) {
    var tipo = nota >= i ? '' : (nota >= i - 0.5 ? ' estrela--meia' : ' estrela--vazia');
    estrelas += '<svg class="estrela' + tipo + '" viewBox="0 0 24 24"><use href="#icone-estrela"></use></svg>';
  }
  return '<div class="rating">' +
    '<div class="rating__estrelas" aria-hidden="true">' + estrelas + '</div>' +
    '<p class="rating__texto">' + nota.toLocaleString('pt-BR') + ' de 5 (' + avaliacoes + ' avaliações)</p>' +
    '</div>';
}

/* Preço com o valor anterior riscado (e anunciado aos leitores de tela). */
function precoHTML(produto, classeTamanho) {
  var html = '<p class="preco"><span class="preco__atual ' + (classeTamanho || '') + '">' +
    formatarPreco(produto.preco) + '</span>';
  if (produto.precoAnterior) {
    html += '<s class="preco__anterior"><span class="visualmente-oculto">Preço anterior: </span>' +
      formatarPreco(produto.precoAnterior) + '</s>';
  }
  return html + '</p>';
}

/* Card de produto (organismo). Retorna um <li> para entrar numa .lista-produtos. */
function cardProdutoHTML(produto) {
  var corInicial = CORES[produto.cores[0]].hex;
  var bolinhas = '';
  for (var i = 0; i < Math.min(4, produto.cores.length); i++) {
    bolinhas += '<span class="card-produto__cor" style="--cor-produto:' + CORES[produto.cores[i]].hex + '"></span>';
  }
  var extra = produto.cores.length > 4 ? '+' + (produto.cores.length - 4) : '';
  var badge = produto.badge
    ? '<span class="badge badge--' + produto.badge.tom + '">' + produto.badge.texto + '</span>'
    : '';

  return '<li>' +
    '<article class="card-produto">' +
      '<div class="ilustracao" style="--cor-produto:' + corInicial + '">' + ilustracaoSVG() + '</div>' +
      badge +
      '<div class="card-produto__conteudo">' +
        '<h3 class="card-produto__nome body semibold"><a href="' + linkProduto(produto.id) + '">' + produto.nome + '</a></h3>' +
        '<p class="small texto-fraco">' + produto.tecido + ' ' + produto.gramatura + ' g/m²</p>' +
        '<p class="card-produto__cores">' + bolinhas +
          '<span>' + extra + '</span>' +
          '<span class="visualmente-oculto">' + produto.cores.length + ' cores disponíveis</span></p>' +
        precoHTML(produto, 'heading-3') +
      '</div>' +
    '</article>' +
  '</li>';
}
