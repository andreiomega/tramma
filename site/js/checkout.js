/* =========================================================================
   TRAMMA — CHECKOUT EM 3 ETAPAS
   1. Navegação entre etapas (uma visível por vez)
   2. Validação no envio de cada etapa (nunca botão desabilitado)
   3. Resumo do pedido e confirmação
   ========================================================================= */

var form = document.getElementById('form-checkout');
var etapaAtual = 1;

/* ---------- Regras de validação ----------
   Cada campo diz sua regra em data-validar. A função devolve a mensagem de erro
   (que explica o que aconteceu e como resolver) ou '' quando está tudo certo. */
var REGRAS = {
  obrigatorio: function (v, rotulo) { return v ? '' : 'Preencha o campo ' + rotulo.toLowerCase(); },
  email: function (v) {
    if (!v) return 'Informe seu e-mail';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Informe um e-mail no formato nome@exemplo.com';
  },
  cep: function (v) { return v.replace(/\D/g, '').length === 8 ? '' : 'Informe um CEP com 8 números'; },
  uf: function (v) { return /^[A-Za-z]{2}$/.test(v) ? '' : 'Informe a sigla do estado com 2 letras, como SP'; },
  cartao: function (v) {
    var n = v.replace(/\D/g, '').length;
    return n >= 13 && n <= 19 ? '' : 'Informe o número do cartão, de 13 a 19 números';
  },
  validade: function (v) { return /^(0[1-9]|1[0-2])\/\d{2}$/.test(v) ? '' : 'Informe a validade no formato MM/AA, como 08/29'; },
  cvv: function (v) { return /^\d{3,4}$/.test(v) ? '' : 'Informe o código de segurança com 3 ou 4 números'; }
};

/* Rótulo do campo sem o "(opcional)", para usar nas mensagens */
function rotuloDe(campo) {
  return document.querySelector('label[for="' + campo.id + '"]').firstChild.textContent.trim();
}

/* Mostra ou esconde o erro de um campo. aria-invalid avisa o leitor de tela;
   a mensagem está ligada ao campo por aria-describedby. */
function marcarErro(campo, mensagem) {
  var erro = document.getElementById(campo.id + '-erro');
  if (mensagem) {
    campo.setAttribute('aria-invalid', 'true');
    erro.innerHTML = '<svg class="icone icone--sm" aria-hidden="true"><use href="#icone-erro"></use></svg>' + mensagem;
    erro.hidden = false;
  } else {
    campo.removeAttribute('aria-invalid');
    erro.hidden = true;
  }
}

/* Valida os campos visíveis da etapa atual. Devolve a lista de erros. */
function validarEtapa() {
  var secao = form.querySelector('[data-etapa="' + etapaAtual + '"]');
  var erros = [];
  secao.querySelectorAll('[data-validar]').forEach(function (campo) {
    if (campo.closest('[hidden]')) return; /* campos escondidos (cartão, se for Pix) não contam */
    var mensagem = REGRAS[campo.getAttribute('data-validar')](campo.value.trim(), rotuloDe(campo));
    marcarErro(campo, mensagem);
    if (mensagem) erros.push({ campo: campo, mensagem: mensagem });
  });
  return erros;
}

/* Com mais de um erro: resumo no topo, com links para cada campo.
   Com um só erro: basta a mensagem junto ao campo, e o foco vai até ele. */
function mostrarResumoErros(erros) {
  var resumo = document.getElementById('resumo-erros');
  if (erros.length < 2) {
    resumo.hidden = true;
    if (erros.length === 1) erros[0].campo.focus();
    return;
  }
  document.getElementById('resumo-erros-titulo').textContent = 'Corrija ' + erros.length + ' campos para continuar';
  document.getElementById('resumo-erros-lista').innerHTML = erros.map(function (e) {
    return '<li><a href="#' + e.campo.id + '">' + e.mensagem + '</a></li>';
  }).join('');
  resumo.hidden = false;
  resumo.focus();
}

/* Clicar num link do resumo leva o foco direto ao campo */
document.getElementById('resumo-erros-lista').addEventListener('click', function (evento) {
  var link = evento.target.closest('a');
  if (!link) return;
  evento.preventDefault();
  document.querySelector(link.getAttribute('href')).focus();
});

/* Ao corrigir um campo que estava com erro, o erro some na hora */
form.addEventListener('input', function (evento) {
  var campo = evento.target;
  if (campo.getAttribute('aria-invalid') === 'true') {
    var mensagem = REGRAS[campo.getAttribute('data-validar')](campo.value.trim(), rotuloDe(campo));
    if (!mensagem) marcarErro(campo, '');
  }
});


