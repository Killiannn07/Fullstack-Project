import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { formatCurrencyRp } from "../utils/formatCurrency";

function Cart() {
  const { cart, updateCart, removeCart, fetchCart } = useCart();
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const res = await api.post("/order/checkout");
      await fetchCart()
      navigate("/orders")
      console.log("Checkout berhasil:", res.data);
    } catch (error) {
      console.error("Checkout gagal:", error.response?.data?.message);
    }
    finally{
      setLoading(false)
    }
  };

  if (!cart.length) {
    return (
      <div>
        <p>Your cart is empty</p>
        <Link to={"/products"}>Go Shopping</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Cart</h1>

      {cart.map((item) => (
        <div key={item.product_id}>
          <h3>{item.name}</h3>
          <button onClick={() => updateCart(item.id, item.quantity - 1)}>
            {" "}
            -{" "}
          </button>

          <p>Qty: {item.quantity}</p>
          <button onClick={() => updateCart(item.id, item.quantity + 1)}>
            {" "}
            +{" "}
          </button>
          <p>{formatCurrencyRp(item.price)}</p>
          <button onClick={() => removeCart(item.id)}>Remove</button>
        </div>
      ))}

      <button disabled={loading} onClick={handleCheckout}>
        {loading ? "Processing" : "Checkout"}
      </button>
    </div>
    
  );
}

export default Cart;
