const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de Blogging está funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.use('/posts', postRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bem-vindo à API de Blogging para Professores',
    version: '1.0.0',
    endpoints: {
      'GET /health': 'Verificar status da API',
      'GET /posts': 'Listar todos os posts',
      'GET /posts/:id': 'Obter um post específico',
      'POST /posts': 'Criar um novo post',
      'PUT /posts/:id': 'Atualizar um post',
      'DELETE /posts/:id': 'Excluir um post',
      'GET /posts/search?q=keyword': 'Buscar posts por palavra-chave'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado'
  });
});

app.use(errorHandler);

module.exports = app;
