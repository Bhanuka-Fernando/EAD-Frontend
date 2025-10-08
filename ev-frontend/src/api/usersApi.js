import axiosClient from "./axiosClient";

const ADMIN_BASE = "/admin/staff"; 

async function list({ q = "", role = "All", page = 1, pageSize = 10 } = {}) {
  const params = { q, page, pageSize };
  if (role && role !== "All") params.role = role; // "Backoffice" | "Operator"

  const res = await axiosClient.get(ADMIN_BASE, { params });
  const data = res.data;

  if (Array.isArray(data)) {
    return { total: data.length, items: data };
  }
  const items = data.items ?? [];
  const total = data.total ?? items.length;
  return { total, items };
}

export const usersApi = {
  list,

  // My profile (Backoffice & Operator)
  getMyProfile: () => axiosClient.get("/users/me/profile").then(r => r.data),
  updateMyProfile: (payload) => axiosClient.put("/users/me/profile", payload).then(r => r.data),
  changeMyPassword: (payload) => axiosClient.put("/users/me/password", payload).then(r => r.data),
};

export default usersApi;
