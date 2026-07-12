import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";

import {
  ShieldCheck,
  Mail,
  Lock,
  LogIn,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { auth } from "../config/firebase";

import "../styles/admin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/admin/dashboard");
    } catch (loginError) {
      console.error(loginError);

      setError("Invalid admin email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card glass-card animate-fade-up">
        <div className="admin-login-icon">
          <ShieldCheck size={35} />
        </div>

        <span className="registration-label">
          SECURE ADMIN ACCESS
        </span>

        <h1>Welcome Back</h1>

        <p className="admin-login-description">
          Sign in to manage athlete registrations and club data.
        </p>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="admin-input-group">
            <Mail size={19} />

            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="admin-input-group">
            <Lock size={19} />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="primary-button admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoaderCircle
                  size={19}
                  className="loading-icon"
                />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <LogIn size={19} />
              </>
            )}
          </button>
        </form>

        <div className="admin-security-note">
          <ShieldCheck size={15} />
          Authorized administrators only
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;