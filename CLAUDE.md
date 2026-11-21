# Tramma — instruções do projeto (v2)

Projeto didático: e-commerce fictício de camisetas premium chamado **Tramma**, com versão web responsiva e versão app. Ele é usado em aulas de UI, design system, design responsivo, design de apps, design de interação e acessibilidade. O código e o histórico de commits são lidos por alunos.

A v1 está guardada na tag `v1`. A v2 recomeçou do zero em 20/11/2026, para seguir referências concretas de layout e construir o design system conforme as páginas precisam dele.

## Como trabalhar

- Responda sempre em **português**, com tom formal e direto.
- **Uma etapa por vez.** Ao fim de cada etapa, mostre o resultado e **pare até receber o ok** do professor. Não encadeie a etapa seguinte por conta própria.
- Um commit por etapa aprovada, com mensagem em português no formato `etapa: descrição` (ex.: `home: web mobile`). O histórico é material de aula: commits pequenos, coerentes e legíveis.
- Na dúvida, pergunte antes de decidir.

### Processo de cada página

Cada passo só começa depois que o anterior foi aprovado:

1. **Mapeamento:** seções da página, componentes do design system e tokens necessários. Só o que a página usa.
2. **Web mobile:** código dos tokens e componentes novos, e a página montada.
3. **Web desktop:** a mesma página expandida, com o mesmo código.
4. **App:** o mesmo miolo dentro da moldura do app (barra superior fixa e bottom nav). Componentes exclusivos do app (bottom nav, splash, bottom sheet) nascem aqui.
5. **Figma:** tokens e componentes já validados no código, com os mesmos nomes.

O código vem antes do Figma, para não gastar esforço desenhando o que depois seria refeito ou descartado.

## Escopo

- **`inventario.md` é a especificação de requisitos.** Ela define as telas, os estados de cada tela (caminho feliz, erros e alternativas) e as decisões já tomadas. Nada entra ou sai do escopo sem passar por ela.
- Tudo funciona **só no front-end, com dados estáticos**. Esperas de rede, código por e-mail, pagamento e avanço de pedido são simulados.
- **Vocabulário de estados:** os nomes da especificação (`empty`, `filled`, `error-empty`, `error-invalid`, `error-rule`, `error-summary`, `submitting`, `success`, `failure`, `loading`, `one`, `many`, `error-load`, `guest`, `logged`, `session-expired`, `offline`, `confirm`, `undo`, `permission`) são usados iguais no código e no Figma.

## Referências e o papel de cada uma

| Referência | Papel |
|---|---|
| **Trendify** (Figma Community) | Layout e fluxos das telas no celular (web mobile e app) |
| **Aurum** (themes.laborator.co/aurum/fashion) | Layout das páginas no desktop |
| **Practical UI** (DESIGN.md) | Regras de qualidade: toda tela passa por elas |
| **shadcn/ui** (licença MIT) | Biblioteca primária: anatomia, variantes, estados e nomes de componentes e tokens |

- **Trendify e Aurum:** só estrutura e fluxo. **Nunca copie visual, textos, marca ou imagens.**
- **shadcn/ui** é feito em React com Tailwind. Usamos a anatomia e os nomes, reescritos em HTML e CSS puros. A aparência vem dos tokens da Tramma.
- **DESIGN.md (Practical UI, de Adham Dannaway)** é licenciado para uso do professor e **não pode ser redistribuído**. Ele fica fora do repositório (está no `.gitignore`). Use só os princípios, com palavras nossas, sem copiar trechos.
- **Quando o shadcn e o Practical UI divergem, vale a nossa regra:**
  - alvos de toque de 48px;
  - evitar botão desabilitado;
  - nunca usar placeholder como label (exceto na busca).

## Regras técnicas (inegociáveis)

- **HTML, CSS e JavaScript 100% vanilla.** Sem frameworks, bibliotecas, pré-processadores, build, npm ou qualquer dependência.
- **JavaScript só para manipular o DOM** e simular os dados. Sem `fetch`, sem `import`/`export`, sem nada que exija servidor.
- **Tudo abre com dois cliques no `index.html`** (protocolo `file://`). Caminhos relativos em todos os links, scripts, imagens e fontes.
- **Dados fixos** (catálogo, cupons, FAQ, avaliações iniciais, CEPs, contas de demonstração) ficam em objetos JS, carregados por `<script>` comum.
- **Persistência:** o `localStorage` guarda o que a pessoa cria ou altera (conta, sessão, sacola, favoritos, pedidos, endereços, cartões, avaliações, notificações, preferências). Sempre com `try/catch`, e a página continua funcionando se ele falhar.
- **Código limpo, semântico e comentado de forma didática.** Os comentários explicam o *porquê* de cada decisão (acessibilidade, token, padrão de interação), não só o *quê*.
- **Mobile-first:** o CSS base é o mobile; telas maiores vêm em `@media (min-width: ...)`.
- `site/` e `app/` abrem sozinhas. Os arquivos compartilhados (tokens, componentes, dados) são cópias **idênticas** nas duas pastas: edite em `site/`, copie para `app/` e confira com `cmp`. A estrutura exata das pastas é definida na etapa da home.

## Acessibilidade (WCAG 2.1 AA, mínimo)

