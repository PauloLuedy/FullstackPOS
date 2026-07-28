const Student = require('../models/Student');

class StudentController {
  static async getAllStudents(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const [students, total] = await Promise.all([
        Student.findAll({ page, limit }),
        Student.count()
      ]);

      res.status(200).json({
        success: true,
        data: students,
        count: students.length,
        page,
        totalPages: Math.ceil(total / limit),
        total
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar alunos',
        error: error.message
      });
    }
  }

  static async getStudentById(req, res) {
    try {
      const { id } = req.params;
      const student = await Student.findById(id);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Aluno não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: student
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar aluno',
        error: error.message
      });
    }
  }

  static async createStudent(req, res) {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Nome e email são obrigatórios'
        });
      }

      const student = await Student.create({ name, email });

      res.status(201).json({
        success: true,
        message: 'Aluno criado com sucesso',
        data: student
      });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Já existe um aluno cadastrado com este email'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao criar aluno',
        error: error.message
      });
    }
  }

  static async updateStudent(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Nome e email são obrigatórios'
        });
      }

      const student = await Student.update(id, { name, email });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Aluno não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Aluno atualizado com sucesso',
        data: student
      });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Já existe um aluno cadastrado com este email'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar aluno',
        error: error.message
      });
    }
  }

  static async deleteStudent(req, res) {
    try {
      const { id } = req.params;
      const student = await Student.delete(id);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Aluno não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Aluno excluído com sucesso',
        data: student
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir aluno',
        error: error.message
      });
    }
  }
}

module.exports = StudentController;
