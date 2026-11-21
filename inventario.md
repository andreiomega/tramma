# Especificação de requisitos — Tramma v2

**Etapa 1 de 6. Aprovada em 20/11/2026 como a especificação de requisitos do projeto.**
Este inventário cruza as telas do **Trendify** (app) com as páginas do **Aurum** (web) e acrescenta o que falta nos dois para uma loja brasileira de camisetas.
Depois de aprovado, ele vira o escopo oficial do projeto e o roteiro de testes.

Fontes, levantadas em 20/11/2026:
- **Trendify:** arquivo do Figma, página "Light Theme", 87 frames. A página "Dark Theme" repete as mesmas telas.
- **Aurum:** demo `themes.laborator.co/aurum/fashion`, 20 páginas e a biblioteca de shortcodes.

O inventário registra só a **estrutura**: o que existe, o que cada tela contém e como as telas se ligam.
Visual, textos, nomes e imagens dos dois templates não entram no projeto.

---

## Premissas

### Tudo funciona, só no front-end, com dados estáticos

- Cada tela e cada estado abaixo precisa existir **e funcionar**, no app e no site.
- Não há servidor. Os dados vêm de arquivos JS fixos: catálogo, cupons, FAQ, avaliações iniciais, tabela de CEPs e contas de demonstração.
- O que a pessoa cria ou altera fica no `localStorage`: conta, sessão, sacola, favoritos, pedidos, trocas, endereços, cartões, avaliações, notificações e preferências.
- Esperas de rede, código por e-mail, pagamento e avanço do pedido são **simulados**. Assim todos os estados ficam visíveis e testáveis.
- **Duas contas de demonstração:**
  - **"Conta nova"**: sem pedidos, endereços nem cartões. Mostra os estados vazios.
  - **"Conta completa"**: com pedidos em todos os status, uma troca em andamento, 2 endereços, 2 cartões (um vencido), favoritos e notificações. Mostra os estados cheios.

### Valores fixos da simulação

Para os estados de erro e recusa aparecerem de forma previsível em aula:

| Simulação | Valor |
|---|---|
| Código de verificação | Aparece num aviso ("e-mail simulado"); vale por 5 min |
| Cartão recusado | Qualquer cartão terminado em `0002` |
| Cartão aprovado | Qualquer outro número válido pelo dígito verificador |
| Cupom expirado / com valor mínimo / já usado | Um cupom fixo para cada caso |
| Cupom de boas-vindas da newsletter | `BEMVINDO10`: 10% sobre os produtos e frete grátis (normal ou expressa, sem valor mínimo), só na primeira compra, uma vez por e-mail. Aparece na confirmação da newsletter e precisa valer na sacola (S1) e no checkout (K1) |
| CEP não encontrado | Qualquer CEP fora da tabela |
| Expressa indisponível | CEPs de uma faixa fixa da tabela |
| Bloqueio de login | 5 tentativas erradas seguidas, por 1 min |

---

## Vocabulário de estados

Cada tela é conferida contra esta lista fechada. Os nomes são iguais no Figma (propriedade `Estado`) e no código.

| Grupo | Estado | O que é |
|---|---|---|
| **Formulário** | `empty` | Nada preenchido |
| | `filled` | Preenchido e válido |
| | `error-empty` | Campo obrigatório vazio |
| | `error-invalid` | Formato errado (e-mail sem @, CEP com 7 números) |
| | `error-rule` | Formato certo, mas a regra recusa (e-mail já cadastrado, cartão vencido, cupom expirado) |
| | `error-summary` | Vários erros: lista no topo, com link para cada campo |
| | `submitting` | Enviando |
| | `success` | Concluído |
| | `failure` | A simulação do "servidor" recusou (pagamento recusado, código expirado) |
| **Dados** | `loading` | Carregando |
| | `empty` | Nenhum item |
| | `one` | Um item só (singular e plural; layout com pouco conteúdo) |
| | `many` | Muitos itens (paginação, textos longos, nomes que quebram linha) |
| | `error-load` | Falha ao carregar, com "tentar de novo" |
| **Contexto** | `guest` / `logged` | Visitante ou logado |
| | `session-expired` | Sessão expirada no meio de uma ação |
| | `offline` | Sem conexão (só no app) |
| **Ação** | `confirm` | Confirmação antes de uma ação destrutiva |
| | `undo` | Aviso com "desfazer" |
| | `permission` | Pedir permissão / permissão negada (câmera) |

