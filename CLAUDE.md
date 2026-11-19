# Tramma — instruções do projeto

Projeto didático: e-commerce fictício de camisetas premium chamado **Tramma**. Ele será usado em aulas de UI, design system, design responsivo, design de apps, design de interação e acessibilidade. O código e o histórico de commits serão lidos por alunos.

Estas regras valem para todas as sessões. Em caso de dúvida, pergunte antes de decidir.

## Como trabalhar

- Responda sempre em **português**, com tom formal e direto.
- O professor revisa e aprova cada etapa. **Ao fim de cada etapa, faça o commit, mostre o resultado e pare** até receber aprovação.
- Ordem das etapas: tokens → design system no Figma → CSS dos tokens → átomos → moléculas → organismos → páginas do site → versão app → publicação (GitHub Pages ou Netlify).
- Um commit por etapa (ou subetapa), com mensagem em português no formato `etapa: descrição` (ex.: `tokens: primitivos e semânticos em light e dark`). O histórico é material de aula: commits pequenos, coerentes e legíveis.

## Regras técnicas (inegociáveis)

- **HTML, CSS e JavaScript 100% vanilla.** Sem frameworks, bibliotecas, pré-processadores, build, npm ou qualquer dependência.
- **JavaScript só para manipular o DOM:** menu, filtros, galeria, variações, carrinho, validação de formulário e navegação entre telas do app. Sem `fetch`, sem `import`/`export`, sem nada que exija servidor.
- **Tudo abre com dois cliques no `index.html`** (protocolo `file://`). Use caminhos relativos em todos os links, scripts, imagens e fontes.
- **Dados dos produtos** ficam em objetos JS (`js/produtos.js`, carregado por `<script>` comum) ou direto no HTML.
- **Persistência:** `localStorage` é permitido apenas para a sacola e a preferência de tema, sempre com `try/catch` e com a página funcionando se ele falhar.
- **Código limpo, semântico e comentado de forma didática.** Os comentários explicam o *porquê* de cada decisão (acessibilidade, token escolhido, padrão de interação), não apenas o *quê*.
- **Mobile-first:** o CSS base é o mobile, e as telas maiores vêm em `@media (min-width: ...)`.

## Estrutura de pastas

```
tramma/
├── CLAUDE.md
├── design-system/
│   └── tokens.md      # fonte da verdade dos tokens (Figma e CSS derivam daqui)
├── site/              # site responsivo
│   ├── index.html     # home
│   ├── categoria.html
│   ├── produto.html
│   ├── sacola.html
│   ├── checkout.html
│   ├── css/
│   ├── js/
│   ├── img/
│   └── fonts/
└── app/               # versão aplicativo (pasta independente)
    ├── index.html
    ├── css/
    ├── js/
    ├── img/
    └── fonts/
```

- As imagens de produto são SVG gerado por JS (`ilustracaoSVG()`), então `img/` só existe quando houver arquivo de imagem.
- **Arquivos compartilhados idênticos** em `site/` e `app/`: `css/tokens.css`, `base.css`, `atomos.css`, `moleculas.css`, `organismos.css`, `js/icones.js`, `produtos.js`, `comum.js`, `fonts/`. Edite em `site/` e copie para `app/`; confira com `cmp`. O que é só do site fica em `css/paginas.css` e nos scripts de página; o que é só do app fica em `app/css/app.css` e `app/js/app.js`.
- App: página única com telas por `#hash` (`#inicio`, `#buscar`, `#produto/id`, `#sacola`, `#checkout`, `#confirmado`, `#conta`). `linkProduto()` é sobrescrito no app.
- `site/` e `app/` são independentes: cada uma tem sua cópia de `css/tokens.css`, fontes e dados, para abrir sozinha via `file://`. O arquivo de tokens deve ser **idêntico** nas duas pastas.
- Organização do CSS em camadas que espelham o atomic design: `tokens.css` → `base.css` (reset e elementos HTML) → `atomos.css` → `moleculas.css` → `organismos.css` → `paginas.css` (ou `app.css`).

## Acessibilidade (WCAG 2.1 AA, mínimo)

