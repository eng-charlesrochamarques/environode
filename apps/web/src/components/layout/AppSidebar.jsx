import { Activity, Bell, Server } from "lucide-react";
import { NavLink } from "react-router";

export function AppSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand"><span className="brand-icon"><Activity size={21} /></span><span>Environode</span></div>
      <nav aria-label="Navegação principal">
        <NavLink to="/centrais" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <Server size={18} /> Centrais
        </NavLink>
        <NavLink to="/alertas" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <Bell size={18} /> Alertas
        </NavLink>
      </nav>
    </aside>
  );
}