**Valem para todas as telas, sem aparecer na matriz:**
- tema claro e escuro;
- mobile, tablet e desktop;
- navegação só por teclado;
- leitor de tela;
- `prefers-reduced-motion`.

## Como ler as tabelas

- **Ref.:**
  - **T** + número: frame do Trendify (`T16` é `16_Light_home`);
  - **A**: página do Aurum (endereço do demo);
  - **Woo**: estrutura presumida pelo padrão do WooCommerce, porque a página não aparece no demo;
  - **novo**: não existe em nenhum dos dois.
- **App / Site:** ● entra · — não se aplica · **?** depende de decisão.
- **Feliz:** o caminho esperado, do início ao fim.
- **Erros:** o que pode dar errado e como a tela responde.
- **Alternativas:** caminhos válidos, mas diferentes do principal, e as variações de contexto.

---

## 0. Elementos fixos

| Elemento | App | Site | Estados |
|---|---|---|---|
| Barra superior | Título, voltar, ações | Entrar/cadastrar ou minha conta/sair, favoritos, idioma | `guest` · `logged` (nome da pessoa) |
| Cabeçalho | — | **Celular:** menu, logo e sacola. **Desktop:** uma linha só, com logo, menu (Todos os produtos, Novidades, Camisetas com mega menu, Sobre a Tramma, Blog) e ícones (busca, conta, favoritos, sacola) | Mega menu aberto/fechado · busca aberta (o campo ocupa a linha inteira, padrão Insider) ou fechada · conta `guest` ("Entrar") / `logged` ("Olá, Ana") · contador da sacola com 0 ou n itens |
| Menu mobile do site | — | Painel lateral | Aberto/fechado · submenus · `guest` / `logged` |
| Bottom nav | Início, Favoritos, Sacola, Pedidos, Conta | — | Aba atual · contador da sacola |
| Mini-sacola | — | Painel lateral | `empty` · `many` · item recém-adicionado |
| Rodapé | — | Fundo preto: marca (logo, frase e 6 redes sociais em ícone) e 3 grupos de links (Ajuda, A Tramma, Minha conta); pagamento e aviso de loja fictícia. As redes levam a `#`: a marca é fictícia | Grupos em sanfona no celular, em colunas no desktop |
| Faixa de aviso | — | Só no desktop: aviso curto (hoje, o incentivo da newsletter) e o seletor de idioma | Sempre visível no desktop (sem botão de fechar) · some no celular |
| Seletor de idioma | Na barra superior (depois, na tela Conta) | Desktop: na faixa de aviso · celular: dentro do menu | Português (padrão) · inglês |
| Toast | ● | ● | Sucesso · erro · com ação (`undo`, "ver sacola") |
| Aviso de conexão | `offline` | — | Sem conexão · conexão de volta |
| Sessão expirada | ● | ● | Aviso → entrar de novo → volta ao mesmo ponto, sem perder o que foi preenchido |
| Erro genérico | Tela de erro | 404 | — |

---

## 1. Entrada

| ID | Tela | Ref. | App | Site | Feliz | Erros | Alternativas |
|---|---|---|---|---|---|---|---|
| E1 | Splash | T1 | ● | — | `loading` → E2 (1ª vez), E3 (`guest`) ou I1 (`logged`) | `offline` | — |
| E2 | Apresentação (3 passos) | T2–T4 | ● | — | Passo 1 → 2 → 3 → E3 | — | Pular |
| E3 | Boas-vindas | T5 | ● | — | Entrar (A2) ou criar conta (A1) | — | Explorar sem conta (`guest`) |
| E4 | Consentimento de cookies (LGPD) | novo | ● | ● | Aceitar todos | — | Recusar os não essenciais · personalizar (U23) |

## 2. Autenticação

