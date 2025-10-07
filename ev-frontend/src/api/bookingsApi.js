import axiosClient from "./axiosClient";

export const bookingsApi = {
    list: async ({ q = "", status, from, to, page = 1, pageSize = 10} = {}) => {
        const params = { q, page, pageSize};
        if(status) params.status = status;
        if (from) params.from = new Date(from).toISOString();
        if (to) params.to = new Date(to).toISOString();
        const res = await axiosClient.get("/bookings", { params });
        return res.data;
    },

    get: async (id) => {
        const res = await axiosClient.get(`/bookings/${encodeURIComponent(id)}`);
        return res.data;
    },

    create: async (payload) => {
        const res = await axiosClient.post("/bookings", payload);
        return res.data;
    },

    update: async (id, payload) => {
        const res = await axiosClient.put(`/bookings/${encodeURIComponent(id)}`, payload);
        return res.data;
    },

    cancel: async (id) => {
        await axiosClient.delete(`/bookings/${encodeURIComponent(id)}`);
    },

    approve: async(id) => {
        const res = await axiosClient.post(`/bookings/${encodeURIComponent(id)}/approve`);
        return res.data;
    },

    finalize: async (id) => {
        const res = await axiosClient.post(`/bookings/${encodeURIComponent(id)}/finalize`);
        return res.data;
    },
};

export default bookingsApi;