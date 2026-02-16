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
      "UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3",
      [quantity, userId, productId],
    );
    return update.rows[0];
  }

  const result = await pool.query(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES $1, $2, $3 RETURNING *"[
      (userId, productId, quantity)
    ],
  );
  return result.rows[0]
}