| ID | Tela | Ref. | App | Site | Feliz | Erros | Alternativas |
|---|---|---|---|---|---|---|---|
| A1 | Criar conta: nome, e-mail, **CPF**, senha, confirmar senha, termos | T6–T8 · Woo | ● | ● | `empty` → `filled` → `submitting` → `success` (logado, volta à origem) | `error-empty` · `error-invalid` (e-mail, CPF com formato errado) · `error-rule` (e-mail já cadastrado, CPF com dígito inválido, senha fraca, senhas diferentes, termos não aceitos) · `error-summary` | Mostrar/ocultar senha · força da senha · vindo do checkout ou dos favoritos · "já tenho conta" (A2) |
| A2 | Entrar | T9–T11 · A | ● | ● | `empty` → `filled` → `submitting` → `success` | `error-empty` · `error-invalid` (e-mail) · `failure` (e-mail ou senha incorretos) · bloqueio temporário após 5 tentativas | Lembrar de mim · mostrar senha · aviso "senha redefinida" · `session-expired` · vindo de uma ação que pede login |
| A3 | Esqueci a senha | T12 · Woo | ● | ● | E-mail → `submitting` → A4 | `error-empty` · `error-invalid` | Mensagem neutra: não revela se o e-mail existe |
| A4 | Código de verificação | T13 | ● | ● | `empty` → dígitos (avança sozinho) → `submitting` → A5 | `error-empty` (código incompleto) · `failure` (código errado) · `failure` (código expirado) | Reenviar, com contagem regressiva · colar o código inteiro |
| A5 | Criar nova senha | T14 · Woo | ● | ● | `filled` → `submitting` → A6 | `error-empty` · `error-rule` (requisitos não atendidos, igual à anterior, senhas diferentes) | Força da senha · mostrar senha |
| A6 | Senha redefinida | T15 | ● | ● | Aviso → A2 | — | — |

## 3. Início

| ID | Tela | Ref. | App | Site | Feliz | Erros | Alternativas |
|---|---|---|---|---|---|---|---|
| I1 | Início | T16 · A | ● | ● | `loading` (esqueleto) → seções carregadas | `error-load` · `offline` | `guest` · `logged` (saudação, recomendados) · **vistos recentemente** (com ou sem) |
| I2 | Notificações | T34 | ● | ● | `many` (não lidas e lidas, por data) → tocar abre o pedido ou o cupom | `error-load` | `empty` · `guest` (pede login) · marcar todas como lidas |

**Seções do Início:**
- **Trendify:**
  - busca;
  - banner de oferta;
  - atalhos de categoria;
  - novidades;
  - ofertas da semana;
  - recomendados.
- **Aurum:**
  - slider;
  - carrossel em alta;
  - banners de imagem e de texto;
  - mais vendidos;
  - listas curtas;
  - marcas.
- **Novo:** vistos recentemente.

## 4. Busca

| ID | Tela | Ref. | App | Site | Feliz | Erros | Alternativas |
|---|---|---|---|---|---|---|---|
| B1 | Busca (digitando) | T17 · A | ● | ● | Digitar → sugestões → B2 | `error-empty` (busca em branco não envia; aviso) | Recentes (apagar uma, limpar todas) · sem histórico · sem sugestões |
| B2 | Resultados | T18, T19 · A | ● | ● | `loading` → `many` | `empty` (nada encontrado, com sugestões) · `error-load` | `one` · filtros aplicados (chips, contagem, limpar) · paginação |
| B2.1 | Ordenar | T20 · A | ● | ● | Escolher → reordena | — | Opção atual marcada |
| B2.2 | Filtrar: tamanho, cor, modelagem, gramatura, preço | T21 | ● | ● | Marcar → "ver x resultados" → aplicar | Combinação sem resultado (botão mostra 0) | Limpar filtros · coluna lateral no site |
| B3 | Busca por foto: câmera | T22 | ● | ● | `permission` → capturar → B4 (analisando) | Permissão negada · aparelho sem câmera | Ir para a galeria |
| B4 | Busca por foto: galeria | T23, T24 | ● | ● | Escolher → `loading` (analisando) → B5 | Arquivo que não é imagem · arquivo grande demais | Cancelar |
| B5 | Resultados da foto | T25 | ● | ● | `many` (cores parecidas) | Nenhum parecido | Tentar outra foto |

