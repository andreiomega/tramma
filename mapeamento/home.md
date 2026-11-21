# Mapeamento — Home (I1)

Passo 1 do processo da página. Lista o que a home usa: seções, estados, componentes, tokens e arquivos. Ainda não há código.

Referências: I1 e elementos fixos do `inventario.md`, Trendify T16 (mobile e app) e Aurum (desktop).

---

## 1. Seções da home

A ordem é a mesma nas três versões. Só muda a moldura e a distribuição na largura.

> Revista em 21/11/2026 a partir dos wireframes (`wireframes/home-*.html`). Decisões 16 a 23 do `inventario.md`.

| # | Seção | Origem | Web mobile | Web desktop | App |
|---|---|---|---|---|---|
| 0 | Link "Pular para o conteúdo" | regra | ● | ● | ● |
| 1 | Faixa de aviso (incentivo da newsletter) e seletor de idioma | elementos fixos | — (idioma no menu) | ● | — |
| 2 | Cabeçalho | elementos fixos | ● menu, logo, sacola | ● uma linha: logo, menu, busca (ícone), conta, favoritos, sacola | — |
| 2a | Barra superior do app: logo, notificações | elementos fixos | — | — | ● |
| 3 | Campo de busca | T16 | ● abaixo do cabeçalho | ● aberto pela lupa, no lugar da linha do cabeçalho | ● abaixo da barra |
| 4 | Saudação ("Olá, Ana") | I1 `logged` | ● só `logged` | — (o nome está no cabeçalho) | ● só `logged` |
| 5 | Slider: Coleção Essencial, Camiseta Leve, 12 cores fixas | T16 banner · A slider | ● | ● | ● |
| 6 | Faixa de benefícios (4) | Insider (estilo) · decisões 11 a 13 | ● rolagem horizontal | ● em linha | ● rolagem horizontal |
| 7 | Vitrine: curadoria por momento (5 itens), 4 cards, "Ver todos" | T16 chips · A listas | ● chips, fundo cinza | ● abas, fundo cinza | ● chips, fundo cinza |
| 8 | Categorias: 5 modelos e "Ver todas" | T16 | ● 2 colunas, fundo branco | ● 5 colunas, fundo branco | ● 2 colunas, fundo branco |
| 9 | Banner de campanha (Linha Pesada) | A banner | ● | ● | ● |
| 10 | Recomendados para você | T16 · I1 `logged` | ● só `logged`, cinza | ● só `logged`, cinza | ● só `logged`, cinza |
| 11 | Vistos recentemente | novo | ● só se houver, branco | ● só se houver, branco | ● só se houver, branco |
| 12 | Newsletter: incentivo, 3 ganhos, formulário | A rodapé · decisão 20 | ● fundo cinza | ● fundo cinza | — |
| 13 | Sobre a Tramma e perguntas frequentes | Insider | ● fundo branco | ● fundo branco | ● fundo cinza |
| 14 | Rodapé preto: marca, redes, 3 grupos de links | elementos fixos | ● em sanfona | ● em colunas | — |
| 14a | Bottom nav | elementos fixos | — | — | ● |
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
| faixa de aviso | Sempre visível. O botão fechar saiu (20/11/2026): a faixa guarda o seletor de idioma. |
| idioma | Português (padrão) ou inglês, com a moeda junto. Ver `mapeamento/idioma.md`. |
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
| `announcement-bar` | — | faixa de aviso | aviso e seletor de idioma | web mobile |
| `language-switcher` | (Toggle Group) | seletor de idioma | idioma atual, outro idioma | idioma (faixa no site, barra no app) |
| `site-header` | — | cabeçalho | compacto · uma linha no desktop · busca aberta/fechada · contador 0 ou n | web mobile; completo no desktop |
| `site-footer` | — | rodapé | fundo preto · sanfona no mobile, colunas no desktop | web mobile |
| `newsletter-band` | — | newsletter da home | os estados da newsletter · cupom na confirmação | web desktop |
| `cookie-banner` | — | E4 | visível, escolhido | web mobile |
| `tabs` (variante `chips`) | Tabs | vitrine | pílulas no celular, abas no desktop · selecionada | web mobile |
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

---

# Revisão 2 — alta fidelidade (20/11/2026)

A estrutura acima foi aprovada e está no código. Esta revisão leva a home para alta fidelidade, com a loja da Insider (insiderstore.com.br) como benchmarking. Da Insider vem só a estrutura; visual, textos e marca continuam nossos.

## 7. Layout (feito, aguardando aprovação)

- Quebras, container e gutter com os valores do Bootstrap 5. A tabela está no `tokens.css`.
- Grade de 12 colunas, a mesma do Figma: 4 colunas no celular, 8 no tablet e 12 a partir do laptop.
- Slider na largura toda da tela, com altura quase total e troca por deslize de 600 ms.

## 8. Seções da home, nova ordem

