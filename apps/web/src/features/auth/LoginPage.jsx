import { Activity, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { api } from "../../lib/api.js";

const demoAccounts = [
  {
    label: "NovaLab Electronics",
    email: "ana@novalab.example"
  },
  {
    label: "Circuito Verde Labs",
    email: "bruno@circuitoverde.example"
  }
];

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(demoAccounts[0].email);
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = await api.login({ email, password });
      onLogin(session);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="brand-mark">
          <Activity size={28} />
        </div>
        <h1>Environode</h1>
        <p>Customer environmental monitoring portal</p>

        <div className="demo-switcher" aria-label="Demo customers">
          {demoAccounts.map((account) => (
            <button
              className={email === account.email ? "selected" : ""}
              key={account.email}
              type="button"
              onClick={() => setEmail(account.email)}
            >
              {account.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="primary-button" type="submit" disabled={loading}>
            <LockKeyhole size={18} />
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
