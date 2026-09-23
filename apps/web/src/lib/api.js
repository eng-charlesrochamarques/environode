const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error?.message || "Nao foi possivel concluir a solicitacao.");
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  login(credentials) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
  },
  logout() {
    return request("/api/auth/logout", { method: "POST" });
  },
  me() {
    return request("/api/auth/me");
  },
  dashboard() {
    return request("/api/dashboard");
  },
  device(deviceId) {
    return request(`/api/devices/${encodeURIComponent(deviceId)}`);
  },
  alerts() {
    return request("/api/alerts");
  }
};
