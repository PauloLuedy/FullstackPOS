const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
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
app.use('/auth', authRoutes);
app.use('/teachers', teacherRoutes);
app.use('/students', studentRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bem-vindo à API de Blogging para Professores',
    version: '1.0.0',
    endpoints: {
      'GET /health': 'Verificar status da API',
      'GET /posts': 'Listar todos os posts',
      'GET /posts/:id': 'Obter um post específico',
      'POST /posts': 'Criar um novo post (autenticado)',
      'PUT /posts/:id': 'Atualizar um post (autenticado)',
      'DELETE /posts/:id': 'Excluir um post (autenticado)',
      'GET /posts/search?q=keyword': 'Buscar posts por palavra-chave',
      'POST /auth/login': 'Autenticar professor',
      'GET /teachers': 'Listar professores paginado (autenticado)',
      'GET /teachers/:id': 'Obter um professor específico (autenticado)',
      'POST /teachers': 'Cadastrar um professor (autenticado)',
      'PUT /teachers/:id': 'Atualizar um professor (autenticado)',
      'DELETE /teachers/:id': 'Excluir um professor (autenticado)',
      'GET /students': 'Listar alunos paginado (autenticado)',
      'GET /students/:id': 'Obter um aluno específico (autenticado)',
      'POST /students': 'Cadastrar um aluno (autenticado)',
      'PUT /students/:id': 'Atualizar um aluno (autenticado)',
      'DELETE /students/:id': 'Excluir um aluno (autenticado)'
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
