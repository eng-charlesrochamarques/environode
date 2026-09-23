import { Outlet } from "react-router";
import { AppHeader } from "./AppHeader.jsx";
import { AppSidebar } from "./AppSidebar.jsx";
import { AppFooter } from "./AppFooter.jsx";

export function AppLayout({ session, onLogout }) {
  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="main-column">
        <AppHeader session={session} onLogout={onLogout} />
        <main className="workspace"><Outlet /></main>
        <AppFooter />
      </div>
    </div>
  );
}
