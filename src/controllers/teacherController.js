const Teacher = require('../models/Teacher');

class TeacherController {
  static async getAllTeachers(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const [teachers, total] = await Promise.all([
        Teacher.findAll({ page, limit }),
        Teacher.count()
      ]);

      res.status(200).json({
        success: true,
        data: teachers,
        count: teachers.length,
        page,
        totalPages: Math.ceil(total / limit),
        total
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar professores',
        error: error.message
      });
    }
  }

  static async getTeacherById(req, res) {
    try {
      const { id } = req.params;
      const teacher = await Teacher.findById(id);

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Professor não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: teacher
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar professor',
        error: error.message
      });
    }
  }

  static async createTeacher(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nome, email e senha são obrigatórios'
        });
      }

      const teacher = await Teacher.create({ name, email, password });

      res.status(201).json({
        success: true,
        message: 'Professor criado com sucesso',
        data: teacher
      });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Já existe um professor cadastrado com este email'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao criar professor',
        error: error.message
      });
    }
  }

  static async updateTeacher(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Nome e email são obrigatórios'
        });
      }

      const teacher = await Teacher.update(id, { name, email, password });

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Professor não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Professor atualizado com sucesso',
        data: teacher
      });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Já existe um professor cadastrado com este email'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar professor',
        error: error.message
      });
    }
  }

  static async deleteTeacher(req, res) {
    try {
      const { id } = req.params;
      const teacher = await Teacher.delete(id);

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Professor não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Professor excluído com sucesso',
        data: teacher
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir professor',
        error: error.message
      });
    }
  }
}

module.exports = TeacherController;