## 5. Catálogo

| ID | Tela | Ref. | App | Site | Feliz | Erros | Alternativas |
|---|---|---|---|---|---|---|---|
| C1 | Loja (todos os produtos) | A | — | ● | Igual a B2 | Igual a B2 | Igual a B2 |
| C2 | Categoria | T31–T33 · A | ● | ● | Igual a B2 | Igual a B2 · categoria sem produtos | Breadcrumb · subcategoria |

**Card de produto, em todos os seus estados:**
- normal;
- em promoção (preço riscado e selo);
- novo;
- mais vendido;
- últimas unidades;
- esgotado;
- favoritado ou não;
- com nota ou sem avaliações;
- **com parcelamento**;
- nome longo.

## 6. Produto

| ID | Tela | Ref. | App | Site | Feliz | Erros | Alternativas |
|---|---|---|---|---|---|---|---|
| P1 | Produto | T26, T37 · A | ● | ● | Escolher cor e tamanho → adicionar → confirmação (toast no app, mini-sacola no site) | `error-empty` ("escolha um tamanho") · tamanho esgotado · quantidade máxima · `error-load` | Promoção · últimas unidades · esgotado (avise-me) · sem avaliações · com cupom · **parcelamento** · favoritar (`guest` pede login) · vistos recentemente |
| P1.1 | Compartilhar | T27 · A | ● | ● | Compartilhamento nativo | Sem suporte → "copiar link" | Link copiado |
| P1.2 | Favoritar | T29, T38 · A | ● | ● | Adicionado | `guest` → A2 e volta | Removido (`undo`) |
| P1.3 | Escolher variação | T30 | ● | — | Escolher → adicionar | Tamanho esgotado | — |
| P1.4 | Tabela de medidas | novo | ● | ● | Abrir → consultar | — | Medidas da pessoa modelo |
| P1.5 | **Frete por CEP** | novo | ● | ● | CEP → `submitting` → prazos e valores | `error-empty` · `error-invalid` (formato) · `error-rule` (CEP não encontrado) | `logged`: CEP do endereço padrão já preenchido · frete grátis |
| P1.6 | **Qual é o meu tamanho?** | novo | ● | ● | Altura, peso, caimento preferido → tamanho recomendado → aplicar | `error-empty` · `error-invalid` (valores fora da faixa) | Entre dois tamanhos (recomenda pelo caimento) · tamanho recomendado esgotado |
| P1.7 | **Avise-me quando chegar** | novo | ● | ● | E-mail → `success` | `error-empty` · `error-invalid` | `logged`: e-mail já preenchido · já inscrito |
| P2 | Avaliações | T28 · A | ● | ● | `many` → filtrar por nota | `error-load` | `empty` · com foto · ordenar · paginação · `guest` ou quem não comprou: explicação no lugar do formulário |

## 7. Favoritos

| ID | Tela | Ref. | App | Site | Feliz | Erros | Alternativas |
|---|---|---|---|---|---|---|---|
| F1 | Favoritos | T35 · A | ● | ● | `many` → mover para a sacola (escolher tamanho) | Item esgotado (avise-me) · `error-load` | `empty` · `guest` (pede login) · item em promoção |
| F1.1 | Remover dos favoritos | T36 | ● | ● | `confirm` → removido | — | `undo` |

## 8. Sacola

| ID | Tela | Ref. | App | Site | Feliz | Erros | Alternativas |
|---|---|---|---|---|---|---|---|
| S1 | Sacola | T39, T42 · A | ● | ● | `many` → quantidade → cupom → frete → finalizar | Item esgotou depois de adicionado (remover, avise-me) · quantidade máxima · cupom `error-empty` / `error-rule` (inválido, expirado, valor mínimo, já usado) · CEP `error-invalid` / `error-rule` | `empty` (com sugestões) · `one` · "faltam R$ x para o frete grátis" / frete grátis atingido · parcelamento no total · `guest` → finalizar pede login ou compra sem conta (site) |
| S1.1 | Editar variação | T40 | ● | ● | Trocar cor e tamanho → salvar | Tamanho esgotado | Cancelar |
| S1.2 | Remover item | T41 | ● | ● | `confirm` → removido | — | `undo` |

