import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { signOut } from "firebase/auth";

import {
  AlertCircle,
  Download,
  Eye,
  LoaderCircle,
  LogOut,
  Search,
  Users,
} from "lucide-react";

import { auth } from "../config/firebase";
import { getAllAthletes } from "../services/adminApi";

import "../styles/admin.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [athletes, setAthletes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllAthletes();

        setAthletes(data.athletes || []);
      } catch (fetchError) {
        console.error(
          "Fetch athletes error:",
          fetchError
        );

        setError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            "Failed to load athletes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  const filteredAthletes = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return athletes;
    }

    return athletes.filter((athlete) => {
      const fullName = `${athlete.firstName || ""} ${
        athlete.lastName || ""
      }`.toLowerCase();

      return (
        fullName.includes(searchValue) ||
        String(athlete.mobile || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(athlete.ageGroup || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(athlete.competitionApplied || "")
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }, [athletes, search]);

  const escapeCSV = (value) => {
    const text = String(value ?? "");

    return `"${text.replace(/"/g, '""')}"`;
  };

  const handleExport = () => {
    if (athletes.length === 0) {
      return;
    }

    const headers = [
      "Athlete ID",
      "First Name",
      "Last Name",
      "Date of Birth",
      "Age",
      "Age Group",
      "Gender",
      "Mobile",
      "Email",
      "Guardian Name",
      "Guardian Mobile",
      "Guardian Relation",
      "Address",
      "City",
      "State",
      "PIN Code",
      "Club Name",
      "Representing State",
      "Competition Applied",
      "Status",
    ];

    const rows = athletes.map((athlete) => [
      athlete.id,
      athlete.firstName,
      athlete.lastName,
      athlete.dob,
      athlete.age,
      athlete.ageGroup,
      athlete.gender,
      athlete.mobile,
      athlete.email,
      athlete.guardianName,
      athlete.guardianMobile,
      athlete.guardianRelation,
      athlete.addressLine,
      athlete.city,
      athlete.state,
      athlete.pinCode,
      athlete.clubName,
      athlete.representingState,
      athlete.competitionApplied,
      athlete.status,
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) =>
        row.map(escapeCSV).join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      ["\uFEFF", csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const downloadLink =
      document.createElement("a");

    downloadLink.href = url;

    downloadLink.download =
      "athlete-registrations.csv";

    document.body.appendChild(downloadLink);

    downloadLink.click();

    downloadLink.remove();

    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    try {
      setError("");

      await signOut(auth);

      navigate("/admin/login", {
        replace: true,
      });
    } catch (logoutError) {
      console.error(
        "Logout error:",
        logoutError
      );

      setError(
        "Failed to logout. Please try again."
      );
    }
  };

  return (
    <main className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        <section className="admin-dashboard-header">
          <div>
            <span className="registration-label">
              ADMIN PANEL
            </span>

            <h1>Sports Club Dashboard</h1>

            <p>
              View and manage athlete registrations.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              className="export-button"
              onClick={handleExport}
              disabled={athletes.length === 0}
            >
              <Download size={19} />
              Export CSV
            </button>

            <button
              type="button"
              className="admin-logout-button"
              onClick={handleLogout}
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </section>

        <section className="dashboard-stat-card glass-card">
          <div className="dashboard-stat-icon">
            <Users size={25} />
          </div>

          <div className="dashboard-stat-content">
            <span>Total Athletes</span>

            <strong>{athletes.length}</strong>
          </div>
        </section>

        <section className="athlete-table-card glass-card">
          <div className="athlete-table-header">
            <div>
              <h2>Athlete Registrations</h2>

              <p>
                {filteredAthletes.length} athlete records
              </p>
            </div>

            <div className="athlete-search">
              <Search size={20} />

              <input
                type="text"
                placeholder="Search athlete..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </div>

          {error && (
            <div className="admin-error">
              <AlertCircle size={20} />

              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="admin-loading">
              <LoaderCircle
                size={38}
                className="loading-icon"
              />

              <p>Loading athletes...</p>
            </div>
          ) : filteredAthletes.length === 0 ? (
            <div className="admin-empty">
              <Users size={45} />

              <h3>No Athletes Found</h3>

              <p>
                No matching registration records.
              </p>
            </div>
          ) : (
            <div className="athlete-table-wrapper">
              <table className="athlete-table">
                <thead>
                  <tr>
                    <th>Athlete</th>

                    <th>Age Group</th>

                    <th>Mobile</th>

                    <th>Competition</th>

                    <th>Status</th>

                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAthletes.map(
                    (athlete) => (
                      <tr key={athlete.id}>
                        <td>
                          <strong>
                            {athlete.firstName || "-"}{" "}
                            {athlete.lastName || ""}
                          </strong>
                        </td>

                        <td>
                          {athlete.ageGroup || "-"}
                        </td>

                        <td>
                          {athlete.mobile || "-"}
                        </td>

                        <td>
                          {athlete.competitionApplied ||
                            "-"}
                        </td>

                        <td>
                          <span
                            className={`status-badge status-${(
                              athlete.status || "pending"
                            ).toLowerCase()}`}
                          >
                            {athlete.status || "pending"}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="view-athlete-button"
                            onClick={() =>
                              navigate(
                                `/admin/athletes/${athlete.id}`
                              )
                            }
                          >
                            <Eye size={17} />

                            View
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;