import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

// Athlete Pages
import AthleteRegistration from "./pages/AthleteRegistration";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import PortalLogin from "./pages/PortalLogin";
import PortalDashboard from "./pages/PortalDashboard";
import AthleteProfile from "./pages/AthleteProfile";

// Coach Pages
import CoachRegistration from "./pages/CoachRegistration";
import CoachLogin from "./pages/CoachLogin";
import CoachDashboard from "./pages/CoachDashboard";
import AdminCoachList from "./pages/AdminCoachList";
import AdminCoachProfile from "./pages/AdminCoachProfile";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <div className="page-container">
      <Navbar />

      <Routes>
        {/* ================= Athlete ================= */}

        <Route path="/" element={<AthleteRegistration />} />

        <Route
          path="/register"
          element={<AthleteRegistration />}
        />

        <Route
          path="/registration-success"
          element={<RegistrationSuccess />}
        />

        <Route
          path="/portal/login"
          element={<PortalLogin />}
        />

        <Route
          path="/portal/:role/dashboard"
          element={<PortalDashboard />}
        />

        {/* ================= Coach ================= */}

        <Route
          path="/coach/register"
          element={<CoachRegistration />}
        />

        <Route
          path="/coach/login"
          element={<CoachLogin />}
        />

        <Route
          path="/coach/dashboard"
          element={<CoachDashboard />}
        />

        {/* ================= Admin ================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* Athlete Management */}

        <Route
          path="/admin/athletes/:id"
          element={
            <ProtectedAdminRoute>
              <AthleteProfile />
            </ProtectedAdminRoute>
          }
        />

        {/* Coach Management */}

        <Route
          path="/admin/coaches"
          element={
            <ProtectedAdminRoute>
              <AdminCoachList />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/coaches/:id"
          element={
            <ProtectedAdminRoute>
              <AdminCoachProfile />
            </ProtectedAdminRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;