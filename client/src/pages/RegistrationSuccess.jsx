import { useLocation, Link } from "react-router-dom";

import {
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import "../styles/registration.css";

function RegistrationSuccess() {
  const location = useLocation();

  const athleteId = location.state?.athleteId;
  const portalUserId = location.state?.portalUserId;
  const portalPassword = location.state?.portalPassword;

  return (
    <main className="success-page">
      <div className="success-card glass-card animate-fade-up">
        <div className="success-icon">
          <CheckCircle2 size={45} />
        </div>

        <span className="registration-label">
          REGISTRATION COMPLETE
        </span>

        <h1>You're all set!</h1>

        <p>
          Your athlete registration has been successfully
          submitted and is now pending admin review.
        </p>

        {athleteId && (
          <div className="registration-id">
            <span>Registration ID</span>

            <strong>{athleteId}</strong>
          </div>
        )}

        {portalUserId && (
          <div className="registration-id" style={{ marginTop: "0.75rem" }}>
            <span>Portal User ID</span>
            <strong>{portalUserId}</strong>
          </div>
        )}

        {portalPassword && (
          <div className="registration-id" style={{ marginTop: "0.75rem" }}>
            <span>Portal Password</span>
            <strong>{portalPassword}</strong>
          </div>
        )}

        <Link to="/register" className="primary-button">
          Register Another Athlete
          <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  );
}

export default RegistrationSuccess;