const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const { pool } = require('../src/config/database');

jest.mock('../src/config/database', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn(),
    on: jest.fn()
  },
  initDatabase: jest.fn()
}));

const validToken = jwt.sign(
  { id: 1, email: 'admin@blogging.com', name: 'Administrador' },
  process.env.JWT_SECRET || 'change-me-in-production'
);
const authHeader = `Bearer ${validToken}`;

describe('API de Alunos - Testes de Endpoints', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Autenticação obrigatória', () => {
    it('deve retornar 401 ao acessar /students sem token', async () => {
      const response = await request(app).get('/students');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /students', () => {
    it('deve retornar alunos paginados', async () => {
      const mockStudents = [
        { id: 1, name: 'Aluno João', email: 'joao@aluno.com' },
        { id: 2, name: 'Aluna Ana', email: 'ana@aluno.com' }
      ];

      pool.query
        .mockResolvedValueOnce({ rows: mockStudents })
        .mockResolvedValueOnce({ rows: [{ count: '2' }] });

      const response = await request(app)
        .get('/students?page=1&limit=10')
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockStudents);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(1);
    });
  });

  describe('GET /students/:id', () => {
    it('deve retornar um aluno específico', async () => {
      const mockStudent = { id: 1, name: 'Aluno João', email: 'joao@aluno.com' };
      pool.query.mockResolvedValue({ rows: [mockStudent] });

      const response = await request(app)
        .get('/students/1')
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockStudent);
    });

    it('deve retornar 404 quando aluno não for encontrado', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .get('/students/999')
        .set('Authorization', authHeader);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /students', () => {
    it('deve criar um novo aluno', async () => {
      const newStudent = { name: 'Aluno Novo', email: 'novo@aluno.com' };
      const mockCreated = { id: 3, ...newStudent };

      pool.query.mockResolvedValue({ rows: [mockCreated] });

      const response = await request(app)
        .post('/students')
        .set('Authorization', authHeader)
        .send(newStudent);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockCreated);
    });

    it('deve retornar 400 quando campos obrigatórios estão faltando', async () => {
      const response = await request(app)
        .post('/students')
        .set('Authorization', authHeader)
        .send({ name: 'Sem email' });

      expect(response.status).toBe(400);
    });

    it('deve retornar 400 quando o email já estiver cadastrado', async () => {
      const error = new Error('duplicate key value violates unique constraint');
      error.code = '23505';
      pool.query.mockRejectedValue(error);

      const response = await request(app)
        .post('/students')
        .set('Authorization', authHeader)
        .send({ name: 'Duplicado', email: 'joao@aluno.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Já existe');
    });
  });

  describe('PUT /students/:id', () => {
    it('deve atualizar um aluno existente', async () => {
      const updatedData = { name: 'Aluno Atualizado', email: 'atualizado@aluno.com' };
      const mockUpdated = { id: 1, ...updatedData };

      pool.query.mockResolvedValue({ rows: [mockUpdated] });

      const response = await request(app)
        .put('/students/1')
        .set('Authorization', authHeader)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdated);
    });

    it('deve retornar 404 ao atualizar aluno inexistente', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/students/999')
        .set('Authorization', authHeader)
        .send({ name: 'Nome', email: 'email@aluno.com' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /students/:id', () => {
    it('deve excluir um aluno existente', async () => {
      const mockDeleted = { id: 1, name: 'Aluno João', email: 'joao@aluno.com' };
      pool.query.mockResolvedValue({ rows: [mockDeleted] });

      const response = await request(app)
        .delete('/students/1')
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('deve retornar 404 ao excluir aluno inexistente', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .delete('/students/999')
        .set('Authorization', authHeader);

      expect(response.status).toBe(404);
    });
  });
});
