const pool = require("../config/db");

async function checkout(userId) {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    console.log("UserId:", userId);
    console.log("Cart item IDs:", cartItemIds);

    //Ambil Cart
    const cartResult = await client.query(
      `SELECT c.id, c.product_id, c.quantity,
      p.price, p.stock, p.name
      FROM cart c
      JOIN products p ON p.id = c.product_id
      WHERE c.user_id = $1 AND c.product_id = ANY($2)
      FOR UPDATE`,
      [userId, cartItemIds],
    );

    console.log("Cart result:", cartResult.rows);

    if (cartResult.rows.length === 0) {
      throw new Error("Cart is empty");
    }

    const cartItems = cartResult.rows;

    //validasi stock
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        throw new Error(`Stock not enough for ${item.name}`);
      }
      
    }

    //Hitung total harga
    let totalPrice = 0;
    for (const item of cartItems) {
      if(!item.price || !item.quantity){
        throw new Error("Invalid cart data");
      }
      totalPrice += item.price * item.quantity;
    }

    //create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, 'pending') RETURNING id`,
      [userId, totalPrice],
    );

    const orderId = orderResult.rows[0].id;

    //insert order_items + update stock
    const values = [];
    const placeholders = [];

    cartItems.forEach((item, index) => {
      const baseIndex = index * 4;

      placeholders.push(
        `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`,
      );

      values.push(orderId, item.product_id, item.quantity, item.price);
    });

    await client.query(
      `
      INSERT INTO order_items
      (order_id, product_id, quantity, price_at_purchase)
      VALUES ${placeholders.join(",")}
      `,
      values,
    );

    const stockCase = cartItems
      .map((item) => `WHEN ${item.product_id} THEN stock - ${item.quantity}`)
      .join(" ");

    const ids = cartItems.map((i) => i.product_id).join(",");

    await client.query(`
      UPDATE products
      SET stock = CASE id
        ${stockCase}
      END
      WHERE id IN (${ids})
    `);

    //Hapus cart
    await client.query(`DELETE FROM cart WHERE user_id = $1 AND product_id = ANY($2)`, [userId, cartItemIds]);

    await client.query("COMMIT");

    return { success: true, orderId };
  } catch (error) {
    console.error("Service error:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getOrdersByUser(userId) {
  const result = await pool.query(
    `
    SELECT 
      o.id,
      o.status,
      o.created_at,
      COUNT(oi.id) AS total_items,
      SUM(oi.quantity * oi.price_at_purchase) AS total_price
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
    `,
    [userId],
  );

  return result.rows;
}

async function getOrderDetail(orderId, userId) {
  const result = await pool.query(
    `
    SELECT 
      o.id AS order_id,
      o.status,
      o.created_at,
      oi.product_id,
      oi.quantity,
      oi.price_at_purchase,
      p.name
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id
    WHERE o.id = $1 AND o.user_id = $2
    `,
    [orderId, userId],
  );
  return result.rows;
}

async function updateOrderStatus(orderId, newStatus) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `SELECT status FROM orders WHERE id = $1 FOR UPDATE`,
      [orderId],
    );

    if (result.rows.length === 0) {
      throw new Error("Order not found");
    }

    const currentStatus = result.rows[0].status;

    const allowedTransitions = {
      pending: "on_delivery",
      on_delivery: "complete",
    };

    if (allowedTransitions[currentStatus] !== newStatus) {
      throw new Error("Invalid status transition");
    }

    await client.query(`UPDATE orders SET status = $1 WHERE id = $2`, [
      newStatus,
      orderId,
    ]);

    await client.query("COMMIT");

    return { message: "Order status updated" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getAllOrders() {
  const result = await pool.query(`
    SELECT 
      o.id,
      o.user_id,
      o.status,
      o.created_at,
      COUNT(oi.id) AS total_items,
      SUM(oi.quantity * oi.price_at_purchase) AS total_price
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `);

  return result.rows;
}


module.exports = { checkout, getOrdersByUser, getOrderDetail, updateOrderStatus, getAllOrders };
