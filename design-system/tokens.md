# Tramma — tokens do design system

Este documento é a **fonte da verdade** dos tokens. O Figma (variáveis) e o CSS (`css/tokens.css`) são construídos a partir dele, **com os mesmos nomes**.

## Como ler este documento

Tokens são decisões de design com nome. Eles existem em **duas camadas**:

1. **Primitivos:** a matéria-prima, ou seja, a paleta de cores, sem significado de uso. Exemplo: `anil-700` é só "um azul escuro".
2. **Semânticos:** dizem **para que** uma cor serve. Exemplo: `color/text/brand` é "a cor dos links". Cada semântico aponta para um primitivo, e esse primitivo pode mudar entre light e dark.

A interface **só consome semânticos**. Assim, para trocar de tema, basta trocar o primitivo para o qual o semântico aponta, sem mexer em nenhum componente.

**Convenção de nomes:** a variável do Figma `color/text/strong` corresponde, no CSS, a `--color-text-strong` (as barras viram hífens).

**Pares strong/weak:** *strong* carrega o significado principal e atrai o olhar; *weak* apoia. Um título usa `text/strong`, e a descrição embaixo dele usa `text/weak`.

---

## 1. Cores primitivas

No Figma ficam na coleção **Primitivos** (sem modos). No CSS, as custom properties são `--neutro-50`, `--anil-700` etc.

### Neutros (cinza quente, que lembra o algodão cru)

| Token | Hex | Token | Hex |
|---|---|---|---|
| `neutro-0` | `#FFFFFF` | `neutro-500` | `#7A756C` |
| `neutro-50` | `#FAF9F7` | `neutro-600` | `#5C5850` |
| `neutro-100` | `#F2F0EC` | `neutro-700` | `#44413B` |
| `neutro-200` | `#E4E1DB` | `neutro-800` | `#2E2C29` |
| `neutro-300` | `#CBC7BF` | `neutro-900` | `#1F1E1C` |
| `neutro-400` | `#A29D94` | `neutro-950` | `#141414` |
| | | `neutro-1000` | `#0B0B0A` |

### Marca: Anil

| Token | Hex | Uso principal |
|---|---|---|
| `anil-50` | `#EEF1FB` | fundo suave da marca (light) |
| `anil-300` | `#9DB0EE` | marca no dark |
| `anil-700` | `#2E4699` | marca no light |
| `anil-900` | `#1C2440` | fundo suave da marca (dark) |

### Status

| Família | 100 (fundo light) | 300 (cor dark) | 700 (cor light) | 900 (fundo dark) |
|---|---|---|---|---|
| `vermelho` (erro) | `#FDECEA` | `#F4A39B` | `#B42318` | `#3D1512` |
| `ambar` (aviso) | `#FDF3DC` | `#E8C26B` | `#8A5A00` | `#33240A` |
| `verde` (sucesso) | `#E6F4EA` | `#8FD3A3` | `#1E7A3C` | `#12301B` |
| `petroleo` (informação) | `#E2F4F6` | `#7FD0DA` | `#0E6E7A` | `#0F2E33` |

Usamos petróleo, e não azul, para a informação, para não se confundir com o azul da marca.

### Estrela de avaliação

| Token | Hex |
|---|---|
| `ouro-500` | `#B7791F` (light) |
| `ouro-300` | `#F5C451` (dark) |

### Transparências

O Figma não deixa um alias mudar a opacidade de outra cor, então as camadas translúcidas viram primitivos próprios:

| Token | Valor | Uso |
|---|---|---|
| `alfa-escuro-06` | `rgba(20, 20, 20, 0.06)` | hover (light) |
| `alfa-escuro-12` | `rgba(20, 20, 20, 0.12)` | press (light) |
| `alfa-escuro-50` | `rgba(20, 20, 20, 0.50)` | overlay (light) |
| `alfa-claro-08` | `rgba(255, 255, 255, 0.08)` | hover (dark) |
| `alfa-claro-16` | `rgba(255, 255, 255, 0.16)` | press (dark) |
| `alfa-preto-64` | `rgba(0, 0, 0, 0.64)` | overlay (dark) |

---

## 2. Cores semânticas

No Figma ficam na coleção **Cores**, com os modos **Light** e **Dark**. Os números entre parênteses são o contraste WCAG 2.1 contra os fundos indicados, calculado para cada par.

### Fundos (background)

Os fundos vão do mais baixo ao mais alto: `sunken` < `base` < `raised`.

| Token | Light | Dark | Uso |
|---|---|---|---|
| `color/background/base` | `neutro-50` | `neutro-950` | fundo da página |
| `color/background/raised` | `neutro-0` | `neutro-900` | cards, header, drawer, modal |
| `color/background/sunken` | `neutro-100` | `neutro-1000` | áreas rebaixadas: faixas, rodapé, trilhos |
| `color/background/inverse` | `neutro-900` | `neutro-100` | faixas de destaque e toast |

