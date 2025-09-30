import axiosClient from "./axiosClient";

export const usersApi = {
    getMyProfile: () => axiosClient.get("/users/me/profile").then(r => r.data),
    updateMyProfile: (payload) => axiosClient.put("/users/me/profile", payload).then(r => r.data),
    changeMyPassword: (payload) => axiosClient.put("/users/me/password", payload).then(r => r.data),
};

export default usersApi;