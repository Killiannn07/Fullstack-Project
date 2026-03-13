import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { formatCurrencyRp } from "../utils/formatCurrency";

function Orders() {
  const { user } = useContext(AuthContext);

  const [orders, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.get(`/order/${user.id}`);
      setOrder(res.data.data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return null || <p>Loading...</p>;
  }
  if (!orders.length) {
    return <p>No orders yet</p>;
  }

  return (
    <div>
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div key={order.id}>
          <p>Order #{order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: {formatCurrencyRp(order.total_price)}</p>

          <Link to={`/orders/${order.id}`}>Detail</Link>
        </div>
      ))}
    </div>
  );
}

export default Orders
