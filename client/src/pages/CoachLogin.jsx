import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, LoaderCircle, LogIn } from "lucide-react";

import api from "../services/api";
import "../styles/coachLogin.css";

function CoachLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.userId.trim() || !formData.password) {
      setError("Enter your Coach ID and password.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const response = await api.post(
        "/coaches/portal/login",
        {
          userId: formData.userId.trim(),
          password: formData.password,
        }
      );

      const user = response.data.user;

      navigate(
        `/coach/dashboard?userId=${encodeURIComponent(
          user.userId
        )}`
      );
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          "Coach login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="coach-login-page">
      <section className="coach-login-card">
        <span className="coach-login-label">COACH PORTAL</span>

        <h1>Welcome Back, Coach</h1>

        <p>
          Sign in with the Coach ID and 6-digit password created
          during registration.
        </p>

        {error && (
          <div className="coach-login-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="coach-login-form">
          <label htmlFor="userId">
            Coach ID

            <input
              id="userId"
              name="userId"
              type="text"
              placeholder="Example: COA-rahul-A1B2"
              value={formData.userId}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </label>

          <label htmlFor="password">
            Password

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your 6-digit password"
              value={formData.password}
              onChange={handleChange}
              inputMode="numeric"
              maxLength="6"
              autoComplete="current-password"
              required
            />
          </label>

          <button
            type="submit"
            className="coach-login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle size={18} className="loading-icon" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Coach Login
              </>
            )}
          </button>
        </form>

        <p className="coach-login-footer">
          Not registered yet?{" "}
          <Link to="/coach/register">Register as Coach</Link>
        </p>
      </section>
    </main>
  );
}

export default CoachLogin;