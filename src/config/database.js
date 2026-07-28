const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'blogging_platform',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database schema initialized successfully');

    await seedDefaultTeacher(client);
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  } finally {
    client.release();
  }
};

const seedDefaultTeacher = async (client) => {
  const { rows } = await client.query('SELECT COUNT(*) FROM teachers');

  if (parseInt(rows[0].count, 10) > 0) {
    return;
  }

  const email = process.env.DEFAULT_TEACHER_EMAIL || 'admin@blogging.com';
  const password = process.env.DEFAULT_TEACHER_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  await client.query(
    'INSERT INTO teachers (name, email, password_hash) VALUES ($1, $2, $3)',
    ['Administrador', email, passwordHash]
  );

  console.log(`Professor padrão criado: ${email}`);
};

module.exports = { pool, initDatabase };
