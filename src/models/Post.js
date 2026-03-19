const { pool } = require('../config/database');

class Post {
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(postData) {
    const { title, content, author } = postData;
    const result = await pool.query(
      'INSERT INTO posts (title, content, author) VALUES ($1, $2, $3) RETURNING *',
      [title, content, author]
    );
    return result.rows[0];
  }

  static async update(id, postData) {
    const { title, content, author } = postData;
    const result = await pool.query(
      `UPDATE posts
       SET title = $1, content = $2, author = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [title, content, author, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async search(keyword) {
    const result = await pool.query(
      `SELECT * FROM posts
       WHERE title ILIKE $1 OR content ILIKE $1
       ORDER BY created_at DESC`,
      [`%${keyword}%`]
    );
    return result.rows;
  }
}

module.exports = Post;