- HTML semântico primeiro. ARIA só quando o HTML nativo não resolve.
- Contraste: texto ≥ 4,5:1; texto grande ≥ 3:1; bordas de controles e ícones com significado ≥ 3:1. Todo par novo de texto e fundo tem o contraste verificado e registrado em comentário.
- **Foco sempre visível:** anel sólido de 2px com 2px de afastamento. Nunca remover o `outline` sem substituto.
- Alvos de toque de pelo menos **48×48px**, com 8px entre alvos vizinhos.
- Nada comunicado só por cor: status com ícone e texto, links em texto sublinhados, erro com borda, ícone e mensagem.
- Teclado: toda interação funciona sem mouse. Diálogos e painéis prendem o foco, fecham com `Esc` e devolvem o foco a quem os abriu.
- `prefers-reduced-motion`: transições reduzidas ou removidas.
- Imagens com `alt` descritivo (ou `alt=""` quando decorativas). `lang` no `<html>` acompanhando o idioma (`pt-BR` ou `en`). Link "Pular para o conteúdo" em cada página.

## Design system

- **Construído sob demanda.** Só existe um token ou componente quando uma página aprovada precisou dele. Não crie nada fora do mapeamento aprovado.
- **Nomes de tokens do shadcn/ui:** `background`/`foreground`, `primary`/`primary-foreground`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `radius` etc.
  - O que o shadcn não tem (status de sucesso, aviso e informação, estrela de avaliação) segue o mesmo padrão de nome.
  - O nome é igual no Figma e no CSS, onde vira custom property (`--primary-foreground`).
- Duas camadas: **primitivos** (a paleta bruta) e **semânticos** (o que a interface usa). Componentes e páginas consomem só semânticos.
- **Temas claro e escuro** desde o primeiro token. `prefers-color-scheme` define o padrão; `data-theme` no `<html>` tem prioridade.
- Grade de 8px.
- **Princípios** (do Practical UI, com palavras nossas):
  - uma cor de marca, só no que é interativo;
  - um botão primário visível por vez;
  - rótulo de botão = verbo + objeto;
  - formulários em coluna única, com label acima do campo;
  - validação no envio, com a lista de erros no topo quando forem vários;
  - espaço dentro de um grupo sempre menor que o espaço entre grupos;
  - texto alinhado à esquerda, em sentence case.
- **Direção visual: "Ficha técnica"** (escolhida em 20/11/2026). A camiseta é tratada como produto de precisão, e os dados do tecido (gramatura, composição) aparecem na interface.
  - **Tipografia:** Inter, só os pesos 400 e 600, servida localmente. Nada de outras fontes.
  - **Cores:** neutros levemente frios e uma cor de marca, azul-cobalto. Valores de partida, todos com contraste verificado:

    | Token | Claro | Escuro |
    |---|---|---|
    | `background` | `#F3F4F1` | `#111315` |
    | `foreground` | `#15171A` | `#ECEDEA` |
    | `muted-foreground` | `#5A5F66` | `#A3A8AE` |
    | `primary` | `#2340C8` | `#8FA2FF` |
    | `primary-foreground` | `#FFFFFF` | `#0B0D12` |
    | `border` | `#84898F` | `#63686F` |

  - **Cantos:** raio pequeno (4px).
  - **Fotografia:** estúdio com fundo liso cinza-claro e luz difusa; produto dobrado, pendurado e vestido, sempre no mesmo enquadramento; macros do tecido e da costura.
- **A definir nas próximas etapas:**
  - nomenclatura dos componentes no código e no Figma, no mapeamento da home;
  - catálogo de produtos.

## Figma

- O arquivo da v1 fica arquivado como "Tramma — v1 (arquivo)": https://www.figma.com/design/EHwsPG0mKqBczxQ6r0rtbU
- O arquivo da v2 só é criado quando houver tokens e componentes validados no código.

## Marca

- **Nome:** Tramma (de "trama", o entrelaçado dos fios do tecido). Marca fictícia, sem fins comerciais.
- **Posicionamento:** camiseta básica premium, com foco em tecido, caimento e durabilidade.
- **Tom de voz:** direto, cuidadoso e técnico sem jargão. Trata o cliente por "você". Frases curtas, números em algarismos.
- **Vocabulário fixo:** "sacola" (nunca "carrinho" nem "bolsa" na interface), "Adicionar à sacola", "Finalizar compra", "Frete", "Modelagem", "Gramatura".
- **Idioma:** português (padrão) e inglês, com o mesmo tom de voz. Textos da interface no `i18n.js` (dicionários `pt` e `en`); conteúdo no `data.js`, com `{ pt, en }` lado a lado. Toda tela nova nasce nos dois idiomas.
  - **Vocabulário fixo em inglês:** "bag" (sacola), "Add to bag", "Checkout", "Shipping" (frete), "Fit" (modelagem), "Fabric weight" (gramatura).
  - **Moeda:** real em português, dólar em inglês, com câmbio fixo de R$ 5 = US$ 1. Preços sempre guardados em reais.

## Publicação

- Repositório público: https://github.com/andreiomega/tramma (branch `main`).
- GitHub Pages publica a branch `main` na raiz: https://andreiomega.github.io/tramma/
- Para atualizar: commit e depois `git push`. O Pages republica em 1 ou 2 minutos.
- Este repositório usa `http.sslBackend=schannel` (config local), por causa do erro de certificado SSL do Git neste computador.
