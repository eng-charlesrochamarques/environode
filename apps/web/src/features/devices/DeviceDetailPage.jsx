import { ArrowLeft, Radio } from "lucide-react";
import { useCallback } from "react";
import { Link, useParams } from "react-router";
import { PageState } from "../../components/ui/PageState.jsx";
import { StatusBadge } from "../../components/ui/StatusBadge.jsx";
import { useResource } from "../../hooks/useResource.js";
import { useTelemetryEvents } from "../../hooks/useTelemetryEvents.js";
import { api } from "../../lib/api.js";
import { SensorReading } from "./SensorReading.jsx";
import { applyTelemetryToDevice } from "../telemetry/applyTelemetryEvent.js";

export function DeviceDetailPage({ onUnauthorized }) {
  const { deviceId } = useParams();
  const load = useCallback(async () => {
    const [deviceData, measurementData] = await Promise.all([api.device(deviceId), api.deviceMeasurements(deviceId)]);
    return { ...deviceData, ...measurementData };
  }, [deviceId]);
  const { data, error, loading, refresh, update } = useResource(load, onUnauthorized);
  const device = data?.device;
  const handleTelemetry = useCallback((event) => {
    if (event.deviceId === deviceId) update((current) => applyTelemetryToDevice(current, event));
  }, [deviceId, update]);
  const live = useTelemetryEvents(handleTelemetry);

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
          <section className="history-section">
            <div className="section-heading"><h2>Histórico recente</h2><span>{data.measurements.length} leituras</span></div>
            <div className="measurement-table-wrap"><table className="measurement-table"><thead><tr><th>Horário</th><th>Sensor</th><th>Valor</th></tr></thead><tbody>
              {data.measurements.map((measurement) => {
                const sensor = device.sensors.find((item) => item.id === measurement.sensorId);
                return <tr key={measurement.id}><td>{new Date(measurement.sampledAt).toLocaleString("pt-BR")}</td><td>{sensor?.name || measurement.sensorId}</td><td>{measurement.value.toLocaleString("pt-BR")} {sensor?.unit || ""}</td></tr>;
              })}
              {!data.measurements.length && <tr><td colSpan="3">Aguardando a primeira telemetria.</td></tr>}
            </tbody></table></div>
          </section>
          <p className={`detail-footnote ${live ? "is-live" : ""}`}><Radio size={16} /> {live ? "Atualização em tempo real ativa." : "Reconectando à telemetria..."}</p>
        </>}
      </PageState>
    </>
  );
}
