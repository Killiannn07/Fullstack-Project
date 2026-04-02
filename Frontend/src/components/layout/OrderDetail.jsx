import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  on_delivery: {
    label: "On Delivery",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  complete: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
};

export default function OrderDetail() {
  const { orderId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await api.get(`/order/orderdetail/${orderId}`);
      setItems(res.data.data);
      setLoading(false);
    };
    fetchDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin w-8 h-8 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
            />
          </svg>
          <p className="text-slate-400 text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-slate-500 font-medium">Order not found</p>
        <button
          onClick={() => navigate("/orders")}
          className="px-5 py-2 bg-slate-900 text-white text-sm rounded-xl hover:bg-slate-700 transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const order = items[0];
  const status = statusConfig[order.status] || {
    label: order.status,
    className: "bg-gray-50 text-gray-700 border border-gray-200",
  };

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price_at_purchase * item.quantity,
    0,
  );

  return (
    <div className="max-w-3xl mx-auto px-6">
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-6 cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Orders
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="div">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Order #{String(order.order_id).padStart(4, "0")}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {new Date(order.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-4 py-1.5 rounded-full ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <div className="border-t border-slate-100 pt-4 flex justify-between text-sm text-slate-500">
          <span>
            {items.length} item{items.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="divide-y divide-slate-200 ">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-4  py-4 ">
              {/* Image */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 justify-items-start">
                <h4 className="font-semibold text-slate-900 truncate">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rp {Number(item.price_at_purchase).toLocaleString("id-ID")} ×{" "}
                  {item.quantity}
                </p>
              </div>

              {/* Subtotal */}
              <p className="font-bold text-slate-900 text-sm whitespace-nowrap">
                Rp{" "}
                {(item.price_at_purchase * item.quantity).toLocaleString(
                  "id-ID",
                )}
              </p>
            </div>
          ))}
        </div>

        <div className=" py-4 border-t border-slate-200 flex justify-between items-center">
          <span className="text-sm text-slate-500 font-medium">Total</span>
          <span className="text-lg font-bold text-accent">
            Rp {totalPrice.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
}
