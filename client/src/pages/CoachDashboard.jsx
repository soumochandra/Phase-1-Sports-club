import { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Users,
  Trophy,
  Calendar,
  ClipboardCheck,
  Activity,
  LogOut,
} from "lucide-react";

import "../styles/coachDashboard.css";

function CoachDashboard() {
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = new URLSearchParams(window.location.search).get("userId");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/coaches/portal/dashboard?userId=${userId}`
        );

        console.log("API Response:", response.data);
console.log("Dashboard:", response.data.dashboard);

setCoach(response.data.dashboard);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, [userId]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/coach/login";
  };

  if (loading) {
    return (
      <div className="coach-loading">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="coach-dashboard">

      <header className="coach-header">
        <div>
          <h1>Coach Dashboard</h1>
          <p>Welcome back, {coach?.name}</p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <section className="coach-profile-card">

        <div className="avatar">
          <User size={60} />
        </div>

        <div className="coach-details">
          <h2>{coach?.name}</h2>

          <span className="status">
            {coach?.status}
          </span>

          <p>
            <strong>Portal ID:</strong>{" "}
            {coach?.userId}
          </p>

          <p>
            <strong>Sport:</strong>{" "}
            {coach?.sport}
          </p>

          <p>
            <strong>Experience:</strong>{" "}
            {coach?.experience} Years
          </p>
        </div>

      </section>

      <section className="stats-grid">

        <div className="stat-card">
          <Users />
          <h3>
            {coach?.assignedAthletes || 0}
          </h3>
          <p>Athletes</p>
        </div>

        <div className="stat-card">
          <ClipboardCheck />
          <h3>0</h3>
          <p>Attendance</p>
        </div>

        <div className="stat-card">
          <Calendar />
          <h3>0</h3>
          <p>Training Sessions</p>
        </div>

        <div className="stat-card">
          <Trophy />
          <h3>0</h3>
          <p>Competitions</p>
        </div>

      </section>

      <section className="quick-actions">

        <div className="action-card">
          <Users size={40} />
          <h3>Assigned Athletes</h3>
        </div>

        <div className="action-card">
          <ClipboardCheck size={40} />
          <h3>Attendance</h3>
        </div>

        <div className="action-card">
          <Activity size={40} />
          <h3>Performance</h3>
        </div>

        <div className="action-card">
          <Calendar size={40} />
          <h3>Training Schedule</h3>
        </div>

      </section>

    </div>
  );
}

export default CoachDashboard;