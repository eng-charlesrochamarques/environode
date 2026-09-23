import { useCallback, useEffect, useState } from "react";
import { AppRoutes } from "../routes/AppRoutes.jsx";
import { api } from "../lib/api.js";

export function App() {
  const [session, setSession] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    localStorage.removeItem("environode.session");
    api
      .me()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setBooting(false));
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // A tela volta ao login mesmo se a sessao ja expirou.
    }
    setSession(null);
  }, []);

  if (booting) {
    return <main className="centered-page">Carregando Environode...</main>;
  }

  return <AppRoutes session={session} onLogin={setSession} onLogout={handleLogout} />;
}
