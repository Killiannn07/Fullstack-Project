import { useState, useContext } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Button from "../ui/Button";
import { FaUser } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validasi form
    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data.data;
      login(token, user);
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login gagal, coba lagi";
      setError(errorMessage);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-third px-8 py-12 rounded-2xl shadow-2xl max-w-sm w-full max-h-fit justify-self-center">
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <h1 className="text-4xl font-bold text-center text-white">Login</h1>
        <h3 className="text-lg font-bold text-center text-gray-300">
          Welcome back!
        </h3>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="relative w-full">
          <h3 className="py-2 flex justify-start text-white">Email</h3>
          <input
            className="w-full h-full bg-white py-2 pl-2 pr-8 border border-fourth focus:ring-ring focus:ring-1 rounded-xl outline-none"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <FaUser className="absolute right-3 top-15 -translate-y-1/2 text-black"></FaUser>
        </div>
        <div className="relative w-full">
          <h3 className="py-2 flex justify-start text-white">Password</h3>
          <input
            className="w-full h-full bg-white py-2 pl-2 pr-8 border border-fourth focus:ring-ring focus:ring-1 rounded-xl outline-none"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-15 -translate-y-1/2 text-black cursor-pointer hover:text-gray-600"
            disabled={loading}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