| # | Seção | Situação | Web mobile | Web desktop |
|---|---|---|---|---|
| 1 | Faixa de aviso | muda: passa a anunciar campanha (os benefícios fixos vão para a seção 6) | ● | ● |
| 2 | Cabeçalho | igual | ● | ● |
| 3 | Busca e saudação | igual | ● | ● |
| 4 | Slider com foto de pessoas vestindo as peças | muda: foto real, título maior | ● | ● |
| 5 | **Faixa de benefícios**: 3 itens com ícone, fixa (sem rolar sozinha) | nova | ● rolagem lateral | ● em linha |
| 6 | **Vitrine com abas**: Mais vendidos · Novidades · Promoções, e o botão "Ver todos" | nova; substitui as seções Novidades e Mais vendidos | ● | ● |
| 7 | **Banner de campanha** na largura toda: foto, título, 1 botão | nova | ● | ● |
| 8 | **Mosaico de categorias** com foto | nova; substitui os botões de texto | ● 2 colunas | ● 5 colunas |
| 9 | Ficha técnica | igual, com foto real do tecido | ● | ● |
| 10 | Recomendados para você (`logged`) | igual | ● | ● |
| 11 | Vistos recentemente | igual | ● | ● |
| 12 | **Na vida real**: galeria de fotos de pessoas usando as peças | nova | ● rolagem lateral | ● 6 fotos em linha |
| 13 | **Sobre a Tramma** (texto curto) e **Perguntas frequentes** em sanfona | nova | ● | ● texto e perguntas lado a lado |
| 14 | Newsletter e rodapé | igual | ● | ● |

**Não entram, por ferirem nossas regras:**
- pop-up de desconto que interrompe a navegação;
- contagem regressiva (urgência falsa);
- faixa que rola sozinha sem pausa;
- texto pequeno e claro sobre foto.

## 9. Componentes novos

| Componente | shadcn | Uso | Estados |
|---|---|---|---|
| `tabs` | Tabs | vitrine | aba ativa · foco; padrão Tabs do WAI-ARIA (setas trocam de aba) |
| `benefit-strip` | — | faixa de benefícios | — |
| `campaign-banner` | — | banner de campanha | — |
| `category-tile` | — | mosaico de categorias | normal · foco · hover |
| `color-swatch` | — | cores no card de produto | até 4 cores e "+n"; o nome da cor fica em texto escondido |
| `gallery` | — | "Na vida real" | — |

O `accordion` já existe e passa a servir também às perguntas frequentes.

## 10. Estilos de alta fidelidade

A direção "Ficha técnica" continua: Inter 400/600, neutros frios e cobalto.

- **Tipografia de vitrine:**
  - tokens novos `--text-4xl` (48px) e `--text-5xl` (64px), só para títulos de slider e de banner;
  - rótulos curtos em caixa alta com `--tracking-wide` (0,08em): abas, eyebrows e benefícios.
- **Ritmo:** tokens novos `--space-9` (80px) e `--space-10` (96px) entre as seções no desktop.
- **Card de produto:**
  - foto 4:5 em fundo de estúdio;
  - selos nos cantos;
  - amostras de cor;
  - ficha técnica;
  - preço em destaque e parcelamento abaixo.
- **Cor:**
  - fundo das seções alternando `background` e `card`, para separar blocos sem linhas;
  - promoção em `destructive`, sempre com texto.
- **Texto sobre foto:** o slider e os banners usam `data-theme="light"`. O texto fica numa área lisa da foto, ou sobre um degradê que garanta 4,5:1.

## 11. Imagens (decidido: banco gratuito)

- **Fonte:** Unsplash ou Pexels. As duas licenças permitem uso gratuito, inclusive comercial, sem pedir autorização.
- **Crédito:** um arquivo `site/img/fotos/CREDITOS.md`, com autor e link de cada foto. Não é obrigatório, mas é boa prática e material de aula.
- **Tamanho:** baixadas já redimensionadas pela própria URL do banco, com até 1600px no slider e 800px nos cards, em JPG.
- **Lista mínima (cerca de 30 fotos):**
  - slider: 3, de pessoas vestindo camiseta básica;
  - banner de campanha: 1;
  - categorias: 5, uma por modelo;
  - produtos: 12, uma por camiseta, de preferência no mesmo estilo (fundo claro);
  - ficha técnica: 1, um detalhe do tecido;
  - "Na vida real": 6.
- **Risco:** achar 12 fotos de produto coerentes entre si. Se não houver, os cards usam fotos de pessoas vestindo, com o mesmo corte 4:5.

## 12. Decisões pendentes

1. **Faixa de benefícios:** a especificação só garante 2 benefícios ("até 6x sem juros" e "primeira troca grátis"). Proposta: criar 2 regras novas e registrar na especificação:
   - frete grátis acima de R$ 299;
   - 5% de desconto no Pix.
2. **Abas da vitrine:** Mais vendidos · Novidades · Promoções. A Insider separa por gênero, mas o nosso catálogo é unissex.
3. **Seleção das fotos:** monto a lista com link, autor e tamanho de cada uma e peço sua aprovação antes de baixar.
