import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  LogOut,
} from "lucide-react";

import "../../styles/admin.css";

function Sidebar({ totalAthletes, onExport, onLogout }) {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Sports Club</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/admin/dashboard"
          className="sidebar-item"
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <div className="sidebar-item">
          <Users size={20} />
          <span>Athletes</span>

          <small className="sidebar-count">
            {totalAthletes}
          </small>
        </div>

        <button
          className="sidebar-item sidebar-button"
          onClick={onExport}
        >
          <FileSpreadsheet size={20} />
          <span>Export CSV</span>
        </button>

        <button
          className="sidebar-item sidebar-button logout"
          onClick={onLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;