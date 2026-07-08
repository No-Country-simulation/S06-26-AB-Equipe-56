# App Bit

Projeto completo composto por um backend em Node.js/Express e um frontend em React/Vite para gestão de recrutamento e módulo de saúde.

## Visão geral

Este repositório contém:

- Backend: API REST para autenticação, recrutamento, vagas, candidaturas e módulo de saúde
- Frontend: interface web para navegação, dashboard e telas do módulo de saúde
- Scripts SQL para estrutura e dados de exemplo

## Estrutura do projeto

```text
app-bit-backend/   # API e regras de negócio
app-bit-frontend/  # Interface web
sql/               # Scripts SQL do banco
```

## Requisitos

- Node.js 18+
- npm
- Banco de dados configurado para o backend

## Como rodar

### 1. Backend

```bash
cd app-bit-backend
npm install
npm run dev
```

A API fica disponível em:

```text
http://localhost:3000
```

### 2. Frontend

```bash
cd app-bit-frontend
npm install
npm run dev
```

A interface fica disponível em:

```text
http://localhost:5173
```

## Documentação específica

- Backend: [app-bit-backend/README.md](app-bit-backend/README.md)
- Frontend: [app-bit-frontend/README.md](app-bit-frontend/README.md)

## Funcionalidades principais

- Autenticação e autorização
- Gestão de recrutadores, candidatos, empresas, vagas e candidaturas
- Módulo de saúde com profissionais, pacientes, consultas e exames
- Interface responsiva e integrada à API

## Princípios de clean code

- O projeto busca manter o módulo de saúde com código organizado, legível e fácil de manter.
- Funções, componentes e rotas foram estruturados para separar responsabilidades e reduzir duplicação.
- A documentação foi revisada para facilitar onboarding e evolução do sistema.

## Observações

- O backend precisa das variáveis de ambiente configuradas antes da execução.
- O frontend depende da API backend estar em execução para alguns fluxos.
