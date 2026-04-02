import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import Button from "../ui/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi token
    if (!resetToken) {
      setError("Reset token tidak valid atau expired");
      return;
    }

    // Validasi form
    if (!newPassword || !confirmPassword) {
      setError("Semua field harus diisi");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    // Validasi password minimal 6 karakter
    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    // Validasi password harus ada huruf dan angka
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (!hasLetter || !hasNumber) {
      setError("Password harus berisi huruf dan angka");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(`/auth/reset-password?token=${resetToken}`, {
        newPassword,
        confirmPassword,
      });
      setSuccess("Password berhasil direset! Redirect ke login...");
      
      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal reset password";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface px-8 py-12 rounded-2xl shadow-2xl max-w-sm w-full max-h-fit justify-self-center">
      <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
        <h1 className="text-4xl font-bold text-center text-text-primary">
          Reset Password
        </h1>
        <h3 className="text-lg font-bold text-center text-text-secondary">
          Masukkan password baru Anda
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
          <h3 className="py-2 flex justify-start text-text-primary">
            Password Baru
          </h3>
          <input
            className="w-full h-full bg-white py-2 pl-2 pr-8 border border-fourth focus:ring-ring focus:ring-1 rounded-xl outline-none"
            placeholder="Password Baru"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          <h3 className="py-2 flex justify-start text-text-primary">
            Konfirmasi Password
          </h3>
          <input
            className="w-full h-full bg-white py-2 pl-2 pr-8 border border-fourth focus:ring-ring focus:ring-1 rounded-xl outline-none"
            placeholder="Konfirmasi Password"
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

        <div className="text-sm text-text-secondary">
          <p>✓ Minimal 6 karakter</p>
          <p>✓ Harus ada huruf dan angka</p>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Mereset..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