- HTML semântico primeiro (`header`, `nav`, `main`, `footer`, `button`, `a`, `fieldset`/`legend`, `label`). ARIA só quando o HTML nativo não resolve (ex.: `aria-expanded`, `aria-current`, `aria-live` no toast e na sacola, `role="dialog"` com `aria-modal` no drawer, modal e bottom sheet).
- Contraste: texto ≥ 4,5:1; texto grande ≥ 3:1; bordas de controles e ícones com significado ≥ 3:1. No dark mode, buscar valores bem acima do mínimo.
- **Foco sempre visível:** anel sólido de 2px em `--color-stroke-focus`, com 2px de afastamento (`outline-offset`). Nunca remover o `outline` sem substituto.
- Alvos de toque de pelo menos **48×48px**, com 8px entre alvos vizinhos. Controles pequenos (checkbox, radio, tag, link em texto) têm no mínimo 24×24px, com o rótulo fazendo parte da área clicável.
- Nada comunicado só por cor: status com ícone e texto, links em texto sublinhados, erro com borda mais grossa, ícone e mensagem.
- Teclado: toda interação funciona sem mouse; drawer, modal e bottom sheet prendem o foco, fecham com `Esc` e devolvem o foco ao elemento que os abriu.
- `prefers-reduced-motion`: transições e animações reduzidas ou removidas.
- Imagens com `alt` descritivo (ou `alt=""` quando decorativas). `lang="pt-BR"` em todas as páginas.
- Link "Pular para o conteúdo" no início de cada página.

## Design system

### Referência de princípios

O arquivo **DESIGN.md (Practical UI, de Adham Dannaway)** é licenciado para uso do professor e **não pode ser redistribuído**. Ele fica no Google Drive do professor, **nunca** dentro deste repositório (está no `.gitignore`). Use-o só como referência de princípios; não copie trechos, tokens ou textos dele para o projeto. Nosso sistema é próprio e mais enxuto.

Princípios adotados (com palavras nossas):

- Cada detalhe precisa de um motivo; na dúvida, escolha o padrão mais convencional.
- **Uma cor de marca**, usada só no que é interativo (links, botões, seleção, foco). Exceção: badges de destaque como "Novo". Títulos e textos nunca usam a cor da marca.
- **Um botão primário visível por vez.** As demais ações são secundárias ou terciárias. Botões alinhados à esquerda, do mais para o menos importante; no mobile, empilhados em largura total.
- Rótulo de botão = verbo + objeto ("Adicionar à sacola", "Finalizar compra"). Nunca "OK" ou "Enviar" sozinhos.
- Evitar botões desabilitados: manter habilitado e explicar o que falta ao clicar.
- Formulários em **coluna única**, label acima do campo (4px), dica entre o label e o campo, validação no envio, erros listados no topo quando forem vários. Nunca usar placeholder como label (exceção: busca, que mantém um label oculto).
- Até ~10 opções: radio, não dropdown (exceção: ordenação da listagem). Quantidade: stepper com botões − e + horizontais de 48px. Filtros: checkbox e radio.
- Hover e press são camadas (`--color-fill-hover`, `--color-fill-press`) sobre o preenchimento, que não muda de cor.
- Espaço dentro de um grupo é sempre menor que o espaço entre grupos.
- Texto alinhado à esquerda, em sentence case (nada de Title Case nem caixa alta em títulos e botões), 40–80 caracteres por linha.

### Tokens: duas camadas

1. **Primitivos:** a paleta bruta (ex.: `--anil-700`, `--neutro-100`). Só os semânticos consomem primitivos.
2. **Semânticos:** o que a interface usa. **Componentes e páginas consomem apenas tokens semânticos.** Nunca escrever cores, tamanhos ou espaçamentos fixos no CSS dos componentes.

**Nomes idênticos entre Figma e CSS:** a variável do Figma `color/text/strong` corresponde à custom property `--color-text-strong` (barras viram hífens, com o prefixo `--`).

### Cores semânticas (light e dark desde a primeira versão)

| Grupo | Tokens |
|---|---|
| text | `strong`, `weak`, `brand`, `inverse`, `disabled` |
| stroke | `strong`, `weak`, `focus` |
| fill | `brand-strong`, `brand-weak`, `weak`, `hover`, `press`, `disabled`, `overlay` |
| background | `base`, `raised`, `sunken`, `inverse` |
| status | `error`, `warning`, `success`, `info`, cada um com `strong` e `weak` |

Exemplos: `--color-text-strong`, `--color-fill-brand-strong`, `--color-background-raised`, `--color-status-error-strong`.

- Tema: `prefers-color-scheme` define o padrão. Um botão de tema grava `data-theme="light|dark"` no `<html>`, que tem prioridade sobre a preferência do sistema.
- **Cor de marca: Anil.** Light `#2E4699` (8,56:1 sobre branco); dark `#9DB0EE` (8,67:1 sobre `#141414`). Texto sobre a marca: branco no light e `#141414` no dark. O azul foi escolhido por não se confundir com os status de erro (vermelho) e sucesso (verde).
- Neutros de base: light `#FAF9F7` (off-white quente, que remete ao algodão cru); dark `#141414`.
- Estrela de avaliação: cor própria, usada apenas nas estrelas.
- Todo par texto/fundo novo deve ter o contraste verificado e registrado em comentário no `tokens.css`.

