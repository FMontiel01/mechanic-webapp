import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoggingIn(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("Admin login failed:", error);

      setErrorMessage(
        "The email or password is incorrect. Please try again."
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <h1>Admin Login</h1>

        <p>Sign in to view and manage customer service requests.</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="adminEmail">Email Address</label>

            <input
              type="email"
              id="adminEmail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="adminPassword">Password</label>

            <input
              type="password"
              id="adminPassword"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {errorMessage && (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;