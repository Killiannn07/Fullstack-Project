import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import api from "../../api/axios";
import { IoArrowBackCircleSharp } from "react-icons/io5";

export default function Cart() {
  const { cart, updateCart, removeCart, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState([]);

  const handleCheckAll = () => {
    if (checkedItems.length === cart.length && cart.length > 0) {
      setCheckedItems([]);
    } else {
      setCheckedItems(cart.map((item) => item.product_id));
    }
  };

  const handleCheck = (productId) => {
    setCheckedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const selectedItems = cart.filter((item) =>
    checkedItems.includes(item.product_id),
  );

  const totalPrice = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const totalItems = selectedItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  const handleCheckout = async () => {
    
    try {
      setLoading(true);
      const res = await api.post("/order/checkout", {
        cartItemIds: checkedItems,
      });
      await fetchCart();
      navigate("/orders");
      
    } catch (error) {
      console.error("Checkout gagal full error:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
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
    );
  }

  return (
    <div className="grid grid-cols-3 justify-between">
      <div className="col-span-2 justify-items-start mr-4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-row w-full items-end justify-between mb-6">
          <div className="flex">
            <button className="text-3xl cursor-pointer"><IoArrowBackCircleSharp/></button>
            <h1 className="font-bold text-3xl  ">Cart</h1>
          </div>
          
          <label className="flex items-center gap-2 text-md text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedItems.length === cart.length && cart.length > 0}
              onChange={handleCheckAll}
            />
            Pilih semua
          </label>
        </div>

        {cart.map((item) => (
          <div
            key={item.product_id}
            className={`flex gap-4 border-b pb-4 mb-4 w-full transition-all duration-200 ${
              checkedItems.includes(item.product_id)
                ? "opacity-100"
                : "opacity-60"
            }`}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={checkedItems.includes(item.product_id)}
                onChange={() => handleCheck(item.product_id)}
                className="w-4 h-4 accent-amber-700 cursor-pointer"
              />
            </div>
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-30 h-30 object-cover rounded justify-items-start"
              />
            )}
            <div className=" grid grid-cols-2 w-full">
              <div className="flex flex-col justify-between items-start">
                <h3 className="font-semibold text-lg pt-15 ">{item.name}</h3>
                <p className="text-lg font-bold text-primary ">
                  Rp {item.price?.toLocaleString("id-ID") || "0"}
                </p>
              </div>

              <div className="flex items-end gap-3 mt-3 justify-self-end">
                <button
                  onClick={() => updateCart(item.id, item.quantity - 1)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  -
                </button>
                <p className="font-medium">Qty: {item.quantity}</p>
                <button
                  onClick={() => updateCart(item.id, item.quantity + 1)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  +
                </button>
                <button
                  onClick={() => removeCart(item.id)}
                  className="ml-auto px-3 py-1 bg-red-400 text-white rounded hover:bg-red-500"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white flex flex-col h-fit sticky top-6 p-4 rounded-lg shadow-md justify-between min-h-fit ml-4">
        <div>
          <h1 className="font-bold text-3xl mb-8 ">Checkout</h1>
          {selectedItems.length > 0 ? (
            <div className="flex flex-col gap-3 mb-6">
              {selectedItems.map((item) => (
                <div
                  key={item.product_id}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span className="truncate max-w-32">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium text-gray-800">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}

              {/* Divider */}
              <div className="border-t border-dashed border-gray-200 my-2" />

              {/* Total items */}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Total Item</span>
                <span>{totalItems} pcs</span>
              </div>

              {/* Total price */}
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-amber-700">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm mb-6">
              Pilih produk yang ingin di-checkout
            </p>
          )}
        </div>
        <Button
          onClick={handleCheckout}
          disabled={loading || selectedItems.length === 0}
        >
          {loading
            ? "Processing..."
            : selectedItems.length === 0
              ? "Pilih Produk Dulu"
              : `Checkout (${selectedItems.length} produk)`}
        </Button>
      </div>
    </div>
  );
}
