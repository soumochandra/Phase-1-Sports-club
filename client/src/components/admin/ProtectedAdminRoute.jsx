import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { LoaderCircle } from "lucide-react";

import { auth } from "../../config/firebase";

import "../../styles/admin.css";

function ProtectedAdminRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="admin-auth-loading-page">
        <LoaderCircle
          size={42}
          className="loading-icon"
        />

        <h2>Verifying Admin Access</h2>

        <p>Please wait...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedAdminRoute;