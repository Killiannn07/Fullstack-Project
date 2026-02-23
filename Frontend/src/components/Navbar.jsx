import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const {cart} = useCart()
  const totalitems = cart.reduce((acc, item) => acc + item.quantity, 0)
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ padding: "10px", borderBottom: "1px white" }}>
      <span>
        {user.email} ({user.role})
      </span>
      <Link to="/cart">
        Cart {totalitems > 0 && <span>({totalitems})</span>} 
      </Link>
      <button onClick={handleLogout} style={{ marginLeft: "20px" }}>
        Logout
      </button>
    </div>
  );
}

export default Navbar