import { Link } from "react-router-dom";
import {
  Dumbbell,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import "../../styles/footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo & Description */}
        <div className="footer-section">
          <div className="footer-logo">
            <Dumbbell size={32} />
            <h2>Sports Club</h2>
          </div>

          <p className="footer-description">
            Sports Club Management System is a digital platform
            for athlete registration, competition management,
            coach coordination and administration.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/register">
                Athlete Registration
              </Link>
            </li>

            <li>
              <Link to="/portal/login">
                Member Login
              </Link>
            </li>

            <li>
              <Link to="/admin/login">
                Admin Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>

          <div className="footer-contact">

            <span>
              <MapPin size={18} />
              Kolkata, West Bengal, India
            </span>

            <span>
              <Phone size={18} />
              +91 XXXXX XXXXX
            </span>

            <span>
              <Mail size={18} />
              support@sportsclub.com
            </span>

          </div>
        </div>

        {/* Social */}
        <div className="footer-section">
          <h3>Follow Us</h3>

         <div className="footer-social">
  <a
    href="https://github.com"
    target="_blank"
    rel="noopener noreferrer"
  >
    GitHub
  </a>

  <a
    href="https://linkedin.com"
    target="_blank"
    rel="noopener noreferrer"
  >
    LinkedIn
  </a>
</div>
        </div>

      </div>

      <div className="footer-bottom">
        © {year} Sports Club Management System. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;