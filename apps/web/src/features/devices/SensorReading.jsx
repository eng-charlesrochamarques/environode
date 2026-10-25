import { Droplets, Thermometer } from "lucide-react";
import { memo } from "react";

export const SensorReading = memo(function SensorReading({ sensor, detailed = false }) {
  const Icon = sensor.kind === "temperature" ? Thermometer : Droplets;
  const measurement = sensor.latestMeasurement;
  return (
    <div className="sensor-reading">
      <div className="sensor-description"><Icon size={17} /><span>{sensor.name}</span></div>
      <div className="sensor-value">
        <strong>{measurement ? `${measurement.value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} ${sensor.unit}` : "--"}</strong>
        {detailed && <small>{measurement ? new Date(measurement.timestamp).toLocaleString("pt-BR") : "Sem leitura"}</small>}
      </div>
    </div>
  );
});
