const pool = require("../config/db");

async function getAllUsers() {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
  return result.rows[0];
}

async function getUsersById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id= $1", [id]);
  return result.rows[0];
}

async function getUsersByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email= $1", [
    email,
  ]);
  return result.rows[0];
}

async function createUser(email, password) {
  const result = await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
    [email, password],
  );
  return result.rows[0];
}

async function deleteUser(id) {
  const result = await pool.query("DELETE FROM users WHERE id=$1", [id]);
  return result.rows[0];
}

async function updateResetToken(email, resetToken, resetTokenExpiry) {
  const result = await pool.query(
    "UPDATE users SET resetToken = $1, resetTokenExpiry = $2 WHERE email = $3 RETURNING *",
    [resetToken, resetTokenExpiry, email],
  );
  return result.rows[0];
}

async function getUserByResetToken(resetToken) {
  const result = await pool.query(
    "SELECT * FROM users WHERE resetToken = $1 AND resetTokenExpiry > NOW()",
    [resetToken],
  );
  return result.rows[0];
}

async function updatePassword(id, hashedPassword) {
  const result = await pool.query(
    "UPDATE users SET password = $1, resetToken = NULL, resetTokenExpiry = NULL WHERE id = $2 RETURNING *",
    [hashedPassword, id],
  );
  return result.rows[0];
}

module.exports = {
  getAllUsers,
  getUsersByEmail,
  getUsersById,
  createUser,
  deleteUser,
  updateResetToken,
  getUserByResetToken,
  updatePassword,
};