## 9. Checkout

| ID | Tela | Ref. | App | Site | Feliz | Erros | Alternativas |
|---|---|---|---|---|---|---|---|
| K1 | Checkout | T43, T48 · A | ● | ● | `logged` com dados salvos → revisar → confirmar → K6 | `error-summary` (seções incompletas) · termos não aceitos · **CPF** ausente ou inválido · **estoque mudou** (item indisponível: remover e seguir) · `session-expired` (entra de novo sem perder os dados) · sacola vazia → S1 | `guest`: entrar, criar conta ou comprar sem conta (site) · `logged` sem endereço nem cartão (seções `empty`) · com cupom |
| K2 | Escolher endereço | T44 | ● | ● | Escolher da lista | — | `empty` → adicionar (U6 dentro do fluxo) · editar |
| K3 | Escolher entrega | T45 · A | ● | ● | Escolher normal ou expressa | Expressa indisponível para o CEP | Frete grátis |
| K4 | Escolher pagamento | T46 · A | ● | ● | Cartão salvo → **parcelas** | Novo cartão: igual a U8 | Novo cartão (salvar ou não) · Pix · boleto · parcelas de 1x a 6x |
| K5 | Cupons | T47 · A | ● | ● | Escolher da lista → aplicado | Digitado: `error-empty` · `error-rule` (inválido, expirado, valor mínimo, já usado) | Remover cupom · `empty` (nenhum disponível) |
| K6 | Processando o pagamento | T49 | ● | ● | `submitting` → K7 | `failure` (cartão recusado: tentar de novo ou trocar a forma) | — |
| K7 | Pedido concluído | T50 · Woo | ● | ● | Cartão aprovado: nº, resumo, prazo | — | Pix aguardando (QR, "copia e cola", prazo) · boleto (linha digitável, vencimento) · comprou sem conta: "criar conta com estes dados" |

**Formato do checkout em cada template:**
- **Trendify:** uma tela-resumo; cada seção abre uma tela de escolha.
- **Aurum:** um formulário numa página só.

## 10. Pedidos

| ID | Tela | Ref. | App | Site | Feliz | Erros | Alternativas |
|---|---|---|---|---|---|---|---|
| O1 | Meus pedidos | T51, T61, T62 · Woo | ● | ● | `many` nas abas ativos / concluídos / cancelados | `error-load` | `empty` por aba · `guest` · status: aguardando pagamento, pago, em separação, enviado, entregue, cancelado, em troca |
| O2 | Detalhe do pedido | T55 · Woo | ● | ● | Itens, totais, endereço, pagamento, histórico | **Pix ou boleto expirado** → gerar de novo | As ações mudam com o status: pagar, cancelar, rastrear, avaliar, trocar/devolver, comprar de novo, imprimir nota |
| O3 | Rastrear pedido | T56, T57 · A | ● | ● | Linha do tempo → entregue | Site sem login: `error-empty` · `error-invalid` · `error-rule` (pedido não encontrado, e-mail não confere) | Cada etapa da linha do tempo |
| O3.1 | "Seu pedido chegou" | T58 | ● | ● | Aviso → avaliar (O5) | — | Fechar |
| O4 | Cancelar pedido | T52–T54 · Woo | ● | ● | Motivo → `confirm` → cancelado | `error-empty` (sem motivo, ou "outro" sem texto) · indisponível depois do envio | Desistir |
| O5 | Avaliar produto | T59, T60 | ● | ● | Nota + comentário → `success` | `error-empty` (sem nota) · texto longo demais | Só a nota · com foto · já avaliado (editar) |

## 11. Trocas e devoluções (novo)

O pós-venda mais comum em roupa. Nenhum dos dois templates tem.

| ID | Tela | Ref. | App | Site | Feliz | Erros | Alternativas |
|---|---|---|---|---|---|---|---|
| R1 | Pedir troca ou devolução: escolher itens | novo | ● | ● | Pedido entregue → escolher itens → R2 | `error-empty` (nenhum item) · fora do prazo de 30 dias | Troca · devolução |
| R2 | Motivo e item novo | novo | ● | ● | Motivo → novo tamanho/cor → R3 | `error-empty` · tamanho novo esgotado | Devolução: reembolso na mesma forma de pagamento ou vale-compra |
| R3 | Confirmação e código de postagem | novo | ● | ● | Código, prazo e instruções | — | Imprimir |

