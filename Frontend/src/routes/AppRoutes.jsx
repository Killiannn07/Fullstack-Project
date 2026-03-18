import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Products from "../pages/Products";
import ProtectedRoute from "./ProtectedRoute";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import AdminOrder from "../pages/AdminOrder";
function AppRoutes() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Products/>} />
        <Route path="/cart" element={<ProtectedRoute> <Cart/> </ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute> <Orders/> </ProtectedRoute>} />
        <Route path="/order/:orderId" element={<ProtectedRoute> <OrderDetail/> </ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute> <AdminOrder/> </ProtectedRoute>} />
        
      </Routes>
  );
}

export default AppRoutes;
