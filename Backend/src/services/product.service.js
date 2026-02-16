const pool = require("../config/db");

async function getProducts(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const result = await pool.query(
    "SELECT * FROM products ORDER BY id ASC LIMIT $1 OFFSET $2",
    [limit, offset],
  );
  const total = await pool.query("SELECT COUNT (*) FROM products");
  return { items: result.rows, total: Number(total.rows[0].count) };
}

async function getProductById(id) {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0];
}

async function createProduct(name, price, stock) {
  const result = await pool.query(
    "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *",
    [name, price, stock],
  );
  return result.rows[0];
}

async function updateProduct(id, data) {
  const existing = await pool.query("SELECT * FROM products WHERE id = $1", [id])
  if(existing.rows.length === 0){
    return null
  }
  const product = existing.rows[0]
  
  const updateName = data.name ?? product.name
  const updatePrice = data.price ?? product.price
  const updtaeStock = data.stock ?? product.stock
  
  const result = await pool.query(
    "UPDATE products SET name = $1, price = $2, stock = $3 WHERE id=$4 RETURNING *",
    [updateName, updatePrice, updtaeStock, id],
  );
  return result.rows[0];
}

async function deleteProduct(id) {
  const result = await pool.query("DELETE FROM products WHERE id=$1 RETURNING *", [id]);
  return result.rows[0];
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
