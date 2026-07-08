# App Bit Frontend

Frontend do projeto App Bit, desenvolvido com React, Vite e Tailwind CSS.

## Funcionalidades principais

- Interface de autenticação
- Dashboard com navegação por páginas
- Módulo de saúde com painel, consultas, exames e formulários
- Integração com a API backend via Axios

## Tecnologias

- React 19
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
cd app-bit-frontend
npm install
```

## Execução

Ambiente de desenvolvimento:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

## Build de produção

```bash
npm run build
```

## Estrutura principal

```text
src/
  components/
  context/
  pages/
  routes/
  services/
  App.jsx
  main.jsx
```

## Princípios de clean code

- Organizar componentes e lógicas em blocos pequenos e com responsabilidade única.
- Centralizar acesso à API e controle de sessão para evitar duplicação de código.
- Manter a interface do módulo de saúde consistente, legível e fácil de evoluir.
- Priorizar clareza na comunicação com o backend e no tratamento de erro.

## Observações

- A aplicação consome a API backend em execução localmente.
- Certifique-se de que o backend esteja rodando antes de testar fluxos que dependam de autenticação e dados.
- O módulo de saúde usa tokens específicos para acessar os endpoints do backend.
