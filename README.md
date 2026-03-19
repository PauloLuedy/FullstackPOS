# API de Blogging para Professores

## Tech Challenge - Fase 02

Plataforma de blogging desenvolvida para professores da rede pública de educação, permitindo que postem suas aulas e transmitam conhecimento de forma centralizada e tecnológica.

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Instalação e Configuração](#instalação-e-configuração)
- [Endpoints da API](#endpoints-da-api)
- [Coleção do Postman](#coleção-do-postman)
- [Testes](#testes)
- [Docker](#docker)
- [Desafios e Experiências](#desafios-e-experiências)

---

## Sobre o Projeto

Este projeto foi desenvolvido como parte do Tech Challenge da Fase 02, com o objetivo de criar uma aplicação de blogging dinâmico utilizando Node.js e PostgreSQL. A aplicação permite que professores criem, editem e gerenciem postagens educacionais, enquanto alunos podem visualizar e buscar conteúdos.

### Objetivos

- Criar uma API REST completa para gerenciamento de posts
- Implementar persistência de dados com PostgreSQL
- Containerizar a aplicação usando Docker
- Garantir cobertura de testes de pelo menos 20%
- Documentar o projeto de forma detalhada

---

## Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **pg** - Cliente PostgreSQL para Node.js

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

### Testes
- **Jest** - Framework de testes
- **Supertest** - Testes de APIs HTTP

### Outras Dependências
- **dotenv** - Gerenciamento de variáveis de ambiente
- **cors** - Habilitação de CORS
- **nodemon** - Hot reload em desenvolvimento

---

## Arquitetura

O projeto segue uma arquitetura em camadas (MVC adaptado):

```
FullStackPos/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração do PostgreSQL
│   ├── models/
│   │   └── Post.js              # Model de Post (queries SQL)
│   ├── controllers/
│   │   └── postController.js    # Lógica de negócio
│   ├── routes/
│   │   └── postRoutes.js        # Definição de rotas
│   ├── middleware/
│   │   └── errorHandler.js      # Tratamento de erros
│   ├── app.js                   # Configuração do Express
│   └── server.js                # Inicialização do servidor
├── tests/
│   └── post.test.js             # Testes unitários
├── .env.example                 # Exemplo de variáveis de ambiente
├── .gitignore
├── .dockerignore
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### Modelo de Dados

**Tabela: posts**

| Campo      | Tipo         | Descrição                          |
|------------|--------------|-------------------------------------|
| id         | SERIAL       | Identificador único (PK)            |
| title      | VARCHAR(255) | Título do post                      |
| content    | TEXT         | Conteúdo do post                    |
| author     | VARCHAR(100) | Nome do autor/professor             |
| created_at | TIMESTAMP    | Data de criação                     |
| updated_at | TIMESTAMP    | Data da última atualização          |

---

## Instalação e Configuração

### Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 15+ instalado (ou usar Docker)
- Docker e Docker Compose (opcional, mas recomendado)

### Opção 1: Instalação Local

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd FullStackPos
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=blogging_platform
DB_USER=postgres
DB_PASSWORD=postgres
```

4. **Certifique-se de que o PostgreSQL está rodando**

5. **Inicie a aplicação**
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

### Opção 2: Usando Docker (Recomendado)

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd FullStackPos
```

2. **Inicie os containers**
```bash
docker-compose up -d
```

Isso irá:
- Criar um container PostgreSQL na porta 5432
- Criar um container Node.js na porta 3000
- Inicializar automaticamente o schema do banco de dados
- Conectar os dois containers em uma rede privada

3. **Verifique se os containers estão rodando**
```bash
docker-compose ps
```

4. **Visualize os logs**
```bash
docker-compose logs -f api
```

5. **Para parar os containers**
```bash
docker-compose down
```

---

## Endpoints da API

A API estará disponível em `http://localhost:3000`

### Health Check

**GET /** - Informações da API
```bash
curl http://localhost:3000/
```

**GET /health** - Status de saúde
```bash
curl http://localhost:3000/health
```

### Posts

#### 1. Listar todos os posts

**GET /posts**

Retorna uma lista de todos os posts ordenados por data de criação (mais recentes primeiro).

**Exemplo:**
```bash
curl http://localhost:3000/posts
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Introdução ao JavaScript",
      "content": "JavaScript é uma linguagem de programação...",
      "author": "Professor Silva",
      "created_at": "2024-03-10T10:00:00.000Z",
      "updated_at": "2024-03-10T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### 2. Obter um post específico

**GET /posts/:id**

Retorna os detalhes de um post específico pelo ID.

**Exemplo:**
```bash
curl http://localhost:3000/posts/1
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Introdução ao JavaScript",
    "content": "JavaScript é uma linguagem de programação...",
    "author": "Professor Silva",
    "created_at": "2024-03-10T10:00:00.000Z",
    "updated_at": "2024-03-10T10:00:00.000Z"
  }
}
```

#### 3. Criar um novo post

**POST /posts**

Cria um novo post. Requer `title`, `content` e `author` no corpo da requisição.

**Exemplo:**
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Algoritmos de Ordenação",
    "content": "Nesta aula vamos aprender sobre Bubble Sort, Quick Sort...",
    "author": "Professora Maria"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Post criado com sucesso",
  "data": {
    "id": 2,
    "title": "Algoritmos de Ordenação",
    "content": "Nesta aula vamos aprender sobre Bubble Sort, Quick Sort...",
    "author": "Professora Maria",
    "created_at": "2024-03-10T11:00:00.000Z",
    "updated_at": "2024-03-10T11:00:00.000Z"
  }
}
```

#### 4. Atualizar um post

**PUT /posts/:id**

Atualiza um post existente. Requer `title`, `content` e `author` no corpo da requisição.

**Exemplo:**
```bash
curl -X PUT http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introdução ao JavaScript - Atualizado",
    "content": "JavaScript é uma linguagem de programação versátil...",
    "author": "Professor Silva"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Post atualizado com sucesso",
  "data": {
    "id": 1,
    "title": "Introdução ao JavaScript - Atualizado",
    "content": "JavaScript é uma linguagem de programação versátil...",
    "author": "Professor Silva",
    "created_at": "2024-03-10T10:00:00.000Z",
    "updated_at": "2024-03-10T12:00:00.000Z"
  }
}
```

#### 5. Excluir um post

**DELETE /posts/:id**

Exclui um post específico pelo ID.

**Exemplo:**
```bash
curl -X DELETE http://localhost:3000/posts/1
```

**Resposta:**
```json
{
  "success": true,
  "message": "Post excluído com sucesso",
  "data": {
    "id": 1,
    "title": "Introdução ao JavaScript - Atualizado",
    "content": "JavaScript é uma linguagem de programação versátil...",
    "author": "Professor Silva",
    "created_at": "2024-03-10T10:00:00.000Z",
    "updated_at": "2024-03-10T12:00:00.000Z"
  }
}
```

#### 6. Buscar posts

**GET /posts/search?q=keyword**

Busca posts que contenham a palavra-chave no título ou conteúdo (case-insensitive).

**Exemplo:**
```bash
curl http://localhost:3000/posts/search?q=JavaScript
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Introdução ao JavaScript",
      "content": "JavaScript é uma linguagem de programação...",
      "author": "Professor Silva",
      "created_at": "2024-03-10T10:00:00.000Z",
      "updated_at": "2024-03-10T10:00:00.000Z"
    }
  ],
  "count": 1,
  "keyword": "JavaScript"
}
```

### Códigos de Status HTTP

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Post criado com sucesso
- `400 Bad Request` - Dados inválidos ou faltando
- `404 Not Found` - Post não encontrado
- `500 Internal Server Error` - Erro no servidor

---

## Coleção do Postman

Para facilitar o teste da API, disponibilizamos uma coleção completa do Postman com todos os endpoints documentados.

### Arquivos Disponíveis

- `Blogging_Platform_API.postman_collection.json` - Coleção completa com todos os endpoints
- `Blogging_Platform_API.postman_environment.json` - Variáveis de ambiente
- `POSTMAN_GUIDE.md` - Guia detalhado de uso

### Como Importar

1. Abra o Postman
2. Clique em **Import** (canto superior esquerdo)
3. Selecione o arquivo `Blogging_Platform_API.postman_collection.json`
4. (Opcional) Importe também o arquivo de ambiente `Blogging_Platform_API.postman_environment.json`

### Recursos da Coleção

- ✅ Todos os endpoints documentados
- ✅ Exemplos de requisições e respostas
- ✅ Testes automatizados para cada endpoint
- ✅ Variáveis de ambiente configuradas
- ✅ Descrições detalhadas de cada endpoint
- ✅ Salvamento automático do ID do último post criado

Para mais detalhes, consulte o [Guia do Postman](POSTMAN_GUIDE.md).

---

## Testes

O projeto inclui testes unitários com Jest e Supertest, garantindo cobertura mínima de 20%.

### Executar os testes

```bash
# Executar todos os testes com cobertura
npm test

# Executar testes em modo watch
npm run test:watch
```

### Relatório de Cobertura

Após executar `npm test`, um relatório de cobertura será gerado na pasta `coverage/`.

Para visualizar o relatório HTML:
```bash
open coverage/lcov-report/index.html
```

### Testes Implementados

- ✅ GET / - Informações da API
- ✅ GET /health - Health check
- ✅ GET /posts - Listar todos os posts
- ✅ GET /posts/:id - Obter post específico
- ✅ POST /posts - Criar novo post
- ✅ PUT /posts/:id - Atualizar post
- ✅ DELETE /posts/:id - Excluir post
- ✅ GET /posts/search - Buscar posts
- ✅ 404 Handler - Endpoints inexistentes
- ✅ Validações de campos obrigatórios
- ✅ Tratamento de erros

---

## Docker

### Estrutura do Docker

O projeto utiliza dois containers:

1. **blogging-db** - PostgreSQL 15 Alpine
   - Porta: 5432
   - Volume persistente para dados
   - Healthcheck configurado

2. **blogging-api** - Node.js 18 Alpine
   - Porta: 3000
   - Aguarda banco estar saudável antes de iniciar
   - Auto-restart habilitado

### Comandos Úteis

```bash
# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Parar e remover volumes (limpa o banco de dados)
docker-compose down -v

# Reconstruir imagens
docker-compose up -d --build

# Acessar o container da API
docker exec -it blogging-api sh

# Acessar o PostgreSQL
docker exec -it blogging-db psql -U postgres -d blogging_platform
```

### Verificar Status

```bash
docker-compose ps
```

Saída esperada:
```
NAME             IMAGE                COMMAND                  SERVICE   CREATED         STATUS                   PORTS
blogging-api     fullstackpos-api     "docker-entrypoint.s…"   api       2 minutes ago   Up 2 minutes             0.0.0.0:3000->3000/tcp
blogging-db      postgres:15-alpine   "docker-entrypoint.s…"   db        2 minutes ago   Up 2 minutes (healthy)   0.0.0.0:5432->5432/tcp
```

---

## Desafios e Experiências

### Desafios Enfrentados

1. **Configuração do PostgreSQL com Docker**
   - **Desafio:** Garantir que o banco de dados estivesse completamente inicializado antes da API tentar conectar.
   - **Solução:** Implementamos um healthcheck no container PostgreSQL e configuramos a API para depender dessa verificação.

2. **Criação Automática do Schema**
   - **Desafio:** Garantir que a tabela `posts` fosse criada automaticamente na primeira execução.
   - **Solução:** Criamos a função `initDatabase()` que é executada ao iniciar o servidor.

3. **Testes com Banco de Dados**
   - **Desafio:** Testar os endpoints sem depender de um banco de dados real.
   - **Solução:** Utilizamos mocks do Jest para simular as queries do PostgreSQL.

4. **Busca Case-Insensitive**
   - **Desafio:** Implementar busca que ignore maiúsculas e minúsculas.
   - **Solução:** Utilizamos o operador `ILIKE` do PostgreSQL.

5. **Ordem das Rotas**
   - **Desafio:** A rota `/posts/search` estava sendo capturada por `/posts/:id`.
   - **Solução:** Colocamos a rota de busca antes da rota dinâmica `:id`.

### Aprendizados

- **Arquitetura em Camadas:** A separação clara entre models, controllers e routes facilitou muito a manutenção e os testes.
- **Docker Compose:** Simplificou drasticamente o setup do ambiente, permitindo que qualquer pessoa rode o projeto com um único comando.
- **Testes Automatizados:** A cobertura de testes nos deu confiança para fazer mudanças sem quebrar funcionalidades existentes.
- **PostgreSQL vs NoSQL:** Para este caso de uso (blog posts), o PostgreSQL foi uma excelente escolha pela estrutura relacional clara.

### Próximos Passos

Se fôssemos continuar o desenvolvimento, as próximas funcionalidades seriam:

- Autenticação e autorização (JWT)
- Sistema de comentários nos posts
- Categorias e tags para posts
- Upload de imagens
- Paginação nos endpoints de listagem
- Cache com Redis
- Rate limiting
- Logs estruturados

---

## Equipe

Desenvolvido como parte do Tech Challenge - Fase 02

---

## Licença

Este projeto está sob a licença MIT.
