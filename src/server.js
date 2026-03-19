require('dotenv').config();
const app = require('./app');
const { initDatabase } = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`\n Servidor rodando na porta ${PORT}`);
      console.log(` API: http://localhost:${PORT}`);
      console.log(` Health Check: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
