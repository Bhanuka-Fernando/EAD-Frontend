const BASE = import.meta.env.VITE_API_BASE ?? "https://localhost:7217";

export const authApi = {
  async login({ username, password }) {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error(`Login failed (${res.status})`);
    return res.json(); // { token, role, username }
  },
};
