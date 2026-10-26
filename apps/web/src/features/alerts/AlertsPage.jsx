import { ArrowRight, Bell, Clock3 } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router";
import { Modal } from "../../components/ui/Modal.jsx";
import { PageState } from "../../components/ui/PageState.jsx";
import { useResource } from "../../hooks/useResource.js";
import { useTelemetryEvents } from "../../hooks/useTelemetryEvents.js";
import { api } from "../../lib/api.js";

const severityLabels = { warning: "Atenção", critical: "Crítico" };

export function AlertsPage({ onUnauthorized }) {
  const { data, error, loading, refresh } = useResource(api.alerts, onUnauthorized);
  const [selected, setSelected] = useState(null);
  const handleTelemetry = useCallback(() => refresh(), [refresh]);
  useTelemetryEvents(handleTelemetry);

  return (
    <>
      <div className="page-heading"><div><h1>Alertas</h1><p>Eventos associados às centrais da sua conta.</p></div></div>
      <PageState loading={loading} error={error} onRetry={refresh}>
        <div className="alerts-list">
          {data?.alerts.length === 0 && <p className="empty-state">Nenhum alerta registrado.</p>}
          {data?.alerts.map((alert) => (
            <button className="alert-item" type="button" key={alert.id} onClick={() => setSelected(alert)}>
              <span className={`alert-indicator severity-${alert.severity}`}><Bell size={18} /></span>
              <span className="alert-copy"><strong>{alert.deviceName}</strong><span>{alert.message}</span></span>
              <span className="alert-time">{new Date(alert.createdAt).toLocaleString("pt-BR")}</span>
              <ArrowRight size={17} />
            </button>
          ))}
        </div>
      </PageState>
      <Modal open={Boolean(selected)} title="Detalhes do alerta" onClose={() => setSelected(null)}>
        {selected && <>
          <p className={`alert-severity severity-${selected.severity}`}>{severityLabels[selected.severity] || selected.severity}</p>
          <h3>{selected.deviceName}</h3>
          <p>{selected.message}</p>
          <p className="modal-time"><Clock3 size={16} /> {new Date(selected.createdAt).toLocaleString("pt-BR")}</p>
          <Link className="text-link" to={`/centrais/${encodeURIComponent(selected.deviceId)}`} onClick={() => setSelected(null)}>Abrir central <ArrowRight size={16} /></Link>
        </>}
      </Modal>
    </>
  );
}
