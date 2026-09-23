import { LogOut } from "lucide-react";

export function AppHeader({ session, onLogout }) {
  return (
    <header className="app-header">
      <div>
        <span className="header-label">Área do cliente</span>
        <strong>{session.organization.name}</strong>
      </div>
      <div className="header-actions">
        <span className="user-name">{session.user.name}</span>
        <button className="icon-button" type="button" onClick={onLogout} title="Sair" aria-label="Sair">
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}
