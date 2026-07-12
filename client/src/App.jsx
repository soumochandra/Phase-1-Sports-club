import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

import AthleteRegistration from "./pages/AthleteRegistration";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AthleteProfile from "./pages/AthleteProfile";

function App() {
  return (
    <div className="page-container">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<AthleteRegistration />}
        />

        <Route
          path="/register"
          element={<AthleteRegistration />}
        />

        <Route
          path="/registration-success"
          element={<RegistrationSuccess />}
        />

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

        <Route
          path="/admin/athletes/:id"
          element={
            <ProtectedAdminRoute>
              <AthleteProfile />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;