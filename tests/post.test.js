const request = require('supertest');
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

describe('API de Blogging - Testes de Endpoints', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('deve retornar informações da API', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Bem-vindo');
    });
  });

  describe('GET /health', () => {
    it('deve retornar status de saúde da API', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('funcionando');
    });
  });

  describe('GET /posts', () => {
    it('deve retornar todos os posts', async () => {
      const mockPosts = [
        { id: 1, title: 'Post 1', content: 'Conteúdo 1', author: 'Autor 1' },
        { id: 2, title: 'Post 2', content: 'Conteúdo 2', author: 'Autor 2' }
      ];

      pool.query.mockResolvedValue({ rows: mockPosts });

      const response = await request(app).get('/posts');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockPosts);
      expect(response.body.count).toBe(2);
    });

    it('deve retornar array vazio quando não houver posts', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/posts');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });
  });

  describe('GET /posts/:id', () => {
    it('deve retornar um post específico', async () => {
      const mockPost = {
        id: 1,
        title: 'Post 1',
        content: 'Conteúdo 1',
        author: 'Autor 1'
      };

      pool.query.mockResolvedValue({ rows: [mockPost] });

      const response = await request(app).get('/posts/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockPost);
    });

    it('deve retornar 404 quando post não for encontrado', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/posts/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('não encontrado');
    });
  });

  describe('POST /posts', () => {
    it('deve criar um novo post', async () => {
      const newPost = {
        title: 'Novo Post',
        content: 'Conteúdo do novo post',
        author: 'Professor Silva'
      };

      const mockCreatedPost = { id: 1, ...newPost };
      pool.query.mockResolvedValue({ rows: [mockCreatedPost] });

      const response = await request(app)
        .post('/posts')
        .send(newPost);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('criado');
      expect(response.body.data).toEqual(mockCreatedPost);
    });

    it('deve retornar 400 quando campos obrigatórios estão faltando', async () => {
      const response = await request(app)
        .post('/posts')
        .send({ title: 'Título sem conteúdo' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('obrigatórios');
    });
  });

  describe('PUT /posts/:id', () => {
    it('deve atualizar um post existente', async () => {
      const updatedData = {
        title: 'Post Atualizado',
        content: 'Conteúdo atualizado',
        author: 'Professor Silva'
      };

      const mockUpdatedPost = { id: 1, ...updatedData };
      pool.query.mockResolvedValue({ rows: [mockUpdatedPost] });

      const response = await request(app)
        .put('/posts/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('atualizado');
      expect(response.body.data).toEqual(mockUpdatedPost);
    });

    it('deve retornar 404 ao tentar atualizar post inexistente', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/posts/999')
        .send({
          title: 'Título',
          content: 'Conteúdo',
          author: 'Autor'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar 400 quando campos obrigatórios estão faltando', async () => {
      const response = await request(app)
        .put('/posts/1')
        .send({ title: 'Apenas título' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /posts/:id', () => {
    it('deve excluir um post existente', async () => {
      const mockDeletedPost = {
        id: 1,
        title: 'Post para deletar',
        content: 'Conteúdo',
        author: 'Autor'
      };

      pool.query.mockResolvedValue({ rows: [mockDeletedPost] });

      const response = await request(app).delete('/posts/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('excluído');
    });

    it('deve retornar 404 ao tentar excluir post inexistente', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/posts/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /posts/search', () => {
    it('deve buscar posts por palavra-chave', async () => {
      const mockPosts = [
        { id: 1, title: 'JavaScript Avançado', content: 'Conteúdo sobre JS', author: 'Prof. Silva' }
      ];

      pool.query.mockResolvedValue({ rows: mockPosts });

      const response = await request(app).get('/posts/search?q=JavaScript');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockPosts);
      expect(response.body.keyword).toBe('JavaScript');
    });

    it('deve retornar 400 quando parâmetro q está faltando', async () => {
      const response = await request(app).get('/posts/search');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('obrigatório');
    });

    it('deve retornar array vazio quando nenhum post for encontrado', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/posts/search?q=inexistente');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
    });
  });

  describe('404 Handler', () => {
    it('deve retornar 404 para endpoints inexistentes', async () => {
      const response = await request(app).get('/endpoint-inexistente');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('não encontrado');
    });
  });
});
