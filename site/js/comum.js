/* =========================================================================
   TRAMMA — COMPORTAMENTOS COMUNS A TODAS AS PÁGINAS
   1. Tema claro/escuro      4. Sacola (dados no localStorage)
   2. Menu lateral (mobile)  5. Drawer da sacola
   3. Busca no header        6. Toast (confirmação)
   ========================================================================= */


/* ---------- Leitura e escrita segura no localStorage ----------
   Em janela anônima ou com armazenamento bloqueado, o localStorage pode falhar.
   O try/catch garante que a página continua funcionando mesmo assim. */
function lerArmazenamento(chave, padrao) {
  try {
    var valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : padrao;
  } catch (erro) {
    return padrao;
  }
}
function gravarArmazenamento(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    /* sem armazenamento: a sacola dura só até recarregar a página */
  }
}


/* =========================================================================
   1. TEMA — o padrão segue o sistema (prefers-color-scheme).
   O botão grava a escolha em data-theme no <html>, que vence a preferência do sistema.
   ========================================================================= */
var temaSalvo = lerArmazenamento('tramma-tema', null);
if (temaSalvo) {
  document.documentElement.setAttribute('data-theme', temaSalvo);
}

function temaAtual() {
  var escolhido = document.documentElement.getAttribute('data-theme');
  if (escolhido) return escolhido;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function atualizarBotaoTema() {
  var botao = document.querySelector('[data-acao="tema"]');
  if (!botao) return;
  var escuro = temaAtual() === 'dark';
  /* O rótulo diz o que o botão FAZ, não o estado atual. */
  botao.setAttribute('aria-label', escuro ? 'Usar tema claro' : 'Usar tema escuro');
  botao.querySelector('use').setAttribute('href', escuro ? '#icone-sol' : '#icone-lua');
}

document.addEventListener('click', function (evento) {
  var botao = evento.target.closest('[data-acao="tema"]');
  if (!botao) return;
  var novo = temaAtual() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', novo);
  gravarArmazenamento('tramma-tema', novo);
  atualizarBotaoTema();
});


/* =========================================================================
   2 e 5. DRAWERS (menu e sacola) com o elemento nativo <dialog>.
   showModal() já prende o foco dentro do painel, fecha com Esc,
   deixa o resto da página inerte e devolve o foco ao botão que abriu.
   ========================================================================= */
function abrirDialogo(id) {
  var dialogo = document.getElementById(id);
  if (dialogo && !dialogo.open) dialogo.showModal();
}

document.addEventListener('click', function (evento) {
  /* Botões que abrem: data-abrir="id-do-dialog" */
  var abrir = evento.target.closest('[data-abrir]');
  if (abrir) {
    if (abrir.getAttribute('data-abrir') === 'drawer-sacola') renderizarDrawerSacola();
    abrirDialogo(abrir.getAttribute('data-abrir'));
    return;
  }
  /* Botões que fecham: data-fechar dentro do dialog */
  var fechar = evento.target.closest('[data-fechar]');
  if (fechar) {
    fechar.closest('dialog').close();
    return;
  }
  /* Clique no overlay (fora do painel) também fecha */
  if (evento.target.tagName === 'DIALOG') {
    evento.target.close();
  }
});


/* =========================================================================
   3. BUSCA — o botão de lupa mostra/esconde o formulário de busca.
   aria-expanded avisa ao leitor de tela se a área está aberta.
   ========================================================================= */
document.addEventListener('click', function (evento) {
  var botao = evento.target.closest('[data-acao="busca"]');
  if (!botao) return;
  var area = document.getElementById(botao.getAttribute('aria-controls'));
  var aberto = botao.getAttribute('aria-expanded') === 'true';
  botao.setAttribute('aria-expanded', String(!aberto));
  area.hidden = aberto;
  if (!aberto) area.querySelector('input').focus();
});


/* =========================================================================
   4. SACOLA — lista de itens { id, cor, tamanho, quantidade } no localStorage,
   para continuar existindo ao trocar de página.
   ========================================================================= */
var Sacola = {
  itens: function () {
    return lerArmazenamento('tramma-sacola', []);
  },
  salvar: function (itens) {
    gravarArmazenamento('tramma-sacola', itens);
    atualizarContador();
  },
  adicionar: function (id, cor, tamanho, quantidade) {
    var itens = this.itens();
    var existente = itens.find(function (item) {
      return item.id === id && item.cor === cor && item.tamanho === tamanho;
    });
    if (existente) {
      existente.quantidade += quantidade;
    } else {
      itens.push({ id: id, cor: cor, tamanho: tamanho, quantidade: quantidade });
    }
    this.salvar(itens);
  },
  alterarQuantidade: function (indice, quantidade) {
    var itens = this.itens();
    if (quantidade < 1) {
      itens.splice(indice, 1);
    } else {
      itens[indice].quantidade = Math.min(quantidade, 10);
    }
    this.salvar(itens);
  },
  remover: function (indice) {
    var itens = this.itens();
    itens.splice(indice, 1);
    this.salvar(itens);
  },
  quantidadeTotal: function () {
    return this.itens().reduce(function (soma, item) { return soma + item.quantidade; }, 0);
  },
  subtotal: function () {
    return this.itens().reduce(function (soma, item) {
      return soma + buscarProduto(item.id).preco * item.quantidade;
    }, 0);
  }
};

/* Frete: grátis a partir de R$ 299; abaixo disso, frete normal. */
var FRETE_GRATIS_A_PARTIR = 299;
var FRETE_NORMAL = 19.9;
var FRETE_EXPRESSO = 34.9;
function calcularFrete(subtotal, tipo) {
  if (tipo === 'expresso') return FRETE_EXPRESSO;
  return subtotal >= FRETE_GRATIS_A_PARTIR ? 0 : FRETE_NORMAL;
}

/* Contador no ícone da sacola. O texto oculto dá contexto ao leitor de tela. */
function atualizarContador() {
  var total = Sacola.quantidadeTotal();
  document.querySelectorAll('[data-contador-sacola]').forEach(function (contador) {
    contador.textContent = total > 0 ? total : '';
  });
  document.querySelectorAll('[data-rotulo-sacola]').forEach(function (rotulo) {
    rotulo.textContent = 'Sacola, ' + total + (total === 1 ? ' item' : ' itens');
  });
}

/* HTML de um item (usado no drawer e na página da sacola). */
function itemSacolaHTML(item, indice) {
  var produto = buscarProduto(item.id);
  var cor = CORES[item.cor];
  return '<li class="item-sacola">' +
    '<div class="ilustracao" style="--cor-produto:' + cor.hex + '">' + ilustracaoSVG() + '</div>' +
    '<div class="item-sacola__detalhes">' +
      '<div class="item-sacola__topo">' +
        '<div><p class="item-sacola__nome semibold"><a href="produto.html?id=' + produto.id + '">' + produto.nome + '</a></p>' +
        '<p class="small texto-fraco">' + cor.nome + ' · ' + item.tamanho + '</p></div>' +
        '<p class="semibold">' + formatarPreco(produto.preco * item.quantidade) + '</p>' +
      '</div>' +
      '<div class="item-sacola__acoes">' +
        '<div class="stepper" role="group" aria-label="Quantidade de ' + produto.nome + '">' +
          '<button class="botao-icone" type="button" data-qtd="-1" data-indice="' + indice + '" aria-label="Diminuir quantidade">' +
            '<svg class="icone icone--md" aria-hidden="true"><use href="#icone-menos"></use></svg></button>' +
          '<span class="stepper__valor" aria-live="polite">' + item.quantidade + '</span>' +
          '<button class="botao-icone" type="button" data-qtd="1" data-indice="' + indice + '" aria-label="Aumentar quantidade">' +
            '<svg class="icone icone--md" aria-hidden="true"><use href="#icone-mais"></use></svg></button>' +
        '</div>' +
        '<button class="botao botao--terciario botao--p" type="button" data-remover="' + indice + '">' +
          '<svg class="icone" aria-hidden="true"><use href="#icone-lixeira"></use></svg>Remover' +
          '<span class="visualmente-oculto"> ' + produto.nome + '</span></button>' +
      '</div>' +
    '</div>' +
  '</li>';
}

/* Desenha o conteúdo do drawer da sacola. */
function renderizarDrawerSacola() {
  var corpo = document.getElementById('drawer-sacola-corpo');
  var rodape = document.getElementById('drawer-sacola-rodape');
  var titulo = document.getElementById('drawer-sacola-titulo');
  if (!corpo) return;
  var itens = Sacola.itens();
  titulo.textContent = 'Sacola (' + Sacola.quantidadeTotal() + ')';

  if (itens.length === 0) {
    /* Estado vazio: explica e diz o que fazer, em vez de uma tela em branco. */
    corpo.innerHTML = '<div class="pilha"><p>Sua sacola está vazia.</p>' +
      '<a class="botao botao--secundario" href="categoria.html">Ver camisetas</a></div>';
    rodape.hidden = true;
    return;
  }
  corpo.innerHTML = '<ul class="lista-sacola">' + itens.map(itemSacolaHTML).join('') + '</ul>';
  rodape.hidden = false;
  document.getElementById('drawer-sacola-subtotal').textContent = formatarPreco(Sacola.subtotal());
}

/* Stepper e remover funcionam em qualquer lugar onde um item aparecer.
   Depois de mudar, avisamos a página (evento "sacola-mudou") para ela se redesenhar. */
document.addEventListener('click', function (evento) {
  var botaoQtd = evento.target.closest('[data-qtd]');
  var botaoRemover = evento.target.closest('[data-remover]');
  if (!botaoQtd && !botaoRemover) return;

  if (botaoQtd) {
    var indice = Number(botaoQtd.getAttribute('data-indice'));
    var item = Sacola.itens()[indice];
    Sacola.alterarQuantidade(indice, item.quantidade + Number(botaoQtd.getAttribute('data-qtd')));
  } else {
    Sacola.remover(Number(botaoRemover.getAttribute('data-remover')));
    mostrarToast('Item removido da sacola');
  }
  renderizarDrawerSacola();
  document.dispatchEvent(new CustomEvent('sacola-mudou'));
});


/* =========================================================================
   6. TOAST — mensagem curta anunciada por aria-live="polite".
   ========================================================================= */
var temporizadorToast;
function mostrarToast(mensagem, linkTexto, linkDestino) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  var link = linkTexto ? ' <a href="' + linkDestino + '">' + linkTexto + '</a>' : '';
  toast.innerHTML = '<svg class="icone icone--md" aria-hidden="true"><use href="#icone-check"></use></svg>' +
    '<p>' + mensagem + '</p>' + link;
  toast.classList.add('toast--visivel');
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(function () {
    toast.classList.remove('toast--visivel');
    /* Depois da animação, esvazia: o link escondido não pode receber foco pelo Tab. */
    setTimeout(function () { toast.innerHTML = ''; }, 300);
  }, 5000);
}


/* ---------- Ao carregar qualquer página ---------- */
atualizarBotaoTema();
atualizarContador();
