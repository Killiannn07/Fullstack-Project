import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import Button from "../ui/Button";
import { FaUser } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email harus diisi");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", { email });
      setSuccess("Email reset password telah dikirim ke email Anda");
      setEmail("");
      
      // Redirect ke login setelah 3 detik
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengirim email reset password";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface px-8 py-12 rounded-2xl shadow-2xl max-w-sm w-full max-h-fit justify-self-center">
      <form className="flex flex-col gap-4" onSubmit={handleForgotPassword}>
        <h1 className="text-4xl font-bold text-center text-text-primary">
          Forgot Password
        </h1>
        <h3 className="text-lg font-bold text-center text-text-secondary">
          Masukkan email Anda untuk reset password
        </h3>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 text-white p-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        <div className="relative w-full">
          <h3 className="py-2 flex justify-start text-text-primary">Email</h3>
          <input
            className="w-full h-full bg-white py-2 pl-2 pr-8 border border-fourth focus:ring-ring focus:ring-1 rounded-xl outline-none"
            placeholder="Masukkan email Anda"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <FaUser className="absolute right-3 top-15 -translate-y-1/2 text-black"></FaUser>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Mengirim..." : "Kirim Email Reset"}
        </Button>

        <p className="font-semibold text-center text-text-primary">
          Ingat password Anda?{" "}
          <Link to="/login" className="font-bold underline hover:text-primary-hover">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
