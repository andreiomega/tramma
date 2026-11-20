# Mapeamento — Home (I1)

Passo 1 do processo da página. Lista o que a home usa: seções, estados, componentes, tokens e arquivos. Ainda não há código.

Referências: I1 e elementos fixos do `inventario.md`, Trendify T16 (mobile e app) e Aurum (desktop).

---

## 1. Seções da home

A ordem é a mesma nas três versões. Só muda a moldura e a distribuição na largura.

| # | Seção | Origem | Web mobile | Web desktop | App |
|---|---|---|---|---|---|
| 0 | Link "Pular para o conteúdo" | regra | ● | ● | ● |
| 1 | Faixa de aviso (frete grátis), com botão fechar | elementos fixos | ● | ● | — |
| 2 | Cabeçalho: menu, logo, busca, favoritos, sacola com contador | elementos fixos | ● compacto | ● completo, com mega menu | — |
| 2a | Barra superior do app: logo, notificações | elementos fixos | — | — | ● |
| 3 | Campo de busca | T16 | ● abaixo do cabeçalho | ● dentro do cabeçalho | ● abaixo da barra |
| 4 | Saudação ("Olá, Ana") | I1 `logged` | ● só `logged` | ● só `logged` | ● só `logged` |
| 5 | Slider principal: 3 slides, cada um com título, frase e 1 botão | T16 banner · A slider | ● | ● | ● |
| 6 | Atalhos de categoria | T16 | ● rolagem horizontal | ● em linha | ● rolagem horizontal |
| 7 | Novidades: 4 a 8 cards de produto | T16 · A carrossel em alta | ● rolagem horizontal | ● grade de 4 colunas | ● rolagem horizontal |
| 8 | Bloco "Ficha técnica": imagem do tecido, gramatura e composição, link | A banner de texto · direção A | ● | ● imagem e texto lado a lado | ● |
| 9 | Mais vendidos: cards de produto | A | ● | ● | ● |
| 10 | Recomendados para você | T16 · I1 `logged` | ● só `logged` | ● só `logged` | ● só `logged` |
| 11 | Vistos recentemente | novo | ● só se houver | ● só se houver | ● só se houver |
| 12 | Newsletter | rodapé | ● | ● | — |
| 13 | Rodapé: links, redes, formas de pagamento | elementos fixos | ● em sanfona | ● em colunas | — |
| 14 | Bottom nav | elementos fixos | — | — | ● |
| 15 | Consentimento de cookies (E4), na 1ª visita | E4 | ● | ● | ● |

**Ficam de fora, e por quê:**
- **"Ofertas da semana" com contagem regressiva:** urgência artificial. As promoções aparecem nos próprios cards (selo e preço riscado).
- **Marcas e listas curtas do Aurum:** a Tramma tem uma marca só, e as listas curtas repetiriam os cards.
- **Mini-sacola:** nasce na página de produto, onde se adiciona à sacola. Na home, o ícone da sacola leva à página da sacola.

## 2. Estados da home

| Estado | O que aparece |
|---|---|
| `loading` | Esqueleto (skeleton) do banner, dos atalhos e dos cards. A espera é simulada. |
| carregada | Todas as seções com dados |
| `error-load` | Aviso com ícone, texto e o botão "Tentar de novo" no lugar das seções de produto. Cabeçalho e rodapé continuam. |
| `offline` (só app) | Aviso de conexão no topo. Volta sozinho quando a conexão retorna. |
| `guest` | Sem saudação e sem recomendados |
| `logged` | Saudação com o nome e recomendados |
| vistos recentemente | Com itens: a seção aparece. Sem itens: a seção não aparece. |
| 1ª visita | Aviso de cookies até a pessoa escolher. A escolha fica no `localStorage`. |
| faixa de aviso | Visível ou fechada. Fechada continua fechada nas próximas visitas. |
| favoritar no card | `guest`: leva ao login. `logged`: marca e mostra toast com "Desfazer" (`undo`). |
| newsletter | `empty` · `error-empty` · `error-invalid` · `submitting` · `success` · já inscrito |
| slider | Passa sozinho a cada 6 s · pausado pelo botão, pelo mouse em cima ou pelo foco do teclado · parado com `prefers-reduced-motion` |

**Slider acessível** (padrão Carousel do WAI-ARIA Authoring Practices):
- botão de pausar e retomar, sempre visível, o primeiro controle do slider;
- botões "anterior" e "próximo", e indicadores que dizem "slide 2 de 3";
- funciona pelo teclado, e o arraste com o dedo é só um atalho;
- o leitor de tela anuncia a troca de slide só quando ela é feita pela pessoa, não na troca automática;
- os slides fora de vista ficam fora da ordem de tabulação.

**Card de produto, nos estados que a home mostra:**
- normal;
- em promoção (preço riscado e selo);
- novo;
- mais vendido;
- últimas unidades;
- esgotado;
- favoritado ou não;
- com nota ou sem avaliações;
- com parcelamento;
- nome longo.

## 3. Componentes

Nomes do shadcn/ui quando ele tem o componente; senão, um nome no mesmo padrão. O mesmo nome vale no CSS e no Figma.