O acompanhamento aparece no O2, com estas etapas:
- solicitada;
- postada;
- recebida;
- aprovada ou **recusada** (com o motivo);
- enviada ou reembolsada.

## 12. Conta e configurações

**De onde vem cada parte:**
- **Site, padrão Woo** (página "minha conta"): menu lateral com Painel, Pedidos, Endereços, Detalhes da conta e Sair.
- **Do Trendify:** Pagamentos, Favoritos, Notificações, Preferências e Ajuda.
- **App:** a tela U1 é o próprio menu.

| ID | Tela | Ref. | App | Site | Feliz | Erros | Alternativas |
|---|---|---|---|---|---|---|---|
| U1 | Conta / Painel | T63 · Woo | ● | ● | `logged`: nome, e-mail, avatar com iniciais, atalhos | — | `guest`: entrar, criar conta, e o que não exige login (tema, idioma, ajuda) · site: resumo do último pedido |
| U2 | Meu QR code | T65 | ● | — | Mostrar o código | — | — |
| U3 | Ler QR code | T64 | ● | — | `permission` → lido → abre o destino | Permissão negada · navegador sem suporte · QR desconhecido | Cancelar |
| U4 | Endereços | T66, T70 · Woo | ● | ● | `many` → opções (editar, tornar padrão, excluir) | Excluir o endereço padrão (pede escolher outro) | `empty` · `one` · excluir com `confirm` |
| U5 | Endereço: localizar no mapa | T67 | ● | ● | Arrastar o marcador → U6 | — | Mover pelo teclado · pular o mapa |
| U6 | Endereço: detalhes (CEP, rua, número, complemento, bairro, cidade, UF, apelido, destinatário, telefone) | T68, T69 · Woo | ● | ● | **CEP → preenche o endereço** → número → salvar → `success` | `error-empty` · `error-invalid` (CEP, telefone) · `error-rule` (CEP não encontrado → preencher à mão) · `error-summary` | Novo · editar · sem número |
| U7 | Formas de pagamento | T71 | ● | ● | `many` → tornar padrão | — | `empty` · cartão vencido · excluir com `confirm` |
| U8 | Novo cartão (número, nome, validade, CVV, CPF do titular) | T72, T73 | ● | ● | `empty` → `filled` (bandeira detectada) → `submitting` → `success` | `error-empty` · `error-invalid` (número com menos dígitos, validade "13/27") · `error-rule` (dígito verificador, cartão vencido, CVV com tamanho errado para a bandeira) · `error-summary` · `failure` (cartão recusado) | Tornar padrão |
| U9 | Conta e segurança | T74 · Woo | ● | ● | Alterar senha → `success` | `error-empty` · `failure` (senha atual errada) · `error-rule` (senha nova fraca, senhas diferentes) | Excluir conta: `confirm` forte (digitar uma palavra para confirmar) |
| U10 | Meu perfil (nome, e-mail, CPF, telefone, nascimento) | T75 · Woo | ● | ● | Ver → editar → salvar → `success` | `error-empty` · `error-invalid` · `error-rule` (e-mail já usado) | CPF só para leitura depois de cadastrado |
| U11 | Preferências de notificação | T76 | ● | ● | Ligar/desligar → salvo automático (toast) | — | — |
| U12 | Contas vinculadas | T77 | ● | ● | Conectar → `submitting` → conectada | `failure` (conexão simulada falhou) | Desconectar com `confirm` |
| U13 | Dados e análise | T78 | ● | ● | Ligar/desligar | — | Baixar meus dados (arquivo) · apagar histórico com `confirm` |
| U14 | Aparência | T79 | ● | ● | → U15 ou U16 | — | — |
| U15 | Tema | T80 | ● | ● | Escolher claro, escuro ou do sistema | — | — |
| U16 | Idioma | T81 · A | ● | ● | Escolher pt-BR ou inglês | — | — |
| U17 | Ajuda | T82 | ● | ● | → U18, U19, U20, U21, U24, U25, U26 | — | — |
| U18 | Perguntas frequentes | T83 · A | ● | ● | Abrir uma pergunta | Busca sem resultado | Buscar · filtrar por categoria |
| U19 | Fale conosco (nome, e-mail, assunto, nº do pedido opcional, mensagem) | T84 · A | ● | ● | `filled` → `submitting` → `success` | `error-empty` · `error-invalid` · `error-summary` | `logged`: nome e e-mail já preenchidos |
| U20 | Política de privacidade | T85 | ● | ● | Ler | — | — |
| U21 | Termos de uso | T86 | ● | ● | Ler | — | — |
| U22 | Sair | T87 · Woo | ● | ● | `confirm` → `guest` | — | Cancelar |
| U23 | **Preferências de cookies** | novo | ● | ● | Ligar/desligar categorias → salvar | — | Aceitar todos · recusar os não essenciais |
| U24 | **Política de entrega** | novo | ● | ● | Ler | — | — |
| U25 | **Política de trocas e devoluções** | novo | ● | ● | Ler → pedir troca (R1) | — | — |
| U26 | **Declaração de acessibilidade** | novo | ● | ● | Ler | — | Contato para relatar uma barreira (U19) |

