import { useEffect, useState, useRef } from "react";
import { SlClose } from "react-icons/sl";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

export default function DetailProduct({ product, onClose, addToCart }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const timeoutRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    timeoutRef.current = setTimeout(() => {
      onClose?.();
    }, 100);
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await addToCart(product.id, quantity);
      setAdded(true);
      setQuantity(1);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      alert("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all duration-300 ${
        visible ? "bg-black/60" : "bg-black/0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transition-all duration-300 ${
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-95"
        }`}
      >
        <div className="h-56 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <SlClose />
          </button>
        </div>
        <div className="p-7">
          <h2>{product.name}</h2>
          {product.description && (
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              {product.description}
            </p>
          )}
          <div className="border-t border-stone-100 my-4" />
          <div className="flex items-center grid grid-cols-2 justify-between gap-4">
            <div className="justify-items-start">
              <p className="text-xs text-gray-400 tracking-widest uppercase mb-1 ">
                Harga
              </p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {Number(product.price).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="justify-items-end">
              <div className="mb-4">
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">
                  Quantity
                </p>
                <div className="flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-lg px-2 py-1 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || loading}
                    className="px-2 py-1 text-slate-900 hover:bg-stone-200 rounded disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 font-semibold text-slate-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={loading}
                    className="px-2 py-1 text-slate-900 hover:bg-stone-200 rounded disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>
              
            </div>
          </div>
          <div className="justify-items-center">
            <button
                onClick={handleAddToCart}
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold tracking-wide transition-all duration-300 ${
                  added
                    ? "bg-emerald-500 shadow-lg shadow-emerald-200"
                    : "bg-slate-900 hover:bg-slate-700 shadow-lg shadow-slate-200"
                } ${loading ? "opacity-80 cursor-not-allowed scale-95" : "hover:scale-105"}`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Loading...
                  </>
                ) : added ? (
                  <>
                    <FaCheck/>
                    Added!
                  </>
                ) : (
                  <>
                    <MdOutlineShoppingCart className="scale-130"/>
                    Add to Cart
                  </>
                )}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
