import { Navigate, Outlet, Route, Routes } from "react-router";
import { AppLayout } from "../components/layout/AppLayout.jsx";
import { LoginPage } from "../features/auth/LoginPage.jsx";
import { DashboardPage } from "../features/dashboard/DashboardPage.jsx";
import { DeviceDetailPage } from "../features/devices/DeviceDetailPage.jsx";
import { AlertsPage } from "../features/alerts/AlertsPage.jsx";

function RequireSession({ session }) {
  return session ? <Outlet /> : <Navigate to="/entrar" replace />;
}

export function AppRoutes({ session, onLogin, onLogout }) {
  return (
    <Routes>
      <Route path="/entrar" element={session ? <Navigate to="/centrais" replace /> : <LoginPage onLogin={onLogin} />} />
      <Route element={<RequireSession session={session} />}>
        <Route element={<AppLayout session={session} onLogout={onLogout} />}>
          <Route path="/centrais" element={<DashboardPage onUnauthorized={onLogout} />} />
          <Route path="/centrais/:deviceId" element={<DeviceDetailPage onUnauthorized={onLogout} />} />
          <Route path="/alertas" element={<AlertsPage onUnauthorized={onLogout} />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={session ? "/centrais" : "/entrar"} replace />} />
    </Routes>
  );
}
