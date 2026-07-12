import { useState } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Menu, X, ShieldCheck } from "lucide-react";

import "../../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Dumbbell size={24} />
          </div>

          <div className="logo-text">
            <h2>SportSync</h2>
            <span>Club Management</span>
          </div>
        </Link>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/register" onClick={() => setMenuOpen(false)}>
            Athlete Registration
          </Link>

          <Link
            to="/admin/login"
            className="admin-link"
            onClick={() => setMenuOpen(false)}
          >
            <ShieldCheck size={18} />
            Admin
          </Link>
        </div>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>
    </nav>
  );
}

export default Navbar;