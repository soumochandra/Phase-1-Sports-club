import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, LoaderCircle, AlertCircle, LogOut } from "lucide-react";
import api from "../services/api";
import "../styles/admin.css";
import "../styles/portalDashboard.css";

function PortalDashboard() {
  const location = useLocation();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const userId = params.get("userId");

        if (!userId) {
          setError("Missing portal credentials");
          setLoading(false);
          return;
        }

        const response = await api.get(`/athletes/portal/dashboard?userId=${encodeURIComponent(userId)}`);
        setDashboard(response.data.dashboard);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [location.search]);

  if (loading) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-card glass-card animate-fade-up">
          <LoaderCircle size={28} className="loading-icon" />
          <p>Loading your dashboard...</p>
        </div>
      </main>
    );
  }

return (
  <main className="portal-dashboard-page">
    <div className="portal-dashboard-container">

      <section className="portal-hero">

        <div className="portal-profile">

          <div className="portal-avatar">
            {dashboard?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div>

            <span className="portal-subtitle">
              ATHLETE PORTAL
            </span>

            <h1>
              Welcome,
              <br />
              {dashboard?.name}
            </h1>

            <p>
              Track your registration progress,
              payment and competition details.
            </p>

          </div>

        </div>

        <div className="portal-status">

          <span className="portal-status-title">
            Registration Status
          </span>

          <div
            className={`portal-status-badge ${dashboard?.status}`}
          >
            {dashboard?.status}
          </div>

          <Link
            to="/portal/login"
            className="portal-logout-btn"
          >
            <LogOut size={18} />
            Logout
          </Link>

        </div>

      </section>

      {error && (
        <div className="portal-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <section className="portal-stats">

        <div className="portal-stat-card">
          <div className="portal-stat-icon">
            <LayoutDashboard size={26} />
          </div>

          <span>User ID</span>

          <h3>{dashboard?.userId}</h3>
        </div>

        <div className="portal-stat-card">

          <div className="portal-stat-icon">
            🏆
          </div>

          <span>Competition</span>

          <h3>
            {dashboard?.competition || "-"}
          </h3>

        </div>

        <div className="portal-stat-card">

          <div className="portal-stat-icon">
            💳
          </div>

          <span>Payment</span>

          <h3
            className={
              dashboard?.paymentStatus
            }
          >
            {dashboard?.paymentStatus}
          </h3>

        </div>

        <div className="portal-stat-card">

          <div className="portal-stat-icon">
            👤
          </div>

          <span>Role</span>

          <h3>
            {dashboard?.role}
          </h3>

        </div>

      </section>

      <section className="portal-grid">

        <div className="portal-card">

          <h2>
            Athlete Information
          </h2>

          <div className="portal-info">

            <div>
              <label>Name</label>
              <strong>
                {dashboard?.name}
              </strong>
            </div>

            <div>
              <label>User ID</label>
              <strong>
                {dashboard?.userId}
              </strong>
            </div>

            <div>
              <label>Competition</label>
              <strong>
                {dashboard?.competition}
              </strong>
            </div>

            <div>
              <label>Role</label>
              <strong>
                {dashboard?.role}
              </strong>
            </div>

            <div>
              <label>Payment</label>
              <strong>
                {dashboard?.paymentStatus}
              </strong>
            </div>

            <div>
              <label>Status</label>
              <strong>
                {dashboard?.status}
              </strong>
            </div>

          </div>

        </div>

        <div className="portal-card">

          <h2>
            Registration Progress
          </h2>

          <div className="portal-timeline">

            <div className="timeline-item completed">
              <span />
              Registration Submitted
            </div>

            <div className="timeline-item completed">
              <span />
              Payment Completed
            </div>

            <div
              className={`timeline-item ${
                dashboard?.status ===
                "approved"
                  ? "completed"
                  : "active"
              }`}
            >
              <span />
              Admin Verification
            </div>

            <div
              className={`timeline-item ${
                dashboard?.status ===
                "approved"
                  ? "completed"
                  : ""
              }`}
            >
              <span />
              Ready for Competition
            </div>

          </div>

        </div>

      </section>

      <section className="portal-actions">

        <div className="portal-action-card">
          <h3>
            Competition
          </h3>

          <p>
            View your competition
            registration information.
          </p>
        </div>

        <div className="portal-action-card">
          <h3>
            Payment
          </h3>

          <p>
            Registration payment has been
            recorded successfully.
          </p>
        </div>

        <div className="portal-action-card">
          <h3>
            Documents
          </h3>

          <p>
            Uploaded documents are under
            verification.
          </p>
        </div>

      </section>

    </div>
  </main>
);
}

export default PortalDashboard;
