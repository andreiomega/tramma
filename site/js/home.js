/* =========================================================================
   TRAMMA — HOME
   Escolhe produtos do catálogo e desenha os cards nas duas vitrines.
   ========================================================================= */

/* Mais vendidas: as 4 com mais avaliações. slice() copia antes de ordenar. */
var maisVendidas = PRODUTOS.slice()
  .sort(function (a, b) { return b.avaliacoes - a.avaliacoes; })
  .slice(0, 4);

/* Novidades: as marcadas com o badge "Novo", completando até 4. */
var novidades = PRODUTOS.filter(function (p) { return p.badge && p.badge.texto === 'Novo'; })
  .concat(PRODUTOS.filter(function (p) { return !p.badge; }))
  .slice(0, 4);

document.getElementById('lista-destaques').innerHTML = maisVendidas.map(cardProdutoHTML).join('');
document.getElementById('lista-novidades').innerHTML = novidades.map(cardProdutoHTML).join('');
