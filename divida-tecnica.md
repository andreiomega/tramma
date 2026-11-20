# Dívida técnica

Pontos conhecidos e adiados de propósito. Cada item diz o problema, a proposta e o que ele afeta. Quando um item for resolvido, ele sai daqui e vira commit.

## Home (registrado em 20/11/2026)

### 1. Idioma: português e inglês — prioridade alta

- **Problema:** o conteúdo vai ser usado em aulas em português e em inglês (Unistra, CAWEB). Hoje todo o texto está só em português, espalhado entre o HTML e o `data.js`.
- **Proposta:**
  - seletor de idioma na barra do topo, como no Aurum;
  - textos da interface num dicionário JS (`TRAMMA.i18n.pt` e `TRAMMA.i18n.en`), já que o projeto abre via `file://` e não pode buscar arquivos;
  - a escolha fica no `localStorage`, e o `lang` do `<html>` acompanha o idioma;
  - preço continua em reais.
- **Afeta:** todas as páginas. Quanto antes for resolvido, menos texto precisa ser migrado. Também entra na especificação (`inventario.md`), porque é um requisito novo.

### 2. Faixa de aviso sem botão de fechar

- **Problema:** o "X" da faixa do topo talvez não faça sentido: o aviso é curto e útil.
- **Proposta:** tirar o botão e o estado "fechada". A faixa passa a abrigar também o seletor de idioma (item 1).
- **Afeta:** `announcement-bar` (HTML, CSS e JS) e o mapeamento da home.

### 3. Cabeçalho do desktop em uma linha só

- **Problema:** hoje são duas linhas: logo, busca e ícones em cima; navegação embaixo. Ocupa altura e parece pesado.
- **Proposta:** uma linha a partir de 992px, como no Aurum: logo à esquerda, navegação no centro, ícones à direita.
  - Para caber, a busca vira um ícone que abre o campo, e a navegação perde itens: Novidades, Camisetas (mega menu), Mais vendidos e Sobre.
  - **Custo:** a busca fica menos visível, e em e-commerce a busca visível costuma vender mais. Vale decidir olhando as duas versões lado a lado.
- **Afeta:** `site-header`, `navigation-menu` e a altura usada no slider (`100svh - 10rem`).

### 4. Controles do slider nas bordas, ao passar o mouse

- **Problema:** as setas ficam numa barra na base. A proposta é o padrão do Aurum: setas nas bordas do slide, com degradê transparente, aparecendo quando o mouse se aproxima.
- **Proposta:**
  - **Desktop:** setas nas bordas, visíveis no hover **e também no foco do teclado** (`:focus-visible`). Sem isso, quem usa teclado não as encontra.
  - **Celular:** sem setas. Troca pelo arraste do dedo e pelos indicadores, que continuam visíveis e clicáveis. Eles são a alternativa acessível ao arraste.
  - **Pausar:** não pode sumir. O WCAG (2.2.2) exige pausa para conteúdo que se move sozinho por mais de 5 segundos. Proposta: no canto inferior esquerdo, junto dos indicadores, discreto, mas sempre visível.
- **Afeta:** `carousel` (CSS e a ordem dos controles no HTML).