## 13. Conteúdo e institucional (só no Aurum)

| ID | Tela | Ref. | App | Site | Feliz | Erros | Alternativas |
|---|---|---|---|---|---|---|---|
| X1 | Sobre a marca | A | ● | ● | Ler | — | — |
| X2 | Blog: lista | A | ● | ● | `many` → abrir post | `error-load` | Mosaico · paginação · `empty` |
| X3 | Post | A | ● | ● | Ler → comentar | Comentário: `error-empty`, `error-invalid` | Sem comentários · compartilhar |
| X4 | Página não encontrada | A | ● | ● | Voltar ao início ou buscar | — | — |

A **biblioteca de componentes do Aurum** (shortcodes) não é tela da loja. Ela serve de referência para o design system:
- carrosséis;
- banners;
- depoimentos;
- destaques;
- acordeão;
- abas;
- botões;
- citação;
- mapa;
- tipografia.

---

## Itens novos (não existem em nenhum dos dois templates)

| # | Item | Onde entra |
|---|---|---|
| 1 | CPF | A1, K1, U8, U10 |
| 2 | CEP que preenche o endereço | U6, K2 |
| 3 | Frete por CEP no produto | P1.5 |
| 4 | Parcelamento | Card, P1, S1, K4 |
| 5 | Consentimento de cookies (LGPD) | E4, U23 |
| 6 | Trocas e devoluções | R1–R3, O2, U25 |
| 7 | Qual é o meu tamanho? | P1.6 |
| 8 | Avise-me quando chegar | P1.7, F1 |
| 9 | Estoque mudou no checkout | K1 |
| 10 | Pix e boleto expirados | O2 |
| 11 | Sessão expirada | Elementos fixos, K1, A2 |
| 12 | Sem conexão (app) | Elementos fixos, E1, I1 |
| 13 | Vistos recentemente | I1, P1 |
| 14 | Newsletter (com cupom de boas-vindas) | Seção própria da home, no site |
| 15 | Políticas de entrega e de trocas | U24, U25 |
| 16 | Declaração de acessibilidade | U26 |

## Totais

| Fluxo | Telas | Sobreposições |
|---|---|---|
| Entrada | 3 | 1 |
| Autenticação | 5 | 1 |
| Início | 2 | — |
| Busca | 5 | 2 |
| Catálogo | 2 | — |
| Produto | 2 | 7 |
| Favoritos | 1 | 1 |
| Sacola | 1 | 2 |
| Checkout | 6 | 1 |
| Pedidos | 5 | 1 |
| Trocas e devoluções | 3 | — |
| Conta e configurações | 25 | 1 |
| Conteúdo e institucional | 4 | — |
| **Total** | **64** | **18** |

Além delas, os 12 elementos fixos (seção 0) têm estados próprios.
Somando os estados das colunas Feliz, Erros e Alternativas, o roteiro de testes passa de **300 situações**.

