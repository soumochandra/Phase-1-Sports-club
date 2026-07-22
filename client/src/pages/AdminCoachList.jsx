import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Search,
  Eye,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { getAllCoaches } from "../services/adminApi";

import "../styles/admin.css";

function AdminCoachList() {
  const navigate = useNavigate();

  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllCoaches();

      setCoaches(data.coaches || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load coaches."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCoaches = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return coaches;

    return coaches.filter((coach) => {
      return (
        coach.name?.toLowerCase().includes(value) ||
        coach.portalUserId?.toLowerCase().includes(value) ||
        coach.sport?.toLowerCase().includes(value)
      );
    });
  }, [coaches, search]);

  return (
    <main className="admin-dashboard-page">
      <div className="admin-dashboard-container">

        <section className="admin-dashboard-header">
          <div>
            <span className="registration-label">
              ADMIN PANEL
            </span>

            <h1>Coach Management</h1>

            <p>View and manage registered coaches.</p>
          </div>
        </section>

        <section className="athlete-table-card glass-card">

          <div className="athlete-table-header">

            <div>
              <h2>Coach List</h2>
              <p>{filteredCoaches.length} coach records</p>
            </div>

            <div className="athlete-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search Coach..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              <p>Loading Coaches...</p>
            </div>
          ) : filteredCoaches.length === 0 ? (
            <div className="admin-empty">
              <Users size={50} />
              <h3>No Coaches Found</h3>
            </div>
          ) : (
            <div className="athlete-table-wrapper">

              <table className="athlete-table">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Portal ID</th>
                    <th>Sport</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredCoaches.map((coach) => (
                    <tr key={coach.id}>

                      <td>{coach.name}</td>

                      <td>{coach.portalUserId}</td>

                      <td>{coach.sport}</td>

                      <td>{coach.experience} Years</td>

                      <td>
                        <span
                          className={`status-badge status-${(
                            coach.status || "pending"
                          ).toLowerCase()}`}
                        >
                          {coach.status || "Pending"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="view-athlete-button"
                          onClick={() =>
                            navigate(`/admin/coaches/${coach.id}`)
                          }
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default AdminCoachList;