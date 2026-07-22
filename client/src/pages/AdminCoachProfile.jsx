import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  CheckCircle,
  XCircle,
  Ban,
  User,
  Mail,
  Phone,
  Trophy,
  Briefcase,
} from "lucide-react";

import {
  getCoachById,
  updateCoachStatus,
  getAvailableAthletes,
  getAssignedAthletes,
  assignAthletesToCoach,
  removeAssignedAthlete,
} from "../services/adminApi";


import "../styles/admin.css";

function AdminCoachProfile() {
  const { id } = useParams();

  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableAthletes, setAvailableAthletes] = useState([]);
const [assignedAthletes, setAssignedAthletes] = useState([]);
const [selectedAthletes, setSelectedAthletes] = useState([]);
const [loadingAssignments, setLoadingAssignments] = useState(false);

  useEffect(() => {
  fetchCoach();
  loadAssignments();
}, []);

  const fetchCoach = async () => {
    try {
      const data = await getCoachById(id);
      setCoach(data.coach);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
  try {
    setLoadingAssignments(true);

    const available = await getAvailableAthletes(id);
    const assigned = await getAssignedAthletes(id);

    setAvailableAthletes(available.athletes || []);
    setAssignedAthletes(assigned.athletes || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingAssignments(false);
  }
};

  const changeStatus = async (status) => {
    try {
      await updateCoachStatus(id, status);

      alert("Coach status updated successfully.");

      fetchCoach();
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };
  const handleCheckbox = (athleteId) => {
  setSelectedAthletes((prev) =>
    prev.includes(athleteId)
      ? prev.filter((id) => id !== athleteId)
      : [...prev, athleteId]
  );
};

const handleAssign = async () => {
  if (selectedAthletes.length === 0) {
    alert("Select athletes");
    return;
  }

  try {
    await assignAthletesToCoach(id, selectedAthletes);

    alert("Athletes assigned successfully");

    setSelectedAthletes([]);

    loadAssignments();
  } catch (err) {
    console.error(err);
  }
};

const handleRemove = async (athleteId) => {
  try {
    await removeAssignedAthlete(id, athleteId);

    loadAssignments();
  } catch (err) {
    console.error(err);
  }
};

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <main className="admin-dashboard-page">

      <div className="admin-dashboard-container">

        <div className="glass-card profile-card">

          <div className="profile-header">

            <User size={70} />

            <div>

              <h2>
  {coach.firstName} {coach.lastName}
</h2>

              <span
                className={`status-badge status-${coach.status}`}
              >
                {coach.status}
              </span>

            </div>

          </div>

          <div className="profile-grid">

            <div>
              <Mail size={18} />
              <strong>Email</strong>
              <p>{coach.email}</p>
            </div>

            <div>
              <Phone size={18} />
              <strong>Phone</strong>
              <p>{coach.mobile}</p>
            </div>

            <div>
              <Trophy size={18} />
              <strong>Sport</strong>
              <p>{coach.sport}</p>
            </div>

            <div>
              <Briefcase size={18} />
              <strong>Experience</strong>
              <p>{coach.experience} Years</p>
            </div>

            <div>
              <strong>Specialization</strong>
              <p>{coach.specialization}</p>
            </div>

            <div>
              <strong>Qualification</strong>
              <p>{coach.qualification}</p>
            </div>

            <div>
              <strong>Address</strong>
              <p>
  {coach.addressLine},
  {coach.city},
  {coach.district},
  {coach.state} -
  {coach.pinCode}
</p>
            </div>

          </div>

          <hr className="profile-divider" />

<div className="assignment-section">
  <h3>Assigned Athletes</h3>

  {assignedAthletes.length === 0 ? (
    <p>No athletes assigned.</p>
  ) : (
    assignedAthletes.map((athlete) => (
      <div
        key={athlete.id}
        className="assignment-card"
      >
        <div>
          <h4>
            {athlete.firstName} {athlete.lastName}
          </h4>

          <p>
            {athlete.competitionApplied}
          </p>
        </div>

        <button
          className="reject-btn"
          onClick={() =>
            handleRemove(athlete.id)
          }
        >
          Remove
        </button>
      </div>
    ))
  )}
</div>

<hr className="profile-divider" />

<div className="assignment-section">

  <h3>Available Athletes</h3>

  {loadingAssignments ? (
    <p>Loading...</p>
  ) : availableAthletes.length === 0 ? (
    <p>No available athletes.</p>
  ) : (
    availableAthletes.map((athlete) => (
      <label
        key={athlete.id}
        className="assignment-checkbox"
      >
        <input
          type="checkbox"
          checked={selectedAthletes.includes(
            athlete.id
          )}
          onChange={() =>
            handleCheckbox(athlete.id)
          }
        />

        {athlete.firstName} {athlete.lastName}
      </label>
    ))
  )}

  <button
    className="approve-btn"
    onClick={handleAssign}
  >
    Assign Selected
  </button>

</div>

          <div className="status-buttons">

            <button
              className="approve-btn"
              onClick={() =>
                changeStatus("approved")
              }
            >
              <CheckCircle size={18} />
              Approve
            </button>

            <button
              className="reject-btn"
              onClick={() =>
                changeStatus("rejected")
              }
            >
              <XCircle size={18} />
              Reject
            </button>

            <button
              className="suspend-btn"
              onClick={() =>
                changeStatus("suspended")
              }
            >
              <Ban size={18} />
              Suspend
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}

export default AdminCoachProfile;