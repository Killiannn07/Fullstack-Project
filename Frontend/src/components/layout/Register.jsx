import { useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { FaUser } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Semua field harus diisi");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password harus minimal 6 karakter");
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
      setError("Password harus berisi huruf dan angka");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/register", { email, password });
      navigate("/login");
    } catch (error) {
      const errormessage =
        error.response?.data?.message || "Gagal mendaftar. Silakan coba lagi.";
      setError(errormessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface px-8 py-12 rounded-2xl shadow-2xl max-w-sm w-full max-h-fit justify-self-center">
      <form className="flex flex-col gap-4" onSubmit={handleRegister}>
        <h1 className="text-4xl font-bold text-center text-text-primary">
          Register
        </h1>
        <h3 className="text-lg font-bold text-center text-text-secondary">
          Create an account!
        </h3>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="relative w-full">
          <h3 className="py-2 flex justify-start text-text-primary">Email</h3>
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
          <h3 className="py-2 flex justify-start text-text-primary ">
            Password
          </h3>
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
        <div className="relative w-full">
          <h3 className="py-2 flex justify-start text-text-primary ">
            Confirm Password
          </h3>
          <input
            className="w-full h-full bg-white py-2 pl-2 pr-8 border border-fourth focus:ring-ring focus:ring-1 rounded-xl outline-none"
            placeholder="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        <p className="font-semibold">
          Do you have an account?{" "}
          <Link
            to="/login"
            className="font-bold underline hover:text-primary-hover"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
