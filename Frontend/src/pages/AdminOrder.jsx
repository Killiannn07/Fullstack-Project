import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminOrder() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await api.get("/order/admin/all");
    setOrders(res.data.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    await api.patch(`/order/${orderId}/status`, { status });
    fetchOrders();
  };

  const statusColor = {
    pending: "#f59e0b",
    on_delivery: "#3b82f6",
    complete: "#22c55e",
  };

  return (
    <div>
      <h2>Admin Orders</h2>

      {orders.map((o) => (
        <div key={o.id}>
          <p>Order #{o.id}</p>
          <p>User{o.user_id}</p>
          <p>Total: Rp{o.total_price}</p>

          <select
            style={{
              background: statusColor[o.status],
              color: "white",
              padding: "4px 8px",
              borderRadius: "6px",
            }}
            onChange={(e) => updateStatus(o.id, e.target.value)}
          >
            <option>pending</option>
            <option>on_delivery</option>
            <option>complete</option>
          </select>
        </div>
      ))}
    </div>
  );
}
