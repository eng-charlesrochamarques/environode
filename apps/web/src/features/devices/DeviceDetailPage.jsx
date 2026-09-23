import { ArrowLeft, Radio } from "lucide-react";
import { useCallback } from "react";
import { Link, useParams } from "react-router";
import { PageState } from "../../components/ui/PageState.jsx";
import { StatusBadge } from "../../components/ui/StatusBadge.jsx";
import { useResource } from "../../hooks/useResource.js";
import { api } from "../../lib/api.js";
import { SensorReading } from "./SensorReading.jsx";

export function DeviceDetailPage({ onUnauthorized }) {
  const { deviceId } = useParams();
  const load = useCallback(() => api.device(deviceId), [deviceId]);
  const { data, error, loading, refresh } = useResource(load, onUnauthorized);
  const device = data?.device;

  return (
    <>
      <Link className="back-link" to="/centrais"><ArrowLeft size={17} /> Centrais</Link>
      <PageState loading={loading} error={error} onRetry={refresh}>
        {device && <>
          <div className="page-heading detail-heading"><div><h1>{device.name}</h1><p>{device.site?.name || "Local não informado"}</p></div><StatusBadge status={device.status} /></div>
          <div className="detail-meta">
            <div><span>Modelo</span><strong>{device.model}</strong></div>
            <div><span>Localização</span><strong>{device.site?.location || "Não informada"}</strong></div>
            <div><span>Última comunicação</span><strong>{device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString("pt-BR") : "Sem registro"}</strong></div>
          </div>
          <section className="sensor-section">
            <div className="section-heading"><h2>Sensores</h2><span>{device.sensors.length} instalados</span></div>
            <div className="sensor-detail-list">{device.sensors.map((sensor) => <SensorReading key={sensor.id} sensor={sensor} detailed />)}</div>
          </section>
          <p className="detail-footnote"><Radio size={16} /> Leituras de demonstração, sem transmissão em tempo real.</p>
        </>}
      </PageState>
    </>
  );
}
