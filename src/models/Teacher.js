const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const PUBLIC_FIELDS = 'id, name, email, created_at, updated_at';

class Teacher {
  static async findAll({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT ${PUBLIC_FIELDS} FROM teachers ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async count() {
    const result = await pool.query('SELECT COUNT(*) FROM teachers');
    return parseInt(result.rows[0].count, 10);
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT ${PUBLIC_FIELDS} FROM teachers WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM teachers WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async create({ name, email, password }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO teachers (name, email, password_hash) VALUES ($1, $2, $3) RETURNING ${PUBLIC_FIELDS}`,
      [name, email, passwordHash]
    );
    return result.rows[0];
  }

  static async update(id, { name, email, password }) {
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      const result = await pool.query(
        `UPDATE teachers
         SET name = $1, email = $2, password_hash = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING ${PUBLIC_FIELDS}`,
        [name, email, passwordHash, id]
      );
      return result.rows[0];
    }

    const result = await pool.query(
      `UPDATE teachers
       SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING ${PUBLIC_FIELDS}`,
      [name, email, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM teachers WHERE id = $1 RETURNING ${PUBLIC_FIELDS}`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Teacher;