No dark mode, a sombra quase não aparece. Por isso, quanto mais alto o elemento, mais claro o fundo (`raised` é mais claro que `base`).

### Texto (text)

| Token | Light | Dark | Contraste |
|---|---|---|---|
| `color/text/strong` | `neutro-900` | `neutro-100` | L ≥ 14,63 · D ≥ 14,63 |
| `color/text/weak` | `neutro-600` | `neutro-400` | L ≥ 6,22 · D ≥ 6,18 |
| `color/text/brand` | `anil-700` | `anil-300` | L ≥ 7,52 · D ≥ 7,18 |
| `color/text/inverse` | `neutro-0` | `neutro-950` | sobre a marca: L 8,56 · D 8,67; sobre o inverse: L 16,66 · D 16,19 |
| `color/text/disabled` | `neutro-400` | `neutro-600` | isento (WCAG 1.4.3); nunca para conteúdo legível |

`text/brand` é exclusivo de links e de botões terciários. Títulos e textos comuns nunca usam a cor da marca.

### Bordas (stroke)

| Token | Light | Dark | Contraste (mínimo 3:1) |
|---|---|---|---|
| `color/stroke/strong` | `neutro-500` | `neutro-500` | L ≥ 4,02 · D ≥ 3,64 |
| `color/stroke/weak` | `neutro-200` | `neutro-800` | decorativo (divisores) |
| `color/stroke/focus` | `anil-700` | `anil-300` | L ≥ 8,14 · D ≥ 7,84 |

- `stroke/strong` serve para bordas que identificam um controle (input, checkbox, botão secundário).
- `stroke/weak` serve só para separar conteúdo.

### Preenchimentos (fill)

| Token | Light | Dark | Uso |
|---|---|---|---|
| `color/fill/brand-strong` | `anil-700` | `anil-300` | botão primário, item selecionado |
| `color/fill/brand-weak` | `anil-50` | `anil-900` | fundo de seleção suave, badge "Novo" |
| `color/fill/weak` | `neutro-100` | `neutro-800` | tags, chips, contêineres sutis |
| `color/fill/hover` | `alfa-escuro-06` | `alfa-claro-08` | camada sobre o preenchimento no hover |
| `color/fill/press` | `alfa-escuro-12` | `alfa-claro-16` | camada sobre o preenchimento ao pressionar |
| `color/fill/disabled` | `neutro-200` | `neutro-800` | controles desabilitados |
| `color/fill/overlay` | `alfa-escuro-50` | `alfa-preto-64` | escurece a página atrás de modal, drawer e bottom sheet |

`hover` e `press` são **camadas**: a cor do botão nunca muda, só recebe um véu por cima. Assim, um único token serve para todos os botões.

### Status

| Token | Light | Dark | Contraste do strong (sobre base, raised e weak) |
|---|---|---|---|
| `color/status/error-strong` | `vermelho-700` | `vermelho-300` | L ≥ 5,75 · D ≥ 8,03 |
| `color/status/error-weak` | `vermelho-100` | `vermelho-900` | |
| `color/status/warning-strong` | `ambar-700` | `ambar-300` | L ≥ 5,37 · D ≥ 8,84 |
| `color/status/warning-weak` | `ambar-100` | `ambar-900` | |
| `color/status/success-strong` | `verde-700` | `verde-300` | L ≥ 4,74 · D ≥ 8,20 |
| `color/status/success-weak` | `verde-100` | `verde-900` | |
| `color/status/info-strong` | `petroleo-700` | `petroleo-300` | L ≥ 5,24 · D ≥ 8,18 |
| `color/status/info-weak` | `petroleo-100` | `petroleo-900` | |

- `strong` vai no texto, no ícone e na borda do status.
- `weak` vai no fundo do alerta.
- Status nunca usa só a cor: sempre aparece com um ícone e uma palavra.

### Avaliação

| Token | Light | Dark | Contraste (mínimo 3:1, gráfico) |
|---|---|---|---|
| `color/rating/star` | `ouro-500` | `ouro-300` | L ≥ 3,46 · D ≥ 10,23 |

A nota também aparece em texto ("4,8 de 5"), então a estrela nunca é a única informação.

---

## 3. Tipografia

Coleção **Tipografia** no Figma, com os modos **Desktop** e **Mobile**. O tablet usa os valores de desktop.

- **Família:** `font/family/base` = Inter, com fallback `system-ui, sans-serif`.
- **Pesos:** `font/weight/regular` = 400 e `font/weight/semibold` = 600. Não há outros.
- Todas as alturas de linha são múltiplas de 4.

