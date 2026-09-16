const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error?.message || "Request failed.");
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
  me(token) {
    return request("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  dashboard(token) {
    return request("/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};