| Componente | shadcn | Usado em | Variantes e estados | Nasce em |
|---|---|---|---|---|
| `button` | Button | banner, newsletter, cookies, erro, ícones do cabeçalho | variant: `default`, `secondary`, `outline`, `ghost`, `link` · size: `default`, `icon` · `submitting` | web mobile |
| `input` + `label` | Input, Label | busca, newsletter | `empty`, `filled`, `error-invalid`, foco | web mobile |
| `badge` | Badge | selos do card | promoção, novo, mais vendido, últimas unidades, esgotado | web mobile |
| `product-card` | (Card) | novidades, mais vendidos, recomendados, vistos | os estados da seção 2 | web mobile |
| `price` | — | card | normal, promoção, parcelamento | web mobile |
| `rating` | — | card | com nota, sem avaliações | web mobile |
| `carousel` | Carousel | slider principal | slide atual · `playing`, `paused` | web mobile |
| `skeleton` | Skeleton | `loading` | — | web mobile |
| `alert` | Alert | `error-load` | `destructive` | web mobile |
| `toast` | Sonner | favoritar | sucesso, erro, com ação | web mobile |
| `sheet` | Sheet | menu mobile do site | aberto, fechado · `guest`, `logged` | web mobile |
| `accordion` | Accordion | rodapé no mobile | aberto, fechado | web mobile |
| `icon` | (Lucide) | cabeçalho, card, rodapé | tamanho 20 e 24 | web mobile |
| `announcement-bar` | — | faixa de aviso | visível, fechada | web mobile |
| `site-header` | — | cabeçalho | compacto · contador 0 ou n | web mobile; completo no desktop |
| `site-footer` | — | rodapé | sanfona no mobile, colunas no desktop | web mobile |
| `cookie-banner` | — | E4 | visível, escolhido | web mobile |
| `category-chip` | — | atalhos de categoria | normal, foco | web mobile |
| `navigation-menu` | Navigation Menu | mega menu | aberto, fechado | web desktop |
| `app-bar` | — | barra superior do app | com e sem voltar | app |
| `bottom-nav` | — | navegação do app | aba atual · contador da sacola | app |
| `offline-banner` | — | aviso de conexão | sem conexão, de volta | app |

**Padrão de nomes no código:**
- **Classe:** o nome do componente (`.button`, `.product-card`).
- **Variante e tamanho:** atributos `data-variant` e `data-size`, como as props do shadcn e as propriedades de variante do Figma.
  - Exemplo: `<button class="button" data-variant="secondary" data-size="icon">`.
- **Estado:** `data-state`, com o vocabulário da especificação, ou o atributo nativo quando ele existe (`aria-expanded`, `aria-invalid`, `aria-busy`).
- **Partes internas:** `.product-card__price`.

**No Figma:**
- O componente `Button` tem as propriedades `Variant`, `Size` e `State`, com os mesmos valores.

## 4. Tokens

Só os que a home usa. Cada um tem valor claro e escuro, e contraste verificado na etapa do código.

| Grupo | Tokens |
|---|---|
| Cor (semânticos) | `background` · `foreground` · `card` · `card-foreground` · `muted` · `muted-foreground` · `primary` · `primary-foreground` · `secondary` · `secondary-foreground` · `destructive` · `destructive-foreground` · `success` · `success-foreground` · `border` · `input` · `ring` |
| Cor (primitivos) | Escala de neutros frios, escala do cobalto, vermelho e verde, só os degraus que os semânticos usam |
| Tipografia | `font-sans` (Inter) · `font-weight-regular` (400) · `font-weight-semibold` (600) · tamanhos `text-sm` (14), `text-base` (16), `text-lg` (20), `text-xl` (24), `text-2xl` (32) · alturas de linha |
| Espaço | Grade de 8px: `space-1` (4) a `space-8` (64) |
| Raio | `radius` (4px) · `radius-full` (selos e contador) |
| Sombra | `shadow` (sheet e toast) |
| Movimento | `duration` · `ease`, zerados com `prefers-reduced-motion` |
| Camadas | `z-header` · `z-sheet` · `z-toast` |
| Layout | `container-max` (largura máxima do conteúdo) · `target-min` (48px) |
| Quebras | 768px e 1024px (em `@media`, porque CSS não aceita variável ali) |

## 5. Estrutura de pastas

```
tramma/
  index.html            entrada: links para site/ e app/
  site/
    index.html          a home do site
    css/
      tokens.css        primitivos e semânticos, claro e escuro   (compartilhado)
      base.css          reset, tipografia, foco, skip link         (compartilhado)
      components.css    um bloco comentado por componente          (compartilhado)
      home.css          layout da home no site
    js/
      data.js           catálogo, categorias, contas de demonstração (compartilhado)
      store.js          localStorage com try/catch                   (compartilhado)
      components.js     comportamento dos componentes                (compartilhado)
      home.js           montagem e estados da home
    fonts/              Inter 400 e 600 (woff2)                       (compartilhado)
    img/                fotos dos produtos                            (compartilhado)
  app/
    index.html          a home do app
    (os compartilhados, cópias idênticas)
    css/app.css         moldura do app
    js/app.js           bottom nav e aviso de conexão
```

## 6. Decisões tomadas (20/11/2026)

1. **Slider principal**, com 3 slides e as regras de acessibilidade da seção 2.
2. **Imagens:** placeholders até haver fotos.
   - É um bloco cinza-claro na proporção da foto final (4:5), com `alt` descritivo do produto.
   - Trocar pela foto depois muda só o arquivo, não o layout.
3. **Catálogo:**
   - 12 camisetas em 5 categorias: gola careca, gola V, henley, manga longa e oversized;
   - os dados ficam no `data.js` do passo 2, para revisão.
4. **Estado `logged` para revisão:**
   - parâmetro no endereço (`?estado=logged`);
   - removido quando a tela de login existir.
5. **Downloads do passo 2:**
   - fonte Inter (OFL);
   - ícones Lucide (ISC), com o aviso de licença no código.
