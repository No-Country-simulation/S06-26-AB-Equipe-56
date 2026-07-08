# App Bit Backend

API backend do projeto App Bit, construída com Node.js + Express e organizada em camadas de controllers, models, routes e middlewares.

## Funcionalidades principais

- Autenticação com JWT
- Cadastro e gerenciamento de recrutadores, candidatos, empresas, vagas e candidaturas
- Módulo de saúde com endpoints para profissionais, pacientes, consultas e exames
- Integração com banco de dados PostgreSQL/SQL Server via configuração de ambiente

## Tecnologias

- Node.js
- Express
- JWT + bcrypt
- PostgreSQL / SQL Server drivers
- dotenv
- nodemon

## Requisitos

- Node.js 18 ou superior
- npm
- Banco de dados configurado e acessível

## Instalação

```bash
cd app-bit-backend
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na pasta do backend com as variáveis necessárias, por exemplo:

```env
PORT=3000
JWT_SECRET=seu_segredo
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_SERVER=seu_servidor
DB_DATABASE=seu_banco
```

> O projeto usa os arquivos de configuração em `src/config` para ler essas variáveis.

## Execução

Modo de desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

## Testes

```bash
npm test
```

## Estrutura principal

```text
src/
  controllers/
  models/
  routes/
  middlewares/
  config/
  server.js
```

## Endpoints principais

A aplicação expõe rotas agrupadas por contexto, como:

- `/api/auth`
- `/api/recrutadores`
- `/api/candidatos`
- `/api/empresas`
- `/api/vagas`
- `/api/candidaturas`
- `/api/saude`

## Princípios de clean code

- Nomear funções e variáveis de forma explícita para facilitar leitura e manutenção.
- Manter o código do módulo de saúde dividido por responsabilidades: controller, model e routes.
- Evitar duplicação e concentrar as regras de erro em helpers reutilizáveis.
- Escrever o código pensando em facilidade de testes e evolução futura.

## Observações

- Para o módulo de saúde, é importante que o banco tenha o schema correspondente criado antes de usar os endpoints.
- A aplicação pode ser iniciada diretamente com `node src/server.js`, mas o fluxo recomendado é usar `npm run dev`.