### Tipografia

- **Inter**, apenas os pesos **400 e 600**, servida localmente (`fonts/`, woff2), com fallback `system-ui, sans-serif`.
- Escala com modos **desktop** e **mobile** (no Figma, um modo por coleção; no CSS, troca por media query). Alturas de linha sempre **múltiplas de 4**.
- Estilos usados apenas da escala, sem tamanhos intermediários. `display` no máximo uma vez por página; níveis de título sem pular.

### Espaçamento, forma e layout

- Grade de 8px. Espaçamentos: **4, 8, 16, 24, 32, 40, 48, 64, 80, 96, 128** (o 4 só para ajustes finos). Tokens `--space-4` … `--space-128`.
- Raios: **4, 8, 16, full** (`--radius-4`, `--radius-8`, `--radius-16`, `--radius-full`). Componentes maiores recebem raios maiores.
- Sombras: apenas **raised** (cards, botão primário) e **overlay** (drawer, modal, bottom sheet, menus). No dark mode, a elevação é reforçada pela cor de fundo mais clara.
- Grid: **4 colunas** (mobile), **8** (tablet), **12** (desktop).
- Alturas de controle: **32, 48 (padrão) e 56**.

### Ícones e imagens

- Ícones em **SVG inline desenhados para o projeto** (outline, grade de 24px, traço de 2px, `currentColor`), reunidos em um sprite `<symbol>` no próprio HTML. A fonte da verdade é `design-system/icones.svg`; o mesmo desenho está nos componentes `ícone/*` do Figma. Nada de bibliotecas externas. Botão só com ícone exige nome acessível.
- Imagens de produto: **ilustrações SVG próprias** da camiseta (silhuetas por modelagem, coloridas por variação de cor), para não depender de fotos de terceiros. Nunca usar imagens, textos ou marcas das referências.

### Inventário (só o que o e-commerce usa)

- **Fundamentos:** cores, tipografia, espaçamento, raios, sombras, grid, ícones.
- **Átomos:** ícone, botão (primary/secondary/tertiary × tamanhos 32/48/56 × estados default/hover/press/focus/disabled), link, input, checkbox, radio, badge, tag, divisor, estrela.
- **Moléculas:** campo de formulário, busca, stepper, preço, rating, seletor de variação (cor/tamanho), breadcrumb, paginação, alerta, toast.
- **Organismos:** header, footer, card de produto, galeria, filtros, item da sacola, resumo do pedido, drawer da sacola, etapas do checkout, modal, bottom nav e bottom sheet (app).
- **Templates/páginas:** home, categoria, produto, sacola, checkout (site); telas equivalentes no app.

Não crie componentes fora deste inventário sem aprovação.

### Figma

- Arquivo: **Tramma — Design System** — https://www.figma.com/design/EHwsPG0mKqBczxQ6r0rtbU (equipe "Experimental"). Criado e editado via MCP.
- Páginas: **Capa, Fundamentos, Átomos, Moléculas, Organismos, Templates**.
- Coleções de variáveis: **Primitivos** (modo Valor, ocultas dos seletores); **Cores** (Light/Dark, aliases dos primitivos); **Tipografia** (Desktop/Mobile); **Espaçamento**; **Forma** (raios, bordas, tamanhos de controle e ícone); **Layout** (Mobile/Tablet/Desktop); **Movimento**. Toda variável tem escopo definido e code syntax WEB `var(--nome)`.
- Text styles (`display`, `heading-1`…`heading-3`, `body-lg`, `body/regular`, `body/semibold`, `small/regular`, `small/semibold`) ligados às variáveis de Tipografia. Effect styles: `shadow/raised` e `shadow/overlay`.
- Componentes com variantes e propriedades nomeadas de forma consistente com as classes CSS. Visual sempre ligado a variáveis, nunca a valores fixos.
- **Nomenclatura de componentes em português**, igual no Figma e no CSS (BEM): componente `Botão primário` ↔ `.botao.botao--primario`; propriedades `Tamanho=P|M|G` (32/48/56) ↔ `.botao--p|m|g`; `Estado=padrão|hover|pressionado|foco|desabilitado` (no CSS viram `:hover`, `:active`, `:focus-visible`, `:disabled`). Tokens seguem em inglês (`strong/weak`), como decidido.
- Átomos no Figma (página Átomos): Ícone (22 componentes `ícone/nome`), Botão primário/secundário/terciário (3 × 15 variantes, com propriedades Rótulo, Mostrar ícone e Ícone por instance swap), Link, Input, Checkbox, Radio, Badge (tons marca, neutro, sucesso, aviso, erro, info), Tag, Divisor e Estrela (cheia, meia, vazia).
- Moléculas (página Moléculas): Campo de formulário (padrão/erro), Busca, Stepper, Preço (normal/promoção), Rating, Seletor de cor, Seletor de tamanho, Breadcrumb, Paginação, Alerta (4 tons), Toast.
- Organismos (página Organismos): Header (desktop/mobile), Footer, Card de produto, Galeria, Filtros, Item da sacola, Resumo do pedido, Drawer da sacola, Etapas do checkout, Modal, Bottom nav, Bottom sheet. Versão básica: ajustes finos virão depois.
- Ilustração de produto: `design-system/camiseta.svg` (silhueta própria; a cor muda por variação).
- Uso dos badges na loja: Novo = marca; Mais vendido e Esgotado = neutro; Promoção = sucesso; Últimas unidades = aviso.

