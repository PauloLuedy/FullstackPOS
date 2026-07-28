const { pool } = require('../config/database');

class Student {
  static async findAll({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      'SELECT * FROM students ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  static async count() {
    const result = await pool.query('SELECT COUNT(*) FROM students');
    return parseInt(result.rows[0].count, 10);
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM students WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create({ name, email }) {
    const result = await pool.query(
      'INSERT INTO students (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    return result.rows[0];
  }

  static async update(id, { name, email }) {
    const result = await pool.query(
      `UPDATE students
       SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [name, email, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM students WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Student;
