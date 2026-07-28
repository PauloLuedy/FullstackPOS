const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticação não fornecido'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me-in-production');
    req.teacher = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticação inválido ou expirado'
    });
  }
};

module.exports = authenticate;
