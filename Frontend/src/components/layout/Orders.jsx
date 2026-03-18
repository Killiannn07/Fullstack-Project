import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { formatCurrencyRp } from "../../utils/formatCurrency";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

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

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.get(`/order/${user.id}`);
      setOrders(res.data.data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

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

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#94a3b8"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">No orders yet</p>
        <Button onClick={() => navigate("/")}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Your Orders
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Order history and status updates will appear here.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {orders.map((o) => {
          const status = statusConfig[o.status] || {
            label: o.status,
            className: "bg-gray-100 text-gray-600 border border-gray-200",
          };
          return (
            <div
              key={o.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow duration-200"
            >
              <div className="grid grid-cols-5 items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded-lg">
                    #{String(o.id).padStart(4, "0")}
                  </span>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>

                <p className="text-xs text-slate-400 text-center col-span-2">
                  {new Date(o.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <div className="text-center ">
                  <p className="text-base font-bold text-slate-900">
                    {formatCurrencyRp(o.total_price)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {o.total_items} item{o.total_items > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => navigate(`/order/${o.id}`)}>
                    Detail
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
