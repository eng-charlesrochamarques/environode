const clients = new Map();

export function subscribe(organizationId, response) {
  const group = clients.get(organizationId) || new Set();
  group.add(response);
  clients.set(organizationId, group);
  return () => {
    group.delete(response);
    if (!group.size) clients.delete(organizationId);
  };
}

export function publish(organizationId, event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const response of clients.get(organizationId) || []) response.write(payload);
}
