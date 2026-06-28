# 📘 Design System Educacional - Projeto Formações ESG

Este documento define os padrões visuais e de fluxo educacional para manter consistência no MVP, inspirado em plataformas como **Hello Interview**, **AWS Skill Builder** e **Algomaster**.

---

## 🎨 Paleta de Cores
- **Primária (Indigo 600):** #4F46E5  
- **Secundária (Emerald 500):** #10B981  
- **Apoio (Orange 500):** #F97316  
- **Background (Gray 50):** #F9FAFB  
- **Texto principal (Gray 900):** #111827  
- **Texto secundário (Gray 600):** #6B7280  

---

## ✍️ Tipografia
- **H1 (Título principal):** Nunito Bold, 32px, #111827  
- **H2 (Subtítulo):** Nunito SemiBold, 24px, #1F2937  
- **H3 (Título de card/módulo):** Inter SemiBold, 20px, #374151  
- **H4–H6 (Detalhes):** Inter Regular, 16px, #6B7280  
- **Parágrafo (p):** Inter Regular, 16px, #374151, line-height 1.5  
- **Links (a):** Inter Medium, 16px, #4F46E5 (hover #4338CA)  

---

## 📐 Espaçamento
- **Padding padrão:** 1rem (16px)  
- **Margin entre seções:** 2rem (32px)  
- **Grid:** 12 colunas responsivas (Tailwind padrão)  
- **Cards:** espaçamento interno 24px, borda arredondada 8px  

---

## 🧩 Componentes Base
- **Card de Trilha:** fundo branco, sombra leve, borda arredondada, título H3, progresso em barra.  
- **Botão primário:** Indigo 600, texto branco, hover Indigo 700.  
- **Barra de progresso:** Emerald 500, fundo Gray 200.  
- **Player de vídeo:** iframe responsivo (YouTube ou Vimeo).  
- **Renderização de texto:** markdown limpo, fonte Inter.  
- **Questionário:** múltipla escolha, 3–5 perguntas, feedback imediato.  
- **Certificado/Badge:** destaque em Orange 500 ou dourado, com mensagem de conclusão.  

---

## 🗺️ Fluxo Educacional
1. **Tela de Formações** → cards das trilhas (título, categoria, tempo, progresso).  
2. **Detalhe da Trilha** → lista de módulos (vídeo ou artigo).  
3. **Player de Módulo** → exibe conteúdo (vídeo ou texto).  
4. **Questionário** → aparece após cada módulo, valida aprendizado.  
5. **Certificação** → badge liberado ao concluir todos os módulos.  

---

## 🔑 Princípios
- **Consistência visual** em todas as telas.  
- **Acessibilidade**: contraste adequado, fontes legíveis.  
- **Simplicidade e clareza**: tema limpo, estilo corporativo.  
- **Engajamento educacional**: fluxo claro de aprendizado → avaliação → certificação.  
