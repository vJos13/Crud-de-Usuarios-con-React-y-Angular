const { sql, poolPromise } = require('../config/db');

// Todas las consultas usan parámetros (@name, @email, @id)
// para evitar inyección SQL.

async function findAll() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT id, name, email, created_at FROM Users ORDER BY id');
  return result.recordset;
}

async function findById(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT id, name, email, created_at FROM Users WHERE id = @id');
  return result.recordset[0];
}

async function create({ name, email }) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('name', sql.NVarChar(100), name)
    .input('email', sql.NVarChar(150), email)
    .query(`INSERT INTO Users (name, email)
            OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.created_at
            VALUES (@name, @email)`);
  return result.recordset[0];
}

async function update(id, { name, email }) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('name', sql.NVarChar(100), name)
    .input('email', sql.NVarChar(150), email)
    .query(`UPDATE Users SET name = @name, email = @email
            OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.created_at
            WHERE id = @id`);
  return result.recordset[0];
}

async function remove(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM Users WHERE id = @id');
  return result.rowsAffected[0] > 0;
}

module.exports = { findAll, findById, create, update, remove };
