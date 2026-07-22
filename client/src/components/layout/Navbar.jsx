import { useState } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Menu, X, ShieldCheck } from "lucide-react";

import "../../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-icon">
            <Dumbbell size={24} />
          </div>

          <div className="logo-text">
            <h2>SportSync</h2>
            <span>Club Management</span>
          </div>
        </Link>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/register" onClick={closeMenu}>
            Athlete Registration
          </Link>

          <Link to="/portal/login" onClick={closeMenu}>
            Athlete Login
          </Link>

          <Link to="/coach/register" onClick={closeMenu}>
            Coach Registration
          </Link>

          <Link to="/coach/login" onClick={closeMenu}>
            Coach Login
          </Link>

          <Link
            to="/admin/login"
            className="admin-link"
            onClick={closeMenu}
          >
            <ShieldCheck size={18} />
            Admin
          </Link>
        </div>

        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen((previousState) => !previousState)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;