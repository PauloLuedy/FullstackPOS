const Post = require('../models/Post');

class PostController {
  static async getAllPosts(req, res) {
    try {
      const posts = await Post.findAll();
      res.status(200).json({
        success: true,
        data: posts,
        count: posts.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar posts',
        error: error.message
      });
    }
  }

  static async getPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar post',
        error: error.message
      });
    }
  }

  static async createPost(req, res) {
    try {
      const { title, content, author } = req.body;

      if (!title || !content || !author) {
        return res.status(400).json({
          success: false,
          message: 'Título, conteúdo e autor são obrigatórios'
        });
      }

      const post = await Post.create({ title, content, author });

      res.status(201).json({
        success: true,
        message: 'Post criado com sucesso',
        data: post
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar post',
        error: error.message
      });
    }
  }

  static async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { title, content, author } = req.body;

      if (!title || !content || !author) {
        return res.status(400).json({
          success: false,
          message: 'Título, conteúdo e autor são obrigatórios'
        });
      }

      const post = await Post.update(id, { title, content, author });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Post atualizado com sucesso',
        data: post
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar post',
        error: error.message
      });
    }
  }

  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.delete(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Post excluído com sucesso',
        data: post
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir post',
        error: error.message
      });
    }
  }

  static async searchPosts(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetro de busca "q" é obrigatório'
        });
      }

      const posts = await Post.search(q);

      res.status(200).json({
        success: true,
        data: posts,
        count: posts.length,
        keyword: q
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar posts',
        error: error.message
      });
    }
  }
}

module.exports = PostController;