## Marca

- **Nome:** Tramma (de "trama", o entrelaçado dos fios do tecido). Marca fictícia, sem fins comerciais.
- **Posicionamento:** camiseta básica premium, com foco em tecido, caimento e durabilidade.
- **Tom de voz:** direto, cuidadoso e técnico sem jargão. A marca trata o cliente por "você", fala de tecido e caimento com precisão e sem exagero. Frases curtas, números em algarismos.
- **Vocabulário fixo:** "sacola" (nunca "carrinho" nem "bolsa" na interface), "Adicionar à sacola", "Finalizar compra", "Frete", "Modelagem", "Gramatura".
- Microcopy de exemplo: "Restam 2 no tamanho M"; "Informe um CEP com 8 números".

### Catálogo inicial (especificações fictícias)

| Produto | Modelagem / tecido | Preço |
|---|---|---|
| Essencial Gola Careca | Regular, algodão penteado 180 g/m² | R$ 99 |
| Essencial Gola V | Regular, 180 g/m² | R$ 99 |
| Essencial Slim | Ajustada, 180 g/m² | R$ 109 |
| Essencial com Bolso | Regular, 180 g/m² | R$ 109 |
| Pesada Oversized | Ampla, 240 g/m² | R$ 139 |
| Pesada Gola Alta | Regular, 240 g/m² | R$ 139 |
| Henley | Regular com botões, 200 g/m² | R$ 139 |
| Manga Longa Essencial | Regular, 180 g/m² | R$ 129 |
| Pima | Algodão pima, toque extra macio | R$ 179 |
| Kit 3 Essenciais | 3 peças Gola Careca | R$ 269 (de R$ 297) |

- **Tamanhos:** PP, P, M, G, GG, XGG. Alguns esgotados de propósito, para demonstrar o estado indisponível.
- **Cores** (cada produto usa de 3 a 6): branco-cru, preto, cinza-mescla, marinho, oliva, areia, terracota.
- **Categorias:** Essenciais, Pesadas, Manga longa, Kits. **Badges:** Novo, Mais vendido, Promoção.
- A página de produto destaca composição, gramatura, modelagem, cuidados de lavagem, tabela de medidas e medidas do modelo.

## Referências (só inspiração)

Use apenas como inspiração de estrutura, navegação e padrões. **Nunca copie visual, textos, marca ou imagens.**

- **Aurum Fashion** (themes.laborator.co/aurum/fashion): header com logo, categorias, busca e sacola com contador; home com hero, blocos de categoria, vitrines e faixa promocional; listagem com ordenação, contagem e paginação numerada; produto com breadcrumb, galeria com miniaturas, bloco de compra, informações em seções, avaliações e relacionados.
- **Hering Super Cotton:** referência de produto (básico premium com página própria) e dos atributos e filtros (tamanho, cor, modelagem, preço).
- **Monograme** (loja brasileira de camisetas, c. 2012, via Wayback Machine): análise pendente, porque o acesso a web.archive.org está bloqueado neste ambiente.

## Publicação

- Repositório público: https://github.com/andreiomega/tramma (branch `main`).
- GitHub Pages, publicando a branch `main` na raiz: https://andreiomega.github.io/tramma/ (site em `/site/`, app em `/app/`).
- Para atualizar: faça o commit e depois `git push`. O Pages republica sozinho em 1 ou 2 minutos.
- Este repositório usa `http.sslBackend=schannel` (config local), por causa do erro de certificado SSL do Git neste computador.
