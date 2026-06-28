# Design System do Projeto

> Plataforma de formação e desenvolvimento para times, com foco em clareza, progresso e experiência de aprendizado.

## 1. Contexto do produto

Esta interface foi pensada para apoiar um fluxo de formação com:

- dashboard inicial com visão geral de trilhas;
- páginas de formação com cards e detalhes;
- player de módulos com conteúdo em vídeo ou artigo;
- questionários para validação de aprendizado;
- tela de certificação ao completar trilhas obrigatórias.

O design system atual busca manter a experiência limpa, objetiva e motivadora, sem perder funcionalidade.

## 2. Princípios de interface

- Clareza: cada tela deve comunicar rapidamente o que o usuário pode fazer.
- Progresso: o estado de conclusão deve ser sempre visível.
- Confiabilidade: interações como abrir módulo, responder quiz e concluir trilha devem parecer previsíveis.
- Acessibilidade: contraste, foco e legibilidade são prioridade.

## 3. Tokens de cor

Os principais tokens usados no projeto são:

- **Primary:** `#1a3dff` — ação principal, destaques e elementos de navegação.
- **Primary Strong:** `#343eff` — estados de hover e foco mais intensos.
- **Background:** `#f5f7ff` — fundo geral da aplicação.
- **Surface:** `#ffffff` — cards, painéis e blocos de conteúdo.
- **Text:** `#0f172a` — texto principal.
- **Muted:** `#64748b` — texto secundário e descrições.
- **Border:** `#dbe4ff` — bordas suaves e separadores.

### Uso recomendado

- Use a cor primária para botões de ação, links ativos e indicadores de progresso.
- Use superfícies brancas para cards e blocos principais.
- Mantenha textos em cinza escuro para garantir legibilidade.
- Evite adicionar novas cores sem necessidade, para preservar a consistência do sistema.

## 4. Tipografia

- **Família principal:** Inter, system-ui, Segoe UI, sans-serif.
- **Uso:** títulos, textos de navegação, descrições e componentes de interface.
- **Estilo:** tipografia limpa, moderna e sem excesso ornamentação.
- **Hierarquia recomendada:** H1 para títulos principais, H2 para seções, H3 para subtítulos e body para textos corridos.
- **Pesos recomendados:** 400 para texto base, 500 para destaques curtos e 600/700 para títulos.

## 5. Espaçamento e layout

- Estruture as telas com blocos bem definidos e espaçamento consistente.
- Use grid simples para organizar cards, listas e painéis.
- Preserve uma hierarquia visual clara entre cabeçalho, conteúdo e ações.

## 6. Componentes principais

### Sidebar e navegação
- Deve ser simples e objetiva.
- O item ativo deve ficar destacado com a cor primária.

### Cards de trilha
- Usar estrutura consistente com título, categoria, badge e ação principal.
- Destacar status de obrigatoriedade e progresso.

### Botões
- Botões primários devem usar a cor azul principal.
- Botões secundários devem manter aparência neutra e limpa.

### Painéis e módulos
- Cards e blocos devem ter bordas suaves, fundo branco e leve elevação visual.
- O conteúdo deve ser fácil de escanear.

## 7. Interação e movimento

- Use transições curtas e suaves para hover, foco e abertura de conteúdo.
- Evite animações excessivas que distraiam do objetivo principal da experiência.
- A resposta visual deve reforçar a ação do usuário.

## 8. Tom de voz

- Linguagem direta, objetiva e acolhedora.
- Priorize instruções claras para navegação, aprendizado e conclusão de módulos.
- Evite textos excessivamente formais ou genéricos.

## 9. Diretrizes de uso

- Não introduza cores fora do sistema sem necessidade.
- Mantenha consistência entre cards, botões, títulos e estados de progresso.
- Preserve acessibilidade em todos os componentes.
- Use o design system para reforçar a experiência de aprendizagem, não para sobrecarregar a interface.