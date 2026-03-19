# Próximos Passos para Executar a API

## Status Atual

✅ **Concluído:**
- Dependências instaladas (394 pacotes)
- Testes unitários executados com sucesso
- **76.85% de cobertura de código** (requisito: 20%)
- 17 testes passando

⚠️ **Pendente:**
- Iniciar banco de dados PostgreSQL
- Iniciar servidor da API
- Testar API em execução

---

## Opção 1: Docker (RECOMENDADO)

Esta é a forma mais simples e rápida.

### Passos:

1. **Abra o Docker Desktop**
   - Se não tiver instalado, baixe em: https://www.docker.com/products/docker-desktop

2. **Aguarde o Docker iniciar completamente**
   - Verifique o ícone do Docker na barra de tarefas
   - Quando o ícone ficar estável, está pronto

3. **Execute no terminal:**
   ```bash
   cd /Users/pauloluedy/Documents/FullStackPos
   docker-compose up -d
   ```

4. **Aguarde os containers iniciarem (30-60 segundos)**

5. **Verifique se está funcionando:**
   ```bash
   curl http://localhost:3000/health
   ```

6. **Execute o teste da API:**
   ```bash
   ./test-api.sh
   ```

### Comandos Úteis Docker:

```bash
# Ver logs da API
docker-compose logs -f api

# Ver status dos containers
docker-compose ps

# Parar containers
docker-compose down

# Reiniciar containers
docker-compose restart
```

---

## Opção 2: PostgreSQL Local

Se preferir não usar Docker:

### Passos:

1. **Instalar PostgreSQL via Homebrew:**
   ```bash
   brew install postgresql@15
   ```

2. **Iniciar o serviço:**
   ```bash
   brew services start postgresql@15
   ```

3. **Criar o banco de dados:**
   ```bash
   psql postgres -c "CREATE DATABASE blogging_platform;"
   ```

4. **Iniciar a API:**
   ```bash
   npm run dev
   ```

5. **Em outro terminal, testar:**
   ```bash
   curl http://localhost:3000/health
   ./test-api.sh
   ```

---

## Após Iniciar a API

### 1. Verificar saúde da API:
```bash
curl http://localhost:3000/health
```

### 2. Criar seu primeiro post:
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meu Primeiro Post",
    "content": "Este é o conteúdo do meu primeiro post sobre programação!",
    "author": "Paulo Luedy"
  }'
```

### 3. Listar todos os posts:
```bash
curl http://localhost:3000/posts
```

### 4. Buscar posts:
```bash
curl "http://localhost:3000/posts/search?q=programação"
```

### 5. Executar teste completo da API:
```bash
./test-api.sh
```

---

## Solução de Problemas

### Erro: "porta 3000 já está em uso"
```bash
# Descubra qual processo está usando a porta
lsof -ti:3000

# Mate o processo
kill -9 $(lsof -ti:3000)
```

### Erro: "não consegue conectar ao banco de dados"
```bash
# Docker: Verifique se os containers estão rodando
docker-compose ps

# Local: Verifique se PostgreSQL está rodando
pg_isready
```

### Ver logs de erro da API:
```bash
# Docker
docker-compose logs -f api

# Local
# Os logs aparecerão no terminal onde você executou npm run dev
```

---

## Estrutura de Diretórios

```
FullStackPos/
├── src/              # Código fonte da API
├── tests/            # Testes unitários
├── coverage/         # Relatório de cobertura (gerado após npm test)
├── README.md         # Documentação completa
├── SETUP.md          # Guia de setup
├── API_EXAMPLES.md   # Exemplos de uso da API
├── test-api.sh       # Script de teste automatizado
└── docker-compose.yml # Configuração Docker
```

---

## Comandos Rápidos de Referência

```bash
# Testes
npm test                    # Executar testes unitários
npm run test:watch          # Testes em modo watch

# Desenvolvimento Local
npm run dev                 # Iniciar com hot reload
npm start                   # Iniciar em produção

# Docker
docker-compose up -d        # Iniciar containers
docker-compose down         # Parar containers
docker-compose logs -f api  # Ver logs
docker-compose ps           # Ver status

# API
curl http://localhost:3000/health           # Health check
curl http://localhost:3000/posts            # Listar posts
./test-api.sh                               # Teste completo
```

---

## O Que Fazer Agora?

**Escolha UMA das opções abaixo e execute:**

### Se você tem Docker Desktop instalado:
```bash
# 1. Abra o Docker Desktop e aguarde iniciar
# 2. Execute:
docker-compose up -d
# 3. Aguarde 30 segundos
# 4. Teste:
curl http://localhost:3000/health
./test-api.sh
```

### Se você NÃO tem Docker:
```bash
# 1. Instale PostgreSQL:
brew install postgresql@15

# 2. Inicie o serviço:
brew services start postgresql@15

# 3. Crie o banco:
psql postgres -c "CREATE DATABASE blogging_platform;"

# 4. Inicie a API:
npm run dev

# 5. Em outro terminal, teste:
curl http://localhost:3000/health
./test-api.sh
```

---

## Precisa de Ajuda?

- Consulte o **README.md** para documentação completa
- Veja **API_EXAMPLES.md** para exemplos de uso
- Leia **SETUP.md** para guia de instalação detalhado
