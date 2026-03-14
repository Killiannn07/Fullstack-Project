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
      <div className="bg-third shadow-xl max-w-6xl w-full rounded-lg px-4 py-3 flex justify-between items-center">
        {user ? (
          <>
            <img src={logo} alt={logoAlt} className="h-8 w-auto" />
            
            <nav className="hidden md:flex w-1/2 items-center gap-20 justify-center py-2 px-4">
              <ul className="text-white font-semibold">About</ul>
              <ul className="text-white font-semibold">Contacts</ul>
              <ul className="text-white font-semibold">Products</ul>
            </nav>
            {/* <div className="hidden md:flex w-1/6 items-center justify-end">
              <input
                type="text"
                placeholder="Search product..."
                className="w-full px-4 py-2 bg-white border border-white rounded-lg  text-black outline-none"
              />
            </div> */}
            <div className="flex gap-4 items-center">
              <Link className="font-medium text-white px-2" to={"/cart"}>
                Cart{" "}
                {totalitems > 0 && (
                  <span className="text-white">({totalitems})</span>
                )}
              </Link>
              <Button onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </>
        ) : (
          <>
            <img src={logo} alt={logoAlt} className="h-8 w-auto" />
            <nav className="hidden md:flex w-1/2 items-center gap-20 justify-center py-2 px-4">
              <ul className="text-white font-semibold">About</ul>
              <ul className="text-white font-semibold">Contacts</ul>
              <ul className="text-white font-semibold">Products</ul>
            </nav>
            <div className="hidden md:flex w-1/6 items-center justify-end">
              <input
                type="text"
                placeholder="Search product..."
                className="w-full px-4 py-2 bg-white border border-white rounded-lg mx-10 text-black outline-none"
              />
            </div>
            <div className="flex gap-4 items-center">
              <Button  onClick = {() => navigate("/login")}>
                Login
              </Button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
