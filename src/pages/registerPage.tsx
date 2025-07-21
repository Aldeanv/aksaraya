import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  register as registerService,
  login as loginService,
} from "../services/authService";
import { useAuth } from "../context/AuthContext";
import backgroundImg from "../assets/Background.svg";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerService({ name, email, password });

      const res = await loginService({ email, password });
      login(res.user, res.token);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(
          axiosErr.response?.data?.message || "Registrasi gagal, coba lagi."
        );
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${backgroundImg})`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <div className="w-full max-w-xl bg-white rounded-lg shadow-xs p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center mb-4">
            <h1
              className="text-lg sm:text-4xl font-bold text-gray-900 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="text-orange-600">Aksara</span>ya
            </h1>
          </div>
          <p className="text-gray-500 mt-1">Daftar untuk melanjutkan</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2 px-4 rounded-md text-white bg-orange-500 hover:bg-orange-600 transition disabled:opacity-70"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <button
            className="text-orange-600 hover:underline"
            onClick={() => navigate("/login")}
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
}