---

## Impacto nas regras do projeto

O CLAUDE.md atual só permite o `localStorage` para a sacola e o tema.
Para tudo funcionar, essa regra precisa mudar: ele passa a guardar todos os dados que a pessoa cria, sempre com `try/catch`.
A mudança entra na etapa de atualização do CLAUDE.md, depois deste inventário.

## Decisões tomadas (20/11/2026)

1. Splash, apresentação e boas-vindas (E1–E3) existem só no app.
2. O app não tem a loja geral (C1); usa as categorias e a busca.
3. O QR code (U2, U3) existe só no app.
4. Blog e Sobre (X1–X3) entram, no app e no site.
5. **Checkout:**
   - **app:** resumo com telas de escolha;
   - **site:** página única;
   - os campos e as regras são os mesmos nos dois.
6. **Comprar sem conta:** o site permite, oferecendo "criar conta" no fim; o app exige login.
7. Favoritos exigem login.
8. O site permite rastrear o pedido sem login, com o nº do pedido e o e-mail.
9. Sem atalho de demonstração. A "conta completa" já traz pedidos em todos os status; os pedidos novos avançam pelo relógio.
10. **Trocas:** prazo de 30 dias depois da entrega; a primeira troca é sem custo.
11. **Parcelamento:** até 6x sem juros, com parcela mínima de R$ 30.
12. **Frete grátis** nas compras acima de R$ 299 (decidido em 20/11/2026, na revisão da home).
13. **Pix:** 5% de desconto sobre o valor dos produtos.
14. **Vitrine da home** (revista em 21/11/2026, ver decisão 17); o catálogo é unissex, sem separação por gênero.
15. **Idioma:** português (padrão) e inglês, escolhidos pelo seletor ou pelo link com `?lang=en`. A escolha fica salva. O idioma traz a moeda junto: real em português e dólar em inglês, com câmbio fixo de R$ 5 = US$ 1 (didático, sem cotação do dia). O preço continua guardado em reais. Decidido em 20/11/2026; ver `mapeamento/idioma.md`.

## Decisões tomadas (21/11/2026)

16. **Estrutura antes do layout:** cada tela passa por wireframe de baixa fidelidade (pasta `wireframes/`), um por canal (app, web mobile, desktop), com a mesma estrutura nos três. Base de conteúdo: Trendify; Aurum só acrescenta; Insider é referência de estilo, não de conteúdo.
17. **Curadoria da vitrine** por momento, diferente das categorias (que navegam por modelo): Destaques, Novidades, Mais vendidos, Mais bem avaliados e Promoções. Destaques são produtos marcados pela loja (`isFeatured`, só com estoque); Mais bem avaliados são os de nota 4,7 ou mais, da maior para a menor; Promoções por último. Chips no celular e no app, abas no desktop.
18. **Seções que saíram da home:** ficha técnica, galeria "Na vida real", "Ofertas da semana" e "Novidades" como listas próprias (as duas viraram abas da curadoria).
19. **Fundos fixos por seção**, nunca pela posição: vitrine cinza, categorias branco, (campanha), recomendados cinza, vistos branco, newsletter cinza, sobre branco, rodapé preto.
20. **Newsletter** como seção própria, antes do Sobre: incentivo de 10% e frete grátis na primeira compra (cupom `BEMVINDO10`), 3 ganhos (frete grátis na primeira compra, novidades antes de todo mundo, ofertas só para assinantes); o frete vem primeiro, perto dos 10% e a linha "Sem spam. Você cancela quando quiser." Só no site.
21. **Cabeçalho do desktop** em uma linha, sem "Mais vendidos" no menu (a curadoria já está na home). A saudação "Olá, Ana" acima do slider fica só no celular; no desktop, o nome já está no cabeçalho.
22. **Conteúdo sem repetição:** a Linha Pesada fica só no banner de campanha; o slider mostra Coleção Essencial, Camiseta Leve e as 12 cores fixas; parcelamento e troca ficam só na faixa de benefícios; a faixa de aviso divulga a newsletter.
23. **Botões no celular e no app** ocupam a largura toda do conteúdo.
