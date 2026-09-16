import {
  AlertTriangle,
  Building2,
  LogOut,
  MapPin,
  Server,
  ThermometerSun
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../lib/api.js";

export function DashboardPage({ session, onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .dashboard(session.token)
      .then(setDashboard)
      .catch((requestError) => setError(requestError.message));
  }, [session.token]);

  if (error) {
    return (
      <main className="centered-page">
        <p>{error}</p>
        <button className="secondary-button" type="button" onClick={onLogout}>
          Back to login
        </button>
      </main>
    );
  }

  if (!dashboard) {
    return <main className="centered-page">Loading customer dashboard...</main>;
  }

  const { organization, totals, sites, devices, recentAlerts } = dashboard;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <ThermometerSun size={24} />
          <span>Environode</span>
        </div>
        <nav>
          <a className="active">Dashboard</a>
          <a>Sites</a>
          <a>Devices</a>
          <a>Alerts</a>
          <a>Settings</a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Customer portal</p>
            <h1>{organization.name}</h1>
          </div>
          <button className="icon-button" type="button" onClick={onLogout} title="Sign out">
            <LogOut size={20} />
          </button>
        </header>

        <section className="metrics-grid" aria-label="Customer overview">
          <Metric icon={MapPin} label="Sites" value={totals.sites} />
          <Metric icon={Server} label="Devices" value={totals.devices} />
          <Metric icon={Building2} label="Online" value={totals.onlineDevices} />
          <Metric icon={AlertTriangle} label="Active alerts" value={totals.activeAlerts} />
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <h2>Devices</h2>
              <span>{devices.length} registered</span>
            </div>
            <div className="device-list">
              {devices.map((device) => (
                <article className="device-row" key={device.id}>
                  <div>
                    <strong>{device.name}</strong>
                    <span>{device.model}</span>
                  </div>
                  <div className="device-reading">
                    <span className={`status-pill ${device.status}`}>{device.status}</span>
                    <span>
                      {device.latestMeasurement?.temperatureC ?? "--"} C /{" "}
                      {device.latestMeasurement?.humidityPercent ?? "--"}%
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Sites</h2>
              <span>{sites.length} locations</span>
            </div>
            <div className="site-list">
              {sites.map((site) => (
                <article className="site-row" key={site.id}>
                  <strong>{site.name}</strong>
                  <span>{site.location}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="panel wide-panel">
            <div className="panel-header">
              <h2>Recent alerts</h2>
              <span>{recentAlerts.length} events</span>
            </div>
            <div className="alert-list">
              {recentAlerts.map((alert) => (
                <article className="alert-row" key={alert.id}>
                  <span className={`severity-dot ${alert.severity}`} />
                  <div>
                    <strong>{alert.type.replaceAll("_", " ")}</strong>
                    <span>{alert.message}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <article className="metric-card">
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
