import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";

export default function Cart() {
  const { cart, updateCart, removeCart, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await api.post("/order/checkout");
      await fetchCart();
      navigate("/orders");
      console.log("Checkout berhasil:", res.data);
    } catch (error) {
      console.error("Checkout gagal:", error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  if (!cart.length) {
    return (
      <div>
        <p>Your cart is empty</p>
        <Button onClick={() => navigate("/")}>Go Shopping</Button>
      </div>
    )
  }
  return(
    <div className="grid grid-cols-3">
        <div className="col-span-2 justify-items-start">
            <h1 className="">Cart</h1>
        </div>
        <div>
            <h1>Checkout</h1>
        </div>
    </div>
  )
}
