import { useEffect, useState } from "react";
import { LoginPage } from "../features/auth/LoginPage.jsx";
import { DashboardPage } from "../features/dashboard/DashboardPage.jsx";
import { api } from "../lib/api.js";

export function App() {
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem("environode.session");
    return stored ? JSON.parse(stored) : null;
  });
  const [booting, setBooting] = useState(Boolean(session?.token));

  useEffect(() => {
    if (!session?.token) {
      return;
    }

    api
      .me(session.token)
      .then((data) => {
        setSession((current) => ({ ...current, ...data }));
      })
      .catch(() => {
        localStorage.removeItem("environode.session");
        setSession(null);
      })
      .finally(() => setBooting(false));
  }, []);

  function handleLogin(nextSession) {
    localStorage.setItem("environode.session", JSON.stringify(nextSession));
    setSession(nextSession);
  }

  function handleLogout() {
    localStorage.removeItem("environode.session");
    setSession(null);
  }

  if (booting) {
    return <main className="centered-page">Loading Environode...</main>;
  }

  if (!session?.token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <DashboardPage session={session} onLogout={handleLogout} />;
}
