import axios from "axios";
import { getAuthKey } from "@/app/libs/auth";

const api = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
    const authKey = getAuthKey();
    if (authKey) {
        config.headers.Authorization = `Bearer ${authKey}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            return error.response;
        }
        return Promise.reject(error);
    },
);

export default api;
