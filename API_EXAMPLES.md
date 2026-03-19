# Exemplos de Uso da API

Este documento contém exemplos práticos de como usar todos os endpoints da API.

## Configuração Base

URL Base: `http://localhost:3000`

## 1. Health Check

### Verificar se a API está funcionando

```bash
curl http://localhost:3000/health
```

**Resposta:**
```json
{
  "success": true,
  "message": "API de Blogging está funcionando!",
  "timestamp": "2024-03-10T12:00:00.000Z"
}
```

## 2. Criar Posts

### Criar post sobre JavaScript

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introdução ao JavaScript",
    "content": "JavaScript é uma linguagem de programação versátil usada tanto no frontend quanto no backend. Nesta aula, vamos aprender os conceitos básicos.",
    "author": "Professor João Silva"
  }'
```

### Criar post sobre Python

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python para Iniciantes",
    "content": "Python é uma linguagem excelente para começar a programar. Vamos explorar variáveis, loops e funções.",
    "author": "Professora Maria Santos"
  }'
```

### Criar post sobre Banco de Dados

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "SQL - Consultas Básicas",
    "content": "Aprenda a fazer consultas SQL com SELECT, WHERE, JOIN e muito mais. Essencial para trabalhar com bancos de dados.",
    "author": "Professor Carlos Oliveira"
  }'
```

## 3. Listar Posts

### Listar todos os posts

```bash
curl http://localhost:3000/posts
```

### Listar todos os posts (formatado)

```bash
curl http://localhost:3000/posts | json_pp
```

## 4. Obter Post Específico

### Obter o post com ID 1

```bash
curl http://localhost:3000/posts/1
```

### Obter o post com ID 2 (formatado)

```bash
curl http://localhost:3000/posts/2 | json_pp
```

## 5. Atualizar Posts

### Atualizar título e conteúdo do post 1

```bash
curl -X PUT http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Avançado - ES6+",
    "content": "Nesta aula atualizada, vamos explorar recursos modernos do JavaScript como arrow functions, promises, async/await e muito mais.",
    "author": "Professor João Silva"
  }'
```

## 6. Buscar Posts

### Buscar posts que contenham "JavaScript"

```bash
curl "http://localhost:3000/posts/search?q=JavaScript"
```

### Buscar posts que contenham "Python"

```bash
curl "http://localhost:3000/posts/search?q=Python"
```

### Buscar posts que contenham "SQL"

```bash
curl "http://localhost:3000/posts/search?q=SQL"
```

### Buscar posts por autor (conteúdo)

```bash
curl "http://localhost:3000/posts/search?q=Maria"
```

## 7. Deletar Posts

### Deletar o post com ID 1

```bash
curl -X DELETE http://localhost:3000/posts/1
```

### Deletar o post com ID 2

```bash
curl -X DELETE http://localhost:3000/posts/2
```

## 8. Testes de Erro

### Tentar criar post sem título (deve retornar erro 400)

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Conteúdo sem título",
    "author": "Professor Teste"
  }'
```

### Tentar acessar post inexistente (deve retornar erro 404)

```bash
curl http://localhost:3000/posts/9999
```

### Buscar sem parâmetro q (deve retornar erro 400)

```bash
curl http://localhost:3000/posts/search
```

## 9. Usando Postman ou Insomnia

### Importar Collection

Se você usa Postman ou Insomnia, pode importar os exemplos acima criando requests com:

**Base URL:** `http://localhost:3000`

**Headers para POST/PUT:**
```
Content-Type: application/json
```

**Body para criar post:**
```json
{
  "title": "Título do Post",
  "content": "Conteúdo completo do post...",
  "author": "Nome do Professor"
}
```

## 10. Fluxo Completo de Teste

Execute este script para testar todo o fluxo:

```bash
#!/bin/bash

echo "1. Verificando saúde da API..."
curl http://localhost:3000/health
echo -e "\n\n"

echo "2. Criando 3 posts..."
curl -X POST http://localhost:3000/posts -H "Content-Type: application/json" -d '{"title":"JavaScript Básico","content":"Aprenda JavaScript do zero","author":"Prof. João"}'
echo -e "\n"
curl -X POST http://localhost:3000/posts -H "Content-Type: application/json" -d '{"title":"Python Básico","content":"Aprenda Python do zero","author":"Prof. Maria"}'
echo -e "\n"
curl -X POST http://localhost:3000/posts -H "Content-Type: application/json" -d '{"title":"SQL Básico","content":"Aprenda SQL do zero","author":"Prof. Carlos"}'
echo -e "\n\n"

echo "3. Listando todos os posts..."
curl http://localhost:3000/posts
echo -e "\n\n"

echo "4. Buscando posts com 'JavaScript'..."
curl "http://localhost:3000/posts/search?q=JavaScript"
echo -e "\n\n"

echo "5. Atualizando o post 1..."
curl -X PUT http://localhost:3000/posts/1 -H "Content-Type: application/json" -d '{"title":"JavaScript Avançado","content":"Aprenda recursos avançados","author":"Prof. João"}'
echo -e "\n\n"

echo "6. Obtendo o post 1 atualizado..."
curl http://localhost:3000/posts/1
echo -e "\n\n"

echo "Testes concluídos!"
```

Salve como `test-api.sh`, dê permissão de execução e execute:

```bash
chmod +x test-api.sh
./test-api.sh
```
