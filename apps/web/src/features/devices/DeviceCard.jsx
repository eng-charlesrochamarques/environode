import { ArrowRight } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router";
import { StatusBadge } from "../../components/ui/StatusBadge.jsx";
import { SensorReading } from "./SensorReading.jsx";

export const DeviceCard = memo(function DeviceCard({ device }) {
  return (
    <article className="device-card">
      <div className="device-card-header">
        <div><h3>{device.name}</h3><span>{device.site?.name || "Local não informado"}</span></div>
        <StatusBadge status={device.status} />
      </div>
      <div className="sensor-list">{device.sensors.map((sensor) => <SensorReading key={sensor.id} sensor={sensor} />)}</div>
      <Link className="device-link" to={`/centrais/${encodeURIComponent(device.id)}`}>Ver detalhes <ArrowRight size={16} /></Link>
    </article>
  );
});
