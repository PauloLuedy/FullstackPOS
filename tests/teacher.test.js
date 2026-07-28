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

describe('API de Professores - Testes de Endpoints', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Autenticação obrigatória', () => {
    it('deve retornar 401 ao acessar /teachers sem token', async () => {
      const response = await request(app).get('/teachers');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /teachers', () => {
    it('deve retornar professores paginados', async () => {
      const mockTeachers = [
        { id: 1, name: 'Professor Silva', email: 'silva@escola.com' },
        { id: 2, name: 'Professora Maria', email: 'maria@escola.com' }
      ];

      pool.query
        .mockResolvedValueOnce({ rows: mockTeachers })
        .mockResolvedValueOnce({ rows: [{ count: '2' }] });

      const response = await request(app)
        .get('/teachers?page=1&limit=10')
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTeachers);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(1);
    });
  });

  describe('GET /teachers/:id', () => {
    it('deve retornar um professor específico', async () => {
      const mockTeacher = { id: 1, name: 'Professor Silva', email: 'silva@escola.com' };
      pool.query.mockResolvedValue({ rows: [mockTeacher] });

      const response = await request(app)
        .get('/teachers/1')
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockTeacher);
    });

    it('deve retornar 404 quando professor não for encontrado', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .get('/teachers/999')
        .set('Authorization', authHeader);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /teachers', () => {
    it('deve criar um novo professor', async () => {
      const newTeacher = { name: 'Professor Novo', email: 'novo@escola.com', password: 'senha123' };
      const mockCreated = { id: 3, name: newTeacher.name, email: newTeacher.email };

      pool.query.mockResolvedValue({ rows: [mockCreated] });

      const response = await request(app)
        .post('/teachers')
        .set('Authorization', authHeader)
        .send(newTeacher);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockCreated);
    });

    it('deve retornar 400 quando campos obrigatórios estão faltando', async () => {
      const response = await request(app)
        .post('/teachers')
        .set('Authorization', authHeader)
        .send({ name: 'Sem email nem senha' });

      expect(response.status).toBe(400);
    });

    it('deve retornar 400 quando o email já estiver cadastrado', async () => {
      const error = new Error('duplicate key value violates unique constraint');
      error.code = '23505';
      pool.query.mockRejectedValue(error);

      const response = await request(app)
        .post('/teachers')
        .set('Authorization', authHeader)
        .send({ name: 'Duplicado', email: 'silva@escola.com', password: 'senha123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Já existe');
    });
  });

  describe('PUT /teachers/:id', () => {
    it('deve atualizar um professor existente', async () => {
      const updatedData = { name: 'Professor Atualizado', email: 'atualizado@escola.com' };
      const mockUpdated = { id: 1, ...updatedData };

      pool.query.mockResolvedValue({ rows: [mockUpdated] });

      const response = await request(app)
        .put('/teachers/1')
        .set('Authorization', authHeader)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdated);
    });

    it('deve retornar 404 ao atualizar professor inexistente', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/teachers/999')
        .set('Authorization', authHeader)
        .send({ name: 'Nome', email: 'email@escola.com' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /teachers/:id', () => {
    it('deve excluir um professor existente', async () => {
      const mockDeleted = { id: 1, name: 'Professor Silva', email: 'silva@escola.com' };
      pool.query.mockResolvedValue({ rows: [mockDeleted] });

      const response = await request(app)
        .delete('/teachers/1')
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('deve retornar 404 ao excluir professor inexistente', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .delete('/teachers/999')
        .set('Authorization', authHeader);

      expect(response.status).toBe(404);
    });
  });
});
