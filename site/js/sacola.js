/* =========================================================================
   TRAMMA — PÁGINA DA SACOLA
   Desenha os itens e o resumo. Stepper e remover já são tratados em comum.js,
   que dispara o evento "sacola-mudou"; aqui só redesenhamos quando ele chega.
   ========================================================================= */

/* calcularFrete() e FRETE_GRATIS_A_PARTIR ficam em comum.js (usados também no checkout). */

function desenharSacola() {
  var itens = Sacola.itens();
  var vazia = itens.length === 0;

  document.getElementById('lista-sacola').innerHTML = itens.map(itemSacolaHTML).join('');
  document.getElementById('sacola-vazia').hidden = !vazia;
  document.getElementById('resumo').hidden = vazia;
  if (vazia) return;

  var subtotal = Sacola.subtotal();
  var frete = calcularFrete(subtotal);
  var qtd = Sacola.quantidadeTotal();

  document.getElementById('resumo-qtd').textContent = 'Subtotal (' + qtd + (qtd === 1 ? ' item)' : ' itens)');
  document.getElementById('resumo-subtotal').textContent = formatarPreco(subtotal);
  document.getElementById('resumo-frete').textContent = frete === 0 ? 'Grátis' : formatarPreco(frete);
  document.getElementById('resumo-total').textContent = formatarPreco(subtotal + frete);

  /* Mensagem que ajuda a decidir: quanto falta para o frete grátis */
  var falta = FRETE_GRATIS_A_PARTIR - subtotal;
  document.getElementById('resumo-aviso-frete').textContent = falta > 0
    ? 'Faltam ' + formatarPreco(falta) + ' para o frete grátis.'
    : 'Você ganhou frete grátis.';
}

document.addEventListener('sacola-mudou', desenharSacola);
desenharSacola();
