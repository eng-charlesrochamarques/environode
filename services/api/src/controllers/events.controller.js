import { subscribe } from "../services/realtime.service.js";

export function streamEvents(req, res) {
  res.status(200).set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive", "X-Accel-Buffering": "no" });
  res.flushHeaders();
  res.write(`event: connected\ndata: {"connected":true}\n\n`);
  const unsubscribe = subscribe(req.user.organizationId, res);
  const heartbeat = setInterval(() => res.write(`: heartbeat\n\n`), 20_000);
  req.on("close", () => { clearInterval(heartbeat); unsubscribe(); });
}
