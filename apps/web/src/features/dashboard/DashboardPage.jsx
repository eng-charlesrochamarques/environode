import { Activity, AlertTriangle, Radio, RefreshCw, Server } from "lucide-react";
import { useCallback } from "react";
import { MetricCard } from "../../components/ui/MetricCard.jsx";
import { PageState } from "../../components/ui/PageState.jsx";
import { DeviceCard } from "../devices/DeviceCard.jsx";
import { useResource } from "../../hooks/useResource.js";
import { useTelemetryEvents } from "../../hooks/useTelemetryEvents.js";
import { api } from "../../lib/api.js";

export function DashboardPage({ onUnauthorized }) {
  const { data, error, loading, refresh } = useResource(api.dashboard, onUnauthorized);
  const handleTelemetry = useCallback(() => refresh(), [refresh]);
  const live = useTelemetryEvents(handleTelemetry);

  return (
    <>
      <div className="page-heading">
        <div><h1>Centrais</h1><p>Acompanhe os equipamentos e sensores da sua conta.</p></div>
        <button className="icon-button" type="button" onClick={refresh} disabled={loading} title="Atualizar leituras" aria-label="Atualizar leituras"><RefreshCw size={19} /></button>
      </div>
      <p className={`live-notice ${live ? "connected" : "connecting"}`}><Radio size={16} /> {live ? "Telemetria em tempo real conectada" : "Conectando à telemetria..."}</p>
      <PageState loading={loading} error={error} onRetry={refresh}>
        {data && <>
          <section className="metrics-grid" aria-label="Resumo das centrais">
            <MetricCard icon={Server} label="Centrais" value={data.totals.devices} />
            <MetricCard icon={Activity} label="Ativas" value={data.totals.onlineDevices} tone="blue" />
            <MetricCard icon={AlertTriangle} label="Alertas ativos" value={data.totals.activeAlerts} tone="amber" />
            <MetricCard icon={Server} label="Sem conexão" value={data.totals.offlineDevices} tone="red" />
          </section>
          <section aria-label="Centrais do cliente">
            <div className="section-heading"><h2>Seus equipamentos</h2><span>{data.devices.length} centrais</span></div>
            <div className="device-grid">{data.devices.map((device) => <DeviceCard key={device.id} device={device} />)}</div>
          </section>
        </>}
      </PageState>
    </>
  );
}
