# Mapeamento — Idioma: português e inglês

Passo 1 do item 1 da dívida técnica (`divida-tecnica.md`). Ainda não há código.

**Por quê:** o mesmo projeto vai ser usado em aulas em português e em inglês (Unistra, CAWEB). A pessoa escolhe o idioma, e a loja inteira acompanha: textos, rótulos para leitor de tela, `alt` das fotos e mensagens.

**Escopo agora:** só a home, no site e no app. As próximas páginas já nascem nos dois idiomas.

---

## 1. Onde está o texto hoje

São cerca de 260 textos, em quatro lugares:

| Lugar | O que tem | Quantidade aproximada |
|---|---|---|
| `index.html` (site e app) | textos fixos, `aria-label`, `placeholder`, `alt`, `<title>` e descrição | 100 |
| `data.js` | nomes e descrições de produtos e categorias, slides, benefícios, campanha, galeria, FAQ, `alt` das fotos | 95 |
| `components.js` | toasts, erros da newsletter, parcelamento, rótulos do slider e do contador | 35 |
| `home.js` e `app.js` | "Carregando produtos…", "Ver todos", aviso de conexão | 35 |

## 2. Como os textos se organizam

Duas regras, uma para cada tipo de texto:

1. **Texto da interface** (botões, rótulos, mensagens): fica num arquivo novo, `js/i18n.js`, com um dicionário por idioma e chaves com nome.

   ```js
   TRAMMA.i18n = {
     pt: { "bag.add": "Adicionar à sacola", "newsletter.error.empty": "Digite seu e-mail." },
     en: { "bag.add": "Add to bag",         "newsletter.error.empty": "Enter your email." }
   };
   ```

   O JS pede o texto pela chave: `TRAMMA.t("bag.add")`.

2. **Conteúdo** (nome de produto, slide, FAQ, `alt`): continua no `data.js`, junto do dado a que pertence, com os dois idiomas lado a lado.

   ```js
   { id: "essencial-careca", name: { pt: "Camiseta Essencial", en: "Essential Tee" }, ... }
   ```

   **Por quê:** quem edita um produto vê as duas versões juntas e não esquece de traduzir uma delas.

**No HTML:** o texto fixo continua escrito em português, e o elemento ganha a chave.

```html
<button data-i18n="cookies.accept">Aceitar todos</button>
<input data-i18n-attr="placeholder:search.placeholder" placeholder="Buscar camisetas">
```

Ao abrir em inglês, o JS troca o texto pelo da chave. O português escrito no HTML serve de padrão e de referência para quem lê o código.

**O que não muda:**
- os ids, as classes e os nomes de arquivo;
- os parâmetros de revisão (`?estado=logged`).

## 3. Como a escolha funciona

- **Quem decide o idioma, nesta ordem:**
  1. `?lang=en` no endereço. Serve para mandar o link certo para a turma.
  2. A escolha salva no `localStorage`.
  3. O padrão, português. A loja é brasileira.
- **Ao trocar:**
  - a escolha é salva e a página recarrega no novo idioma;
  - recarregar é mais simples e mais confiável que retraduzir a página aberta;
  - o seletor recebe o foco de volta, para quem usa teclado não perder o lugar.
- **`<html lang>`** acompanha o idioma (`pt-BR` ou `en`). Ele faz o leitor de tela pronunciar no idioma certo, e é exigência do WCAG (3.1.1).
- **`<title>` e a descrição** da página também são traduzidos.

## 4. Seletor de idioma (componente novo: `language-switcher`)

O shadcn não tem um componente próprio para isso; a anatomia mais próxima é o Toggle Group.

- **Forma:** dois links lado a lado, "PT" e "EN".
  - Cada um é um link de verdade (`?lang=en`), e funciona até sem JS.
  - O idioma atual tem `aria-current="true"` e se distingue por peso e sublinhado, não só por cor.
- **Acessibilidade:**
  - o leitor de tela ouve o nome completo, no próprio idioma ("Português", "English"), com `lang` em cada link;
  - o grupo tem o rótulo "Idioma" / "Language";
  - cada link tem alvo de 48 × 48 px.
- **Sem bandeiras:** bandeira representa país, não idioma. O inglês não é de um país só, e o português também não.
- **Onde fica:**
  - **site:** à direita da faixa de aviso, em todas as larguras. A faixa perde o "X" de fechar (item 2 da dívida técnica) e o estado "fechada";
  - **app:** na barra superior, ao lado das notificações. Quando a tela Conta existir, ele vai para lá, onde fica a maioria dos apps.

## 5. O que muda em cada idioma

- **Moeda:** o idioma traz a moeda junto.
  - português: real, no formato R$ 149,00;
  - inglês: dólar, no formato $29.80.
  - **Conversão:** câmbio fixo e didático, R$ 5 = US$ 1, sem cotação do dia. O preço continua guardado em reais no `data.js`, e a conversão acontece só na hora de mostrar.
  - As regras em dinheiro convertem junto: frete grátis acima de R$ 299 ($59.80) e parcela mínima de R$ 30 ($6.00).
- **Parcelamento:** o número de parcelas é calculado em reais, e só o valor exibido é convertido.
  - português: "ou 4x de R$ 37,25 sem juros";
  - inglês: "or 4 interest-free payments of $7.45".
- **Vocabulário fixo em inglês**, para entrar no `CLAUDE.md`:

  | Português | Inglês |
  |---|---|
  | sacola | bag |
  | Adicionar à sacola | Add to bag |
  | Finalizar compra | Checkout |
  | Frete | Shipping |
  | Modelagem | Fit |
  | Gramatura | Fabric weight (g/m²) |

- **Tom de voz em inglês:** o mesmo da marca. Direto, frases curtas, "you", números em algarismos.
- **Os textos em inglês** são escritos por mim e revisados por você antes do commit.

## 6. Arquivos

| Arquivo | Mudança |
|---|---|
| `js/i18n.js` (novo, compartilhado) | dicionários `pt` e `en`, escolha do idioma, `TRAMMA.t()` e tradução do HTML marcado |
| `js/data.js` | campos de texto passam a ter `pt` e `en` |
| `js/components.js` | textos pela chave; `money()` segue o idioma; novo `initLanguageSwitcher`; sai o fechar da faixa |
| `js/home.js`, `js/app.js` | textos pela chave |
| `css/components.css` | bloco `language-switcher`; a faixa de aviso perde o botão |
| `site/index.html`, `app/index.html` | marcação `data-i18n` e o seletor |
| `inventario.md` | requisito novo: idioma (decisão 15); o app ganha o seletor nos elementos fixos |
| `mapeamento/home.md` | a faixa de aviso sem "fechada"; o seletor no site e no app |
| `CLAUDE.md` | vocabulário em inglês; `lang` conforme o idioma (hoje diz só `pt-BR`) |

Ordem do `<script>`: `data.js` → `store.js` → `i18n.js` (precisa do `store` para lembrar a escolha) → `components.js` → página.

## 7. Decisões tomadas (20/11/2026)

1. **Idioma padrão:** português. O inglês vem pelo seletor ou pelo link com `?lang=en`.
2. **Moeda:** muda com o idioma. Real em português (R$ 149,00) e dólar em inglês ($29.80), com câmbio fixo de R$ 5 = US$ 1.
3. **Nomes dos produtos:** traduzidos. As linhas Essencial, Pesada e Leve viram Essential, Heavy e Light.
