import api from "../api/axios";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, updateCart, removeCart } = useCart();

  const handleCheckout = async () => {
    try {
      const res = await api.post("/order/checkout");
      console.log("Checkout berhasil:", res.data);
      // Redirect atau tampilkan success message
    } catch (error) {
      console.error("Checkout gagal:", error.response?.data?.message);
    }
  };

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
          <p>Rp {item.price}</p>
          <button onClick={() => removeCart(item.id)}>Remove</button>
        </div>
      ))}

      <button disabled={!cart.length} onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
}

export default Cart;
