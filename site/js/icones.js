/* =========================================================================
   TRAMMA — SPRITE DE ÍCONES
   Insere no início do <body> um SVG invisível com todos os ícones (<symbol>).
   Depois, qualquer ícone é usado assim:
     <svg class="icone" aria-hidden="true"><use href="#icone-sacola"></use></svg>

   Por que via JavaScript? O projeto abre por file:// e não pode buscar arquivos
   (sem fetch). Assim, o desenho fica num lugar só, em vez de repetido em cada página.
   Fonte da verdade do desenho: design-system/icones.svg
   ========================================================================= */
(function () {
  var simbolos = {
    'busca': '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    'sacola': '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/>',
    'menu': '<path d="M4 7h16M4 12h16M4 17h16"/>',
    'fechar': '<path d="M6 6l12 12M18 6L6 18"/>',
    'seta-esquerda': '<path d="M15 5l-7 7 7 7"/>',
    'seta-direita': '<path d="M9 5l7 7-7 7"/>',
    'seta-baixo': '<path d="M5 9l7 7 7-7"/>',
    'mais': '<path d="M12 5v14M5 12h14"/>',
    'menos': '<path d="M5 12h14"/>',
    'check': '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    'info': '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    'alerta': '<path d="M12 3.5L21 19.5H3L12 3.5z"/><path d="M12 10v4M12 17v.5"/>',
    'erro': '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
    'sucesso': '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
    'lixeira': '<path d="M4 7h16M10 4h4M6 7l1 13h10l1-13"/><path d="M10 11v5M14 11v5"/>',
    'usuario': '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    'inicio': '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4v-9z"/>',
    'filtro': '<path d="M4 6h16M7 12h10M10 18h4"/>',
    'frete': '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    'estrela': '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"/>',
    'sol': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    'lua': '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'
  };

  var conteudo = '';
  for (var nome in simbolos) {
    conteudo += '<symbol id="icone-' + nome + '" viewBox="0 0 24 24">' + simbolos[nome] + '</symbol>';
  }
  /* Gradiente usado pela meia estrela (.estrela--meia): metade cheia, metade vazia. */
  conteudo += '<defs><linearGradient id="meia-estrela"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs>';

  /* Tamanho zero em vez de display:none: com display:none o navegador
     não desenha o gradiente da meia estrela. aria-hidden tira o sprite
     da árvore de acessibilidade. */
  var sprite = document.createElement('div');
  sprite.setAttribute('aria-hidden', 'true');
  sprite.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  sprite.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">' + conteudo + '</svg>';
  document.body.insertBefore(sprite, document.body.firstChild);
})();