| Estilo | Desktop (tamanho / altura de linha) | Mobile | Peso | Espaçamento entre letras | Uso |
|---|---|---|---|---|---|
| `display` | 48 / 56 | 36 / 44 | 600 | −0,5px | título do hero; no máximo 1 por página |
| `heading-1` | 36 / 44 | 28 / 36 | 600 | −0,25px | título da página |
| `heading-2` | 28 / 36 | 24 / 32 | 600 | 0 | título de seção |
| `heading-3` | 20 / 28 | 20 / 28 | 600 | 0 | subseção, nome do produto no card |
| `body-lg` | 18 / 28 | 18 / 28 | 400 | 0 | descrição do produto, apoio do hero |
| `body` | 16 / 24 | 16 / 24 | 400 ou 600 | 0 | texto de interface, labels, botões |
| `small` | 14 / 20 | 14 / 20 | 400 ou 600 | 0 | dicas, metadados, badges |

- **Figma:** as variáveis são `font/size/display`, `font/line-height/display`, `font/letter-spacing/display` etc. Os Text Styles têm os mesmos nomes (`display`, `heading-1`, … `body/semibold`, `small/semibold`).
- **CSS:** as custom properties são `--font-size-display`, `--font-line-height-display` etc. Os valores de mobile são o padrão, e os de desktop entram por `@media (min-width: 600px)`.
- Um estilo pode ser usado pelo tamanho, sem a função semântica correspondente. Por exemplo, o preço na página de produto usa `heading-2` visualmente, sem ser um título no HTML.

---

## 4. Espaçamento

Coleção **Espaçamento** no Figma. A grade é de 8px; o 4 serve só para ajustes finos.

| Token | Valor | Token | Valor |
|---|---|---|---|
| `space/4` | 4 | `space/48` | 48 |
| `space/8` | 8 | `space/64` | 64 |
| `space/16` | 16 | `space/80` | 80 |
| `space/24` | 24 | `space/96` | 96 |
| `space/32` | 32 | `space/128` | 128 |
| `space/40` | 40 | | |

No CSS, `--space-16` e assim por diante. Regra de ouro: **o espaço dentro de um grupo é menor que o espaço entre grupos**.

## 5. Raios

| Token | Valor | Uso |
|---|---|---|
| `radius/4` | 4 | checkbox, badge, tag pequena |
| `radius/8` | 8 | botão, input, alerta, toast |
| `radius/16` | 16 | card, modal, drawer, bottom sheet (cantos superiores) |
| `radius/full` | 9999 | radio, swatch de cor, contador da sacola, chip |

Componentes maiores recebem raios maiores.

## 6. Bordas e tamanhos

| Token | Valor | Uso |
|---|---|---|
| `border/width/1` | 1 | bordas padrão |
| `border/width/2` | 2 | campo com erro, item selecionado, anel de foco |
| `size/control/sm` | 32 | botão pequeno, tag |
| `size/control/md` | 48 | padrão: botão, input, stepper |
| `size/control/lg` | 56 | botão de compra, bottom nav |
| `size/icon/sm` | 16 | ícone em controle de 32 |
| `size/icon/md` | 20 | ícone em controle de 48 |
| `size/icon/lg` | 24 | ícone em controle de 56 e ícones soltos |

O foco usa um anel de `border/width/2` em `color/stroke/focus`, com 2px de afastamento.

## 7. Sombras

Coleção **Efeitos** no Figma (Effect Styles), com os mesmos nomes.

| Token | Light | Dark | Uso |
|---|---|---|---|
| `shadow/raised` | `0 1px 2px rgba(20,20,20,.06), 0 2px 8px rgba(20,20,20,.08)` | `0 1px 2px rgba(0,0,0,.40), 0 2px 8px rgba(0,0,0,.40)` | card, botão primário, header fixo |
| `shadow/overlay` | `0 8px 16px rgba(20,20,20,.10), 0 24px 48px rgba(20,20,20,.16)` | `0 8px 16px rgba(0,0,0,.50), 0 24px 48px rgba(0,0,0,.60)` | drawer, modal, bottom sheet, toast |

Sempre aplique **sombra e fundo juntos**: `raised` com `background/raised`. Assim, a elevação funciona nos dois temas.

## 8. Grid e layout

Coleção **Layout** no Figma, com os modos **Mobile**, **Tablet** e **Desktop**. No Figma também há Layout Guides com os mesmos valores.

| Token | Mobile (< 600) | Tablet (600–1023) | Desktop (≥ 1024) |
|---|---|---|---|
| `layout/columns` | 4 | 8 | 12 |
| `layout/gutter` | 16 | 24 | 24 |
| `layout/margin` | 16 | 32 | 40 |
| `layout/max-width` | — | — | 1280 (conteúdo centralizado) |

Os breakpoints `600px` e `1024px` aparecem direto nas media queries, porque custom properties não funcionam dentro de `@media`.

## 9. Movimento

Usado sobretudo no app (telas, drawer, bottom sheet).

| Token | Valor | Uso |
|---|---|---|
| `motion/duration/fast` | 150ms | hover, press, foco |
| `motion/duration/base` | 250ms | drawer, bottom sheet, troca de tela |
| `motion/easing/standard` | `cubic-bezier(0.2, 0, 0, 1)` | entradas e saídas |

Com `prefers-reduced-motion: reduce`, as durações vão a `0ms`.
