import { useState, useEffect } from "react";
import { login as loginService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await loginService({ email, password });
      login(res.user, res.token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-4 border rounded space-y-4 shadow">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
