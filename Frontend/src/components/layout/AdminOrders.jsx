import { useEffect, useState } from "react";
import api from "../../api/axios";
import { formatCurrencyRp } from "../../utils/formatCurrency";
 
const statusConfig = {
  pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    select: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  on_delivery: {
    label: "On Delivery",
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
    select: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  complete: {
    label: "Completed",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    select: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
};
 
export default function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState(null);
 
  const fetchOrders = async () => {
    const res = await api.get("/order/admin/all");
    setOrders(res.data.data);
    setLoading(false);
  };
 
  useEffect(() => {
    fetchOrders();
  }, []);
 
  const updateStatus = async (orderId, status) => {
    setUpdating((prev) => ({ ...prev, [orderId]: true }));
    setError(null);
    
    try {
      await api.patch(`/order/${orderId}/status`, { status });
      await fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal update status");
      // Kembalikan ke nilai sebelumnya (refresh data)
      await fetchOrders();
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };
 
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
          <p className="text-slate-400 text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">⚠️ {error}</p>
          <p className="text-red-600 text-xs mt-1">
            Status hanya bisa berubah satu arah: Pending → On Delivery → Completed
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Orders</h1>
        <p className="text-slate-400 text-sm mt-1">{orders.length} total orders</p>
      </div>
 
      {/* Table header */}
      <div className="grid grid-cols-5 px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-2">
        <span>Order</span>
        <span className="text-left">User ID</span>
        <span className="text-left">Items</span>
        <span className="text-left">Total</span>
        <span className="text-center">Status</span>
      </div>
 
      {/* Orders list */}
      <div className="flex flex-col gap-2">
        {orders.map((o) => {
          const status = statusConfig[o.status] || statusConfig.pending;
 
          return (
            <div
              key={o.id}
              className="grid grid-cols-5 items-center bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 hover:shadow-md transition-shadow duration-200"
            >
              {/* Order ID */}
              <div>
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                  #{String(o.id).padStart(4, "0")}
                </span>
                <p className="text-xs text-slate-400 mt-1.5">
                  {new Date(o.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
 
              {/* User ID */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                  {o.user_id}
                </div>
                <span className="text-sm text-slate-500">User #{o.user_id}</span>
              </div>
 
              {/* Total items */}
              <p className="text-sm text-slate-500 text-left">
                {o.total_items} item{o.total_items > 1 ? "s" : ""}
              </p>
 
              {/* Total price */}
              <p className="text-sm font-bold text-slate-900 text-left">
                {formatCurrencyRp(o.total_price)}
              </p>
 
              {/* Status select */}
              <div className="flex justify-center">
                <div className="relative">
                  {updating[o.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg z-10">
                      <svg className="animate-spin w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                    </div>
                  )}
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    disabled={updating[o.id] || o.status === "complete"}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer outline-none appearance-none pr-7 ${status.select} ${o.status === "complete" ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="on_delivery">On Delivery</option>
                    <option value="complete">Completed</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}