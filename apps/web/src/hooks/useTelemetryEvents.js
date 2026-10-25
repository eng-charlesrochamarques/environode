import { useEffect, useState } from "react";
import { EVENTS_URL } from "../lib/api.js";

export function useTelemetryEvents(onTelemetry) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const source = new EventSource(EVENTS_URL, { withCredentials: true });
    source.addEventListener("connected", () => setConnected(true));
    source.addEventListener("telemetry", (event) => {
      try { onTelemetry(JSON.parse(event.data)); } catch { /* Evento inválido é ignorado. */ }
    });
    source.onerror = () => setConnected(false);
    return () => source.close();
  }, [onTelemetry]);

  return connected;
}
