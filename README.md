# Task Manager API 
Este projeto consiste uma API REST para gestão de tarefas, desenvolvida em Node.js com Express e MySQL.
A aplicação permite autenticação de utilizadores através de JWT (JSON Web Token) e operações CRUD sobre tarefas, garantindo que cada utilizador apenas pode aceder às suas próprias informações. Para o desenvolvimento da API foi utilizada uma abordagem Code First, onde a implementação do backend e das rotas foi realizada inicialmente em código. Posteriormente, a documentação Swagger/OpenAPI foi gerada automaticamente através de anotações @openapi inseridas nos controllers da aplicação.

# Tecnologias Utilizadas
- Node.js
- Express.js
- MySQL
- Docker
- Docker Compose
- JWT (JSON Web Token)
- Swagger/OpenaAPI
- mysql2
- dotenv

# Estrutura do Projeto

src/
  config/
  controller/
  middlewares/
  routes/

- config: configuração de base de dados
- controllers: lógica das rotas
- middlewares: autenticação JWT
- routes: definição dos endpoints

---
# Base de Dados 
A aplicação utiliza MySQL como sistema de getão de base de dados.
A base de dados é criada automaticamente através do ficheiro `init.sql`, executado pelo container Docker do MySQL durante a inicialização da aplicação.

Foram criadas tabelas para:
- utilizadores
- tarefas
- categorias

Cada tarefa possui um campo `user_id`, utilizado para associar tarefas ao respetivo utilizador autenticado.

Exemplo de relação:

- um utilizador pode possuir várias tarefas
- cada tarefa pertence apenas a um utilizador

---


# Autenticação e Autorização

A autenticação da API foi implementada utilizando JWT (JSON Web Token).
O utilizador realiza login através `/login`, fornecendo email e password. Após validação das credenciais na base de dados, o servidor gera um token JWT assinado com uma chave  secreta (`JWT_SECRET`).
Esse token é posteriormente enviado pelo cliente no header Authorization utilizando o formato:
```text
Authorization: Bearer <token>
```

O middleware de autenticação verifica:
- existência do token
- validade da assinatura
- expiração do token

Após validação, os dados do utilizador são inseridos em `req.user`, permitindo controlar  o acesso aos recursos.

A autorização foi implementada utilizando o `user_id` associado às tarefas. Dessa forma:
- um utilizador apenas consegue visualizar as suas tarefas
- um utilizador apenas consegue editar as suas tarefas
- um utilizador apenas consegue apagar as suas tarefas

Isto é garantido através de queries SQL que filtram pelo `user_id` presente no toke JWT.

# Comparação com OAuth2
A autenticação implementada neste projetp utilizada JWT simples com autenticação local baseada em email e password.

Diferentemente do OAuth2, esta solução não utiliza:
- Authorization Server
- Refresh Tokens
- Scopes
- consentimento de terceiros
- login federado (Google, Facebook, GitHub)

No OAuth2, existem diferentes authorization flows, como:
- Authorization Code Flow
- Client Credentials Flow
- Implicit Flow
- Device Flow

Esses flows são utilizados principalmente quando aplicações precisam de autenticação delegada entre diferentes serviços ou plataformas externas.
Neste projeto foi utilizada uma abordagem mais simples baseada em JWT, adequada para APIs REST pequenas e médias, onde  a própria aplicação é responsável pela autenticação dos utilizadores.

# Execução com Docker 

Para iniciar os containers:

```bash
docker-compose up --build
```
### A API ficará disponível em:
```bash
http://localhost:3000
```
### Sagger:
```bash
http://localhost:3000/api-docs
```
# 7. Endpoints

```md id="1wz1u7"
```
## Endpoints
| Método | Endpoint | Descrição |
|---|---|---|
| POST | /login | Login |
| GET | /tasks | Listar tarefas |
| POST | /tasks | Criar tarefa |
| PUT | /tasks/:id | Atualizar tarefa |
| DELETE | /tasks/:id | Apagar tarefa |

# Segurança

- autenticação JWT
- middleware de autorização
- proteção de rotas privadas
- isolamaneto de tarefas por utilizador
- utilização de variáveis de ambiente com dotenv

# Conclusão
Este projeto permitiu desenvolver uma API REST completa utilizando Node.js, Express e MySQL, aplicando conceitos de autenticação, autorização e documentação de APIs.
Foram implementadas operações CRUD protegidas através de JWT, garantindo que cada utilizador apenas consegue aceder aos seus próprios recursos.


