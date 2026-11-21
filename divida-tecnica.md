# Dívida técnica

Pontos conhecidos e adiados de propósito. Cada item diz o problema, a proposta e o que ele afeta. Quando um item for resolvido, ele sai daqui e vira commit.

## Home (registrado em 20/11/2026)

### 1. Controles do slider nas bordas, ao passar o mouse

- **Problema:** as setas ficam numa barra na base. A proposta é o padrão do Aurum: setas nas bordas do slide, com degradê transparente, aparecendo quando o mouse se aproxima.
- **Proposta:**
  - **Desktop:** setas nas bordas, visíveis no hover **e também no foco do teclado** (`:focus-visible`). Sem isso, quem usa teclado não as encontra.
  - **Celular:** sem setas. Troca pelo arraste do dedo e pelos indicadores, que continuam visíveis e clicáveis. Eles são a alternativa acessível ao arraste.
  - **Pausar:** não pode sumir. O WCAG (2.2.2) exige pausa para conteúdo que se move sozinho por mais de 5 segundos. Proposta: no canto inferior esquerdo, junto dos indicadores, discreto, mas sempre visível.
- **Afeta:** `carousel` (CSS e a ordem dos controles no HTML).

### 2. Seletor de idioma no padrão do Aurum

- **Pedido (20/11/2026):** mostrar o nome do idioma atual ("English") com ícone; ao passar o mouse, aparece o outro idioma. No web mobile, o seletor fica dentro do menu (sheet).
- **Proposta:** ícone de globo no lugar da bandeira (bandeira é país, não idioma); o menu abre também no clique e no foco do teclado, não só no hover.
- **Afeta:** `language-switcher`, `announcement-bar`, `sheet` e o `app-bar`.
