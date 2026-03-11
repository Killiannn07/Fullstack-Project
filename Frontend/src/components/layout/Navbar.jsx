import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Button from "../ui/Button";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useCart();
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
            <div className="text-sm text-black">
              {user.email}
              <span className="text-gray">({user.role})</span>
            </div>
            <div className="hidden md:flex w-1/2 items-center">
              <input
                type="text"
                placeholder="Search product..."
                className="w-full px-4 py-2 bg-white border border-white rounded-lg mx-10 text-black outline-none"
              />
            </div>
            <div className="flex gap-4 items-center">
              <Link className="font-medium text-white" to={"/cart"}>
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
            <div className="text-lg text-white font-bold">Ian Shop</div>
            <div className="hidden md:flex w-1/2 items-center">
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
