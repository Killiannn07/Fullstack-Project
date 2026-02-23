import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Products from "../pages/Products";
import ProtectedRoute from "./ProtectedRoute";
import Cart from "../pages/Cart";

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<ProtectedRoute> <Products/> </ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute> <Cart/> </ProtectedRoute>} />
        
      </Routes>
  );
}

export default AppRoutes;
