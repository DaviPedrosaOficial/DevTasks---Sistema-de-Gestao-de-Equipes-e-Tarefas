# DevTasks API 🚀

API RESTful para gerenciamento de tarefas, projetos e usuários, desenvolvida com Node.js, Express, Prisma ORM e MySQL.

O projeto foi criado com foco em boas práticas de backend, autenticação JWT, testes automatizados e ambiente totalmente containerizado com Docker.

---

## ✨ Funcionalidades

- Cadastro e autenticação de usuários
- Criação e gerenciamento de projetos
- Criação, edição e remoção de tarefas
- Controle de status das tasks
- Estatísticas de tarefas por projeto
- Validação de dados
- Tratamento centralizado de erros
- Testes automatizados com Jest e Supertest
- Banco de dados MySQL com Prisma ORM
- Ambiente dockerizado com Docker Compose

---

## 🛠️ Tecnologias utilizadas

- Node.js
- Express
- Prisma ORM
- MySQL
- JWT
- Jest
- Supertest
- Docker
- Docker Compose

---

## 📁 Estrutura do projeto

```bash
src/
├── controllers/
├── services/
├── routes/
├── middlewares/
├── validators/
├── prisma/
├── utils/
└── tests/
```

---

## ⚙️ Como executar o projeto

### Pré-requisitos

- Docker
- Docker Compose

---

### Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

---

### Acessar a pasta backend

```bash
cd backend
```

---

### Subir aplicação

```bash
docker compose up --build
```

A API estará disponível em:

```bash
http://localhost:3000
```

---

## 🗄️ Banco de dados

O projeto utiliza MySQL em container Docker.

As migrations do Prisma são executadas automaticamente ao iniciar a aplicação.

---

## 🧪 Executando os testes

```bash
npm test
```

---

## 🔐 Autenticação

A autenticação é feita utilizando JWT Bearer Token.

Rotas protegidas exigem:

```bash
Authorization: Bearer TOKEN
```

---

## 📌 Endpoints principais

### Usuários

- POST `/users/register`
- POST `/users/login`

### Projetos

- GET `/projects`
- POST `/projects`
- PUT `/projects/:id`
- DELETE `/projects/:id`

### Tasks

- GET `/tasks`
- POST `/tasks`
- PUT `/tasks/:id`
- PATCH `/tasks/:id/status`
- GET `/tasks/stats`

---

## 🚀 Melhorias futuras

- Frontend em React
- Deploy em cloud
- CI/CD
- Refresh Token
- Paginação
- Upload de arquivos
- Documentação Swagger

---

## 👨‍💻 Autor

Desenvolvido por Davi Pedrosa.
