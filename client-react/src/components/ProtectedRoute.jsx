import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";

function ProtectedRoute({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setIsCheckingAuth(false);
      }
    );

    return unsubscribe;
  }, []);

  if (isCheckingAuth) {
    return (
      <main className="loading-page">
        <p>Checking admin access...</p>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <Navigate
        to="/admin-login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;