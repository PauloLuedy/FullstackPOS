const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      const teacher = await Teacher.findByEmail(email);

      if (!teacher) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      const passwordMatches = await bcrypt.compare(password, teacher.password_hash);

      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      const token = jwt.sign(
        { id: teacher.id, email: teacher.email, name: teacher.name },
        process.env.JWT_SECRET || 'change-me-in-production',
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );

      res.status(200).json({
        success: true,
        data: {
          token,
          teacher: {
            id: teacher.id,
            name: teacher.name,
            email: teacher.email
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao efetuar login',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