/* ---------- 1. Navegação entre etapas ---------- */
function irParaEtapa(numero) {
  etapaAtual = numero;
  form.querySelectorAll('[data-etapa]').forEach(function (secao) {
    secao.hidden = Number(secao.getAttribute('data-etapa')) !== numero;
  });
  document.querySelectorAll('#etapas li').forEach(function (li, i) {
    li.classList.toggle('etapas__feita', i + 1 < numero);
    if (i + 1 === numero) li.setAttribute('aria-current', 'step');
    else li.removeAttribute('aria-current');
  });
  document.getElementById('resumo-erros').hidden = true;
  if (numero === 3) montarRevisao();
  /* Foco no título da nova etapa: o leitor de tela anuncia onde a pessoa está */
  var titulo = document.getElementById('etapa' + numero + '-titulo');
  titulo.setAttribute('tabindex', '-1');
  titulo.focus();
}

form.addEventListener('submit', function (evento) {
  evento.preventDefault();
  var erros = validarEtapa();
  if (erros.length) {
    mostrarResumoErros(erros);
    return;
  }
  if (etapaAtual < 3) {
    irParaEtapa(etapaAtual + 1);
  } else {
    confirmarPedido();
  }
});

form.addEventListener('click', function (evento) {
  if (evento.target.closest('[data-voltar]')) irParaEtapa(etapaAtual - 1);
});

/* Pix ou cartão: mostra só os campos necessários */
form.addEventListener('change', function (evento) {
  if (evento.target.name === 'pagamento') {
    var cartao = evento.target.value === 'cartao';
    document.getElementById('campos-cartao').hidden = !cartao;
    document.getElementById('info-pix').hidden = cartao;
  }
  if (evento.target.name === 'frete') atualizarResumo();
});


/* ---------- 3. Resumo, revisão e confirmação ---------- */
function freteEscolhido() {
  var escolhido = form.querySelector('input[name="frete"]:checked');
  return escolhido ? escolhido.value : 'normal';
}

function atualizarResumo() {
  var itens = Sacola.itens();
  var subtotal = Sacola.subtotal();
  var frete = itens.length ? calcularFrete(subtotal, freteEscolhido()) : 0;
  document.getElementById('resumo-itens').innerHTML = itens.map(function (item) {
    var p = buscarProduto(item.id);
    return '<li class="resumo-pedido__linha small"><span>' + item.quantidade + '× ' + p.nome +
      ' <span class="texto-fraco">(' + CORES[item.cor].nome + ', ' + item.tamanho + ')</span></span>' +
      '<span>' + formatarPreco(p.preco * item.quantidade) + '</span></li>';
  }).join('');
  document.getElementById('resumo-subtotal').textContent = formatarPreco(subtotal);
  document.getElementById('resumo-frete').textContent = frete === 0 ? 'Grátis' : formatarPreco(frete);
  document.getElementById('resumo-total').textContent = formatarPreco(subtotal + frete);
  var precoNormal = calcularFrete(subtotal, 'normal');
  var rotuloNormal = document.getElementById('preco-frete-normal');
  if (rotuloNormal) rotuloNormal.textContent = precoNormal === 0 ? 'Grátis' : formatarPreco(precoNormal);
}

function montarRevisao() {
  var v = function (id) { return document.getElementById(id).value.trim(); };
  var pagamento = form.querySelector('input[name="pagamento"]:checked').value === 'pix'
    ? 'Pix'
    : 'Cartão final ' + v('cartao-numero').replace(/\D/g, '').slice(-4);
  var linhas = [
    ['Entregar para', v('nome')],
    ['Endereço', v('endereco') + ', ' + v('numero') + (v('complemento') ? ' – ' + v('complemento') : '') +
      ', ' + v('cidade') + '/' + v('uf').toUpperCase() + ', CEP ' + v('cep')],
    ['Frete', freteEscolhido() === 'expresso' ? 'Expresso, de 2 a 3 dias úteis' : 'Normal, de 5 a 8 dias úteis'],
    ['Pagamento', pagamento],
    ['Confirmação para', v('email')]
  ];
  /* textContent em vez de innerHTML para o que a pessoa digitou: evita injetar HTML */
  var revisao = document.getElementById('revisao');
  revisao.innerHTML = '';
  linhas.forEach(function (linha) {
    var div = document.createElement('div');
    div.className = 'ficha__linha';
    var dt = document.createElement('dt'); dt.textContent = linha[0];
    var dd = document.createElement('dd'); dd.textContent = linha[1];
    div.appendChild(dt); div.appendChild(dd);
    revisao.appendChild(div);
  });
}

function confirmarPedido() {
  Sacola.salvar([]);
  form.hidden = true;
  document.getElementById('etapas').hidden = true;
  var confirmado = document.getElementById('confirmado');
  confirmado.hidden = false;
  confirmado.focus();
}

/* Sacola vazia: não há o que finalizar. Mostramos o caminho de volta. */
if (Sacola.itens().length === 0) {
  form.innerHTML = '<div class="vazio pilha"><p class="heading-3">Sua sacola está vazia</p>' +
    '<p class="texto-fraco">Adicione uma camiseta para finalizar a compra.</p>' +
    '<div><a class="botao botao--primario" href="categoria.html">Ver camisetas</a></div></div>';
}
atualizarResumo();
