const pool = require("../config/db");

async function addToCart(userId, productId, quantity) {
  const product = await pool.query(
    "SELECT id, stock FROM products WHERE id = $1",
    [productId],
  );

  if (product.rows.length === 0) {
    throw { status: 404, message: "Product not found" };
  }

  if (quantity > product.rows[0].stock) {
    throw { status: 400, message: "Stock not enough" };
  }

  const existing = await pool.query(
    "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
    [userId, productId],
  );

  if (existing.rows.length > 0) {
    const update = await pool.query(
      `UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *`,
      [quantity, userId, productId],
    );
    return update.rows[0];
  }

  const result = await pool.query(
    `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`,
    [userId, productId, quantity],
  );
  return result.rows[0];
}

async function getCartByUser(userId) {
  const result = await pool.query(
    `SELECT c.id,
     c.quantity,
     p.id AS product_id,
     p.name,
     p.price,
     p.stock, 
     c.created_at
     FROM cart c JOIN products p ON c.product_id = p.id
     WHERE c.user_id = $1
     ORDER BY c.created_at ASC`,
    [userId],
  );
  return result.rows;
}

async function updateCart(userId, cartId, quantity) {
  const result = await pool.query(
    `SELECT c.*, p.stock FROM cart c 
    JOIN products p ON c.product_id = p.id WHERE c.id = $1 AND c.user_id = $2`,
    [cartId, userId],
  );
  if (result.rows.length === 0) {
    throw { status: 404, message: "Cart item not found" };
  }
  const cartItem = result.rows[0];

  if (quantity <= 0) {
    throw { status: 400, message: "Quantity must be greater than 0" };
  }

  if (quantity > cartItem.stock) {
    throw { status: 400, message: "Stock not enough" };
  }

  const update = await pool.query(
    `UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *`,
    [quantity, cartId],
  );

  return update.rows[0];
}

async function deleteCart(userId, cartId) {
  const result = await pool.query(`DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *`, [cartId, userId])

  if (result.rows.length === 0) {
    throw {status: 404, message: "Cart item not found"}
  }
  return result.rows[0]
}
module.exports = { addToCart, getCartByUser, updateCart, deleteCart };
