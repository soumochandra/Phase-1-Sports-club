import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, AlertCircle } from "lucide-react";
import api from "../services/api";
import "../styles/portalLogin.css";

function PortalLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/athletes/portal/login", form);
      const user = response.data.user;
      navigate(`/portal/${user.role || "athlete"}/dashboard?userId=${encodeURIComponent(user.userId)}`);
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card glass-card animate-fade-up">
        <div className="admin-login-icon">
          <LogIn size={28} />
        </div>
        <span className="registration-label">PORTAL LOGIN</span>
        <h1>Athlete & Coach Login</h1>
        <p className="admin-login-description">
          Use the ID and password generated after registration to enter your dashboard.
        </p>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="registration-label" htmlFor="userId">User ID</label>
          <input
            id="userId"
            type="text"
            value={form.userId}
            onChange={(event) => setForm({ ...form, userId: event.target.value })}
            required
          />

          <label className="registration-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />

          <button type="submit" className="primary-button admin-login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <Link to="/register" className="secondary-button" style={{ marginTop: "1rem", display: "inline-block" }}>
          Register as Athlete
        </Link>
      </div>
    </main>
  );
}

export default PortalLogin;
