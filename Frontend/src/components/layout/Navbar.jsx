import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useApp } from "../../context/AppContext";
import Button from "../ui/Button";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useCart();
  const { logo, logoAlt } = useApp();
  const navigate = useNavigate();

  const totalitems = user && cart ? cart.length : 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex justify-center py-4">
      <div className="bg-primary shadow-xl max-w-6xl w-full rounded-lg px-4 py-3 flex justify-between items-center">
        {user ? (
          <>
            <img src={logo} alt={logoAlt} onClick={() => navigate("/")} className="h-8 w-auto cursor-pointer" />
            <nav className="hidden md:flex w-1/2 items-center gap-20 justify-center py-2 px-4">
              <ul className="text-white font-semibold">About</ul>
              <ul className="text-white font-semibold">Contacts</ul>
              <ul className="text-white font-semibold" onClick={() => navigate("/orders")}>My Orders</ul>
            </nav>
            <div className="flex gap-4 items-center">
              {user.role === "admin" ? (
                <Link className="font-medium text-white px-2" to={"/admin/orders"}>
                  Orders
                </Link>
              ) : (
                <Link className="font-medium text-white px-2" to={"/cart"}>
                  Cart{" "}
                  {totalitems > 0 && (
                    <span className="text-white">({totalitems})</span>
                  )}
                </Link>
              )}
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          </>
        ) : (
          <>
            <img src={logo} alt={logoAlt} className="h-8 w-auto" />
            <nav className="hidden md:flex w-1/2 items-center gap-20 justify-center py-2 px-4">
              <ul className="text-white font-semibold cursor-pointer">About</ul>
              <ul className="text-white font-semibold cursor-pointer">Contacts</ul>
              <ul className="text-white font-semibold cursor-pointer">Products</ul>
            </nav>
            <div className="flex gap-4 items-center">
              <Button onClick={() => navigate("/login")}>Login</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
