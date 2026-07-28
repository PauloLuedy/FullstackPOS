const request = require('supertest');
const bcrypt = require('bcryptjs');
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

describe('API de Autenticação - Testes de Endpoints', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('deve autenticar um professor com credenciais válidas', async () => {
      const passwordHash = await bcrypt.hash('senha123', 10);
      const mockTeacher = {
        id: 1,
        name: 'Professor Silva',
        email: 'silva@escola.com',
        password_hash: passwordHash
      };

      pool.query.mockResolvedValue({ rows: [mockTeacher] });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'silva@escola.com', password: 'senha123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.teacher.email).toBe('silva@escola.com');
      expect(response.body.data.teacher.password_hash).toBeUndefined();
    });

    it('deve retornar 401 quando a senha estiver incorreta', async () => {
      const passwordHash = await bcrypt.hash('senha123', 10);
      const mockTeacher = {
        id: 1,
        name: 'Professor Silva',
        email: 'silva@escola.com',
        password_hash: passwordHash
      };

      pool.query.mockResolvedValue({ rows: [mockTeacher] });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'silva@escola.com', password: 'senhaErrada' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar 401 quando o professor não existir', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'inexistente@escola.com', password: 'senha123' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar 400 quando email ou senha estiverem faltando', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'silva@escola.com' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('obrigatórios');
    });
  });
});
